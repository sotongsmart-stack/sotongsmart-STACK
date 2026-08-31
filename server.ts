import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// AI Helper Endpoints
app.post('/api/gemini/generate-safety-doc', async (req, res) => {
  try {
    const { topic, category, targetAudience, difficulty } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in the environment.',
      });
    }

    const systemInstruction = `당신은 대한민국 최고의 안전교육 전문가 '김은경' 강사(한국안전교육협회 전문위원, 응급구조 및 재난안전 15년 경력)의 세컨드 브레인 AI 비서입니다.
전문적이고 신뢰성 높은 안전교육 표준 교안 및 행동지침 문서를 한국어로 작성하세요.
반드시 정확한 수치, 골든타임, 행동 순서, 법적 기준, 실제 현장 적용 사례를 포함하세요.`;

    const prompt = `[안전교육 교안 작성 요청]
- 주제: ${topic || '미지정 주제'}
- 분류: ${category || '지진안전'}
- 대상: ${targetAudience || '일반시민 및 사업장'}
- 난이도: ${difficulty || '기본 및 실습'}

다음 JSON 형식으로만 응답해주세요:
{
  "title": "명확하고 전문적인 문서 제목",
  "summary": "핵심 요약 (2-3문장)",
  "content": "마크다운 형식의 상세 교육 지침 (개요, 위험 요인 분석, 단계별 표준 행동요령, 골든타임 수칙, 주의사항 포함)",
  "keyActionPoints": ["핵심 행동요령 1", "핵심 행동요령 2", "핵심 행동요령 3", "핵심 행동요령 4"],
  "tags": ["태그1", "태그2", "태그3"],
  "checklist": ["점검 항목 1", "점검 항목 2", "점검 항목 3", "점검 항목 4"],
  "relatedTopics": ["연관 안전 분야 1", "연관 안전 분야 2"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error generating safety doc:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate safety document' });
  }
});

app.post('/api/gemini/generate-quiz', async (req, res) => {
  try {
    const { docTitle, docContent, category } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in the environment.',
      });
    }

    const prompt = `안전교육 문서 [${docTitle} / 분류: ${category}]를 기반으로 실전 상황 대처 능력을 평가하는 객관식 퀴즈 3문제를 출제해주세요.
문서 내용 요약: ${typeof docContent === 'string' ? docContent.slice(0, 1500) : ''}

JSON 형식으로 응답하세요:
{
  "quizzes": [
    {
      "question": "상황 제시형 질문",
      "options": ["선택지 1", "선택지 2", "선택지 3", "선택지 4"],
      "correctIndex": 0,
      "explanation": "안전 원리에 입각한 정답 해설 및 김은경 강사의 팁"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, quizzes: parsed.quizzes || [] });
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate quiz' });
  }
});

app.post('/api/gemini/ask-advisor', async (req, res) => {
  try {
    const { question, contextDocs } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in the environment.',
      });
    }

    const contextText = Array.isArray(contextDocs)
      ? contextDocs.map((d: any) => `[${d.category}] ${d.title}: ${d.summary}`).join('\n')
      : '';

    const systemInstruction = `당신은 안전교육자 '김은경'의 세컨드 브레인 지식 어드바이저입니다.
보유한 안전 지식(지진안전, 화재안전, 응급처치, 환경안전, 디지털안전)을 바탕으로 명쾌하고 실용적인 안전 가이드를 제공하세요.
위급 상황 행동 요령은 명확한 번호 매기기와 경각심을 주는 어조로 안내합니다.`;

    const prompt = `[참고 지식 데이터베이스]
${contextText}

[사용자 질문]
${question}

전문적이고 실천 가능한 안전 조언을 마크다운 형식으로 작성해주세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ success: true, answer: response.text || '답변을 생성할 수 없습니다.' });
  } catch (error: any) {
    console.error('Error in ask-advisor:', error);
    return res.status(500).json({ error: error.message || 'Failed to advise' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Vite middleware & Static serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Safety Second Brain Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
