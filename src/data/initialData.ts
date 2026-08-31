import { SafetyDoc, UserProfile } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-kim',
    name: '김은경',
    role: 'ADMIN',
    roleTitle: '대표 안전교육 총괄 / 수석 마스터',
    organization: '한국안전교육혁신원',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    color: '#2563eb', // blue
    email: 'ekkim.safety@edu.org',
    specialty: ['지진안전', '화재안전', '응급처치', '환경안전', '디지털안전'],
  },
  {
    id: 'user-park',
    name: '박준호',
    role: 'INSTRUCTOR',
    roleTitle: '전문 응급구조 강사 / 1급 응급구조사',
    organization: '한국안전교육혁신원 교육부',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    color: '#059669', // emerald
    email: 'jhpark.emt@edu.org',
    specialty: ['응급처치', '화재안전'],
  },
  {
    id: 'user-lee',
    name: '이서연',
    role: 'EDITOR',
    roleTitle: '산업환경안전 콘텐츠 연구원',
    organization: '재난안전연구센터',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    color: '#7c3aed', // purple
    email: 'sylee.env@edu.org',
    specialty: ['환경안전', '지진안전'],
  },
  {
    id: 'user-choi',
    name: '최유진',
    role: 'VIEWER',
    roleTitle: '사내 안전관리자 / 수강생',
    organization: '스마트제조안전팀',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    color: '#d97706', // amber
    email: 'yjchoi@partner.com',
    specialty: ['디지털안전', '화재안전'],
  },
  {
    id: 'user-guest',
    name: '정민우 (체험 게스트)',
    role: 'GUEST',
    roleTitle: '외부 참관생 / 신규 입사자',
    organization: '게스트',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    color: '#64748b', // slate
    email: 'guest@visitor.org',
    specialty: [],
  },
];

export const INITIAL_DOCS: SafetyDoc[] = [
  // 1. 응급처치: CPR & AED
  {
    id: 'doc-cpr-aed',
    slug: 'golden-hour-cpr-aed-standard',
    title: '4분 골든타임: 표준 심폐소생술(CPR) 및 자동심장충격기(AED) 실전 가이드',
    category: '응급처치',
    summary: '심정지 환자 발생 시 4분 이내 즉각적인 가슴 압박 및 AED 적용을 위한 최신 가이드라인. 가슴압박 30회, 인공호흡 2회 사이클 표준 프로토콜.',
    goldenTime: '4분 (뇌손상 방지 한계선)',
    emergencyContact: '119 (구급상황관리센터)',
    targetAudience: '전체',
    difficulty: '실무(표준)',
    status: 'PUBLISHED',
    priority: 'CRITICAL',
    authorId: 'user-kim',
    authorName: '김은경',
    lastEditedById: 'user-park',
    lastEditedByName: '박준호',
    createdAt: '2026-08-10T09:00:00Z',
    updatedAt: '2026-08-24T02:30:00Z',
    version: 'v3.2',
    viewCount: 1420,
    isBookmarked: true,
    accessLevel: 'PUBLIC',
    allowedRoles: ['ADMIN', 'INSTRUCTOR', 'EDITOR', 'VIEWER', 'GUEST'],
    editRoles: ['ADMIN', 'INSTRUCTOR'],
    allowedUserIds: [],
    editUserIds: ['user-kim', 'user-park'],
    relatedDocIds: ['doc-choking-heimlich', 'doc-earthquake-evac'],
    tags: ['심폐소생술', '골든타임', 'AED', '응급구조', '119신고', '가슴압박'],
    keyActionPoints: [
      '의식 확인 및 특정인 지목 119 신고 & AED 요청 ("검은 안경 쓰신 분 119, 파란 셔츠 분 AED 가져와주세요!")',
      '호흡 확인(10초 이내) 후 비정상 호흡(심정지 호흡) 시 즉시 가슴 압박 시작',
      '압박 위치: 흉골 아래쪽 절반 / 깊이 5~6cm / 속도 분당 100~120회',
      'AED 도착 즉시 전원 켜고 음성 안내에 따라 패드 부착(우측 쇄골 아래 + 좌측 젖꼭지 아래 겨드랑이선)',
    ],
    content: `## 🚨 1. 심정지 인식과 골든타임의 중요성

심정지 후 **4분이 경과하면 뇌세포 손상**이 시작되며, 10분이 지나면 뇌사 상태에 이를 가능성이 급격히 증가합니다. 
목격자에 의한 즉각적인 심폐소생술은 생존율을 **2~3배 이상 향상**시킵니다.

> ⏱️ **골든타임 4분 원칙**: 주저하지 말고 즉시 가슴 중앙을 강하고 빠르게 압박하십시오.

---

## 🏃 2. 행동 프로토콜 5단계

### Step 1: 현장 안전 확인 및 반응 평가
- 주변 위험 요소(화재, 감전, 낙하물) 확인 후 환자에게 접근
- 양 어깨를 가볍게 두드리며 큰 소리로 질문: *"괜찮으세요? 제 말 들리세요?"*

### Step 2: 특정인 지목 119 신고 및 AED 요청
- 막연히 외치지 않고 **인상착의를 지목**하여 역할을 분담합니다.
- *"빨간 넥타이 매신 분 119에 신고해주시고, 회색 후드티 입으신 분 건물 1층 로비 AED 가져와주세요!"*

### Step 3: 호흡 상태 확인 (10초 이내)
- 환자의 가슴 움직임과 호흡 소리를 10초 이내로 관찰합니다.
- 헐떡거림(Gasping)이나 비정상 호흡은 심정지 상태로 간주하고 즉각 가슴 압박을 시작합니다.

### Step 4: 고품질 가슴 압박 (30회)
1. 환자를 평평하고 단단한 바닥에 눕힙니다.
2. 깍지 낀 두 손의 손꿈치를 **가슴뼈(흉골) 아래쪽 절반**에 놓습니다.
3. 팔꿈치를 수직으로 곧게 펴고 체중을 실어 압박합니다.
   - **압박 깊이**: 약 5~6 cm
   - **압박 속도**: 분당 100~120회 (비지스의 'Stayin Alive' 리듬)
   - **이완**: 매 압박 후 가슴이 완전히 올라오도록 충분히 이완

### Step 5: 인공호흡 (2회) & 반복
- 머리를 젖히고 턱을 들어 기도를 확보한 후 코를 막고 1초씩 2회 가슴이 부풀어 오를 정도로 숨을 불어넣습니다.
- *인공호흡 교육을 받지 않았거나 꺼려지는 경우 가슴 압박만 중단 없이 지속합니다 (Hands-Only CPR).*

---

## ⚡ 3. 자동심장충격기(AED) 사용 수칙

\`\`\`
[AED 도착] -> [전원 켜기] -> [패드 부착] -> [심장리듬 분석(모두 물러나기)] -> [제세동 버튼(접촉 금지)] -> [즉시 CPR 재개]
\`\`\`

1. **전원 ON**: 기기 커버를 열거나 전원 버튼을 누릅니다.
2. **패드 부착**: 
   - 패드 1: 오른쪽 쇄골(빗장뼈) 바로 아래
   - 패드 2: 왼쪽 젖꼭지 아래 중간 겨드랑이선
3. **분석 중**: *"모두 물러나세요!"*를 외치고 환자와 접촉하지 않습니다.
4. **쇼크(제세동)**: 깜빡이는 주황색 버튼을 누른 즉시 다시 가슴 압박을 재개합니다.

---

## ⚠️ 김은경 강사의 현장 핵심 코칭
- **체력 안배**: 혼자 압박 시 2분이 지나면 피로로 압박 깊이가 얕아집니다. 주변 구조자와 **2분(5주기)마다 교대**하십시오.
- **두려움 극복**: "갈비뼈가 부러질까 봐 두려워 얕게 누르는 것"이 가장 위험합니다. 생명을 살리는 것이 최우선입니다.`,
    checklists: [
      { id: 'cpr-c1', text: '주변 현장 안전(감전, 차량, 낙하물) 확인 완료', checked: true },
      { id: 'cpr-c2', text: '특정인을 명확히 지목하여 119 신고 및 AED 수배 지시', checked: true },
      { id: 'cpr-c3', text: '분당 100~120회, 깊이 5~6cm 수직 가슴 압박 유지', checked: true },
      { id: 'cpr-c4', text: 'AED 분석 및 전기 충격 시 환자와 전원 신체 접촉 차단', checked: false },
      { id: 'cpr-c5', text: '119 구급대 도착 시까지 CPR 끊김 없이 지속', checked: false },
    ],
    quizzes: [
      {
        id: 'cpr-q1',
        question: '성인 심폐소생술 시 올바른 가슴 압박 위치와 권장 압박 속도는?',
        options: [
          '명치 끝부분, 분당 60~80회',
          '가슴뼈(흉골) 아래 1/2 지점, 분당 100~120회',
          '왼쪽 가슴 심장 부위, 분당 140회 이상',
          '목 바로 아래 흉골 상단, 분당 90회',
        ],
        correctIndex: 1,
        explanation: '성인 가슴압박은 가슴뼈(흉골) 아래쪽 절반에 손꿈치를 두고 분당 100~120회의 속도로 5~6cm 깊이로 강하고 빠르게 압박해야 합니다.',
      },
      {
        id: 'cpr-q2',
        question: 'AED(자동심장충격기)의 패드 부착 위치로 올바른 조합은?',
        options: [
          '양쪽 어깨 윗부분',
          '오른쪽 쇄골 아래 & 왼쪽 젖꼭지 아래 겨드랑이선',
          '왼쪽 가슴 중앙 & 등 뒤 척추 부위',
          '명치 바로 위 & 배꼽 주변',
        ],
        correctIndex: 1,
        explanation: '패드 1은 오른쪽 쇄골 아래, 패드 2는 왼쪽 젖꼭지 아래 겨드랑이선에 부착하여 심장을 관통하는 전기 경로를 형성해야 합니다.',
      },
    ],
    comments: [
      {
        id: 'comm-1',
        userId: 'user-park',
        userName: '박준호',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        userRole: 'INSTRUCTOR',
        content: '김은경 강사님, 최신 2025-2026 심폐소생술 가이드라인에 따른 Hands-only CPR 강조 부분을 2단계에 추가 반영 완료했습니다.',
        createdAt: '2026-08-20T11:20:00Z',
        resolved: true,
      },
      {
        id: 'comm-2',
        userId: 'user-choi',
        userName: '최유진',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        userRole: 'VIEWER',
        content: '사업장 AED 점검 주기(월 1회 녹색 램프 확인)도 체크리스트에 포함되면 좋을 것 같습니다!',
        createdAt: '2026-08-23T14:10:00Z',
        resolved: false,
      },
    ],
    revisions: [
      {
        id: 'rev-1',
        version: 'v3.2',
        editorId: 'user-park',
        editorName: '박준호',
        summary: '2026 표준 심폐소생술 가이드라인 개정 및 AED 패드 시각 가이드 보강',
        timestamp: '2026-08-24T02:30:00Z',
        contentSnapshot: '',
      },
      {
        id: 'rev-0',
        version: 'v3.0',
        editorId: 'user-kim',
        editorName: '김은경',
        summary: '최초 교안 작성 및 골든타임 행동지침 등록',
        timestamp: '2026-08-10T09:00:00Z',
        contentSnapshot: '',
      },
    ],
  },

  // 2. 지진안전: 실내외 행동요령 및 비상 배낭
  {
    id: 'doc-earthquake-evac',
    slug: 'earthquake-indoor-outdoor-evacuation',
    title: '지진 발생 시 공간별(실내/실외/운전중) 대피 수칙 및 비상 생존배낭 체크리스트',
    category: '지진안전',
    summary: '지진 진동 발생 순간 3대 기본 행동(몸보호, 머리보호, 흔들림 멈춤 대기)과 건물 붕괴 위험 탈출 경로, 비상 대피소 이동 요령 종합 지침.',
    goldenTime: '진동 시작 직후 1분 (탁자 밑 보호 & 문 열어 출구 확보)',
    emergencyContact: '행정안전부 국민재난안전포털 (119/112)',
    targetAudience: '전체',
    difficulty: '기초(입문)',
    status: 'PUBLISHED',
    priority: 'HIGH',
    authorId: 'user-kim',
    authorName: '김은경',
    lastEditedById: 'user-lee',
    lastEditedByName: '이서연',
    createdAt: '2026-08-12T14:00:00Z',
    updatedAt: '2026-08-23T16:45:00Z',
    version: 'v2.1',
    viewCount: 980,
    isBookmarked: true,
    accessLevel: 'ORG_WIDE',
    allowedRoles: ['ADMIN', 'INSTRUCTOR', 'EDITOR', 'VIEWER'],
    editRoles: ['ADMIN', 'INSTRUCTOR', 'EDITOR'],
    allowedUserIds: [],
    editUserIds: ['user-kim', 'user-lee'],
    relatedDocIds: ['doc-cpr-aed', 'doc-fire-extinguisher'],
    tags: ['지진대피', '드롭커버홀드온', '생존배낭', '옥외대피소', '가스밸브차단'],
    keyActionPoints: [
      '흔들리는 동안: Drop(낮추기) -> Cover(머리보호) -> Hold On(탁자 다리 붙잡기)',
      '흔들림 멈춘 직후: 전기 차단기 및 가스 밸브 즉시 잠그고 현관문 열어 탈출구 확보',
      '대피 시: 엘리베이터 절대 금지, 계단 이용, 가방이나 방석으로 머리 보호',
      '야외 이동 시: 건물 외벽 유리창 및 간판 낙하 주의하며 넓은 공터(운동장, 공원)로 이동',
    ],
    content: `## 🏗️ 1. 지진 발생 순간: 3대 핵심 행동 원칙 (D.C.H)

지진의 주요 진동은 대개 **1분 이내**에 멈춥니다. 당황하여 밖으로 뛰어나가면 떨어지는 유리창, 타일, 간판에 맞아 큰 부상을 입습니다.

\`\`\`
1. DROP (몸을 낮춘다)
2. COVER (튼튼한 테이블 밑으로 들어가 머리와 목을 감싼다)
3. HOLD ON (흔들림이 멈출 때까지 테이블 다리를 꽉 잡고 버틴다)
\`\`\`

---

## 🏢 2. 장소별 맞춤 대피 요령

### 1) 아파트 및 가정 실내
- **테이블 보호**: 튼튼한 탁자 아래로 들어가 머리를 보호합니다. 탁자가 없으면 방석 등으로 머리를 감싸고 벽 모서리에 밀착합니다.
- **출구 확보**: 문이 뒤틀려 갇히는 것을 방지하기 위해 **현관문을 살짝 열어둡니다**.
- **화재 예방**: 흔들림이 멈추면 즉시 가스 밸브를 잠그고 누전차단기를 내립니다.

### 2) 고층 빌딩 및 사무실
- 책상 밑으로 대피하고 유리창 및 캐비닛 주변에서 즉시 벗어납니다.
- **절대 엘리베이터를 타지 말고 계단을 이용합니다.** 만약 엘리베이터 탑승 중 진동을 느끼면 모든 층의 버튼을 눌러 가장 먼저 열리는 층에서 즉시 내립니다.

### 3) 실외 및 번화가
- 가방, 코트 등으로 머리를 보호하며 낙하물 위험이 없는 **넓은 운동장이나 공원**으로 대피합니다.
- 담장, 자판기, 전신주 근처는 붕괴 위험이 크므로 접근하지 않습니다.

### 4) 자동차 운전 중
- 비상등을 켜고 서서히 감속하여 **도로 우측 갓길에 정차**합니다.
- 라디오 재난방송을 청취하며 키를 꽂아둔 채 문을 잠그지 않고 대피합니다 (긴급차량 이동 대비).

---

## 🎒 3. 지진 대비 72시간 비상 생존배낭 구성품

| 분류 | 필수 지참 물품 |
|---|---|
| **생존 식수/식량** | 1인당 생수 2L x 3병, 에너지바, 통조림, 초콜릿, 비상식량 |
| **의약품 및 위생** | 개인 상비약(인슐린, 혈압약 등), 소독약, 붕대, 마스크, 물티슈 |
| **통신/조명** | 손전등(자가발전식 권장), 보조배터리, 건전지, 호루라기(구조신호용) |
| **보온/보호** | 은박 보온담요, 방한의류, 코팅 면장갑, 방진마스크 |
| **중요 서류** | 신분증 사본, 현금(ATM 마비 대비 소액권), 비상연락망 수첩 |`,
    checklists: [
      { id: 'eq-c1', text: '가정 및 사무실 가구(책장, TV) 전도 방지 고정 장치 설치', checked: true },
      { id: 'eq-c2', text: '가장 가까운 지진 옥외대피장소(운동장/공원) 위치 사전 파악', checked: true },
      { id: 'eq-c3', text: '72시간 비상 생존배낭 1인 1개 패킹 및 유통기한 점검', checked: false },
      { id: 'eq-c4', text: '가족 간 재난 시 비상 만남의 장소 및 연락 방법 합의', checked: true },
    ],
    quizzes: [
      {
        id: 'eq-q1',
        question: '지진 흔들림이 감지되는 순간 실내에서 가장 올바른 첫 번째 행동은?',
        options: [
          '재빨리 엘리베이터를 타고 1층으로 내려간다.',
          '즉시 튼튼한 탁자 아래로 들어가 머리를 보호하고 다리를 잡는다.',
          '귀중품을 챙겨 베란다로 나간다.',
          '건물 밖으로 곧바로 뛰어나간다.',
        ],
        correctIndex: 1,
        explanation: '진동 중에는 낙하물로 인한 두부 손상이 가장 위험하므로 Drop, Cover, Hold on 원칙에 따라 탁자 밑에서 머리를 보호해야 합니다.',
      },
    ],
    comments: [],
    revisions: [
      {
        id: 'eq-rev-1',
        version: 'v2.1',
        editorId: 'user-lee',
        editorName: '이서연',
        summary: '운전 중 행동 수칙 및 생존배낭 표 정리',
        timestamp: '2026-08-23T16:45:00Z',
        contentSnapshot: '',
      },
    ],
  },

  // 3. 화재안전: 소화기 사용법 & 완강기 비상탈출
  {
    id: 'doc-fire-extinguisher',
    slug: 'fire-safety-extinguisher-descender-protocol',
    title: '화재 대피의 정석: 소화기·옥내소화전 4단계 사용법 및 완강기 비상탈출 프로토콜',
    category: '화재안전',
    summary: '초기 화재 진압의 한계 기준 판단과 ABC 분말소화기 작동 요령, 연기 질식 방지 젖은 수건 탈출법 및 완강기 생명줄 착용 수칙.',
    goldenTime: '초기 화재 발견 후 3분 (천장 불길 도달 전 진압 or 대피 결정)',
    emergencyContact: '119 / 비상벨 발신기',
    targetAudience: '전체',
    difficulty: '실무(표준)',
    status: 'PUBLISHED',
    priority: 'CRITICAL',
    authorId: 'user-kim',
    authorName: '김은경',
    lastEditedById: 'user-kim',
    lastEditedByName: '김은경',
    createdAt: '2026-08-15T10:30:00Z',
    updatedAt: '2026-08-24T01:15:00Z',
    version: 'v4.0',
    viewCount: 1650,
    isBookmarked: true,
    accessLevel: 'PUBLIC',
    allowedRoles: ['ADMIN', 'INSTRUCTOR', 'EDITOR', 'VIEWER', 'GUEST'],
    editRoles: ['ADMIN', 'INSTRUCTOR'],
    allowedUserIds: [],
    editUserIds: ['user-kim'],
    relatedDocIds: ['doc-cpr-aed', 'doc-hazmat-leak'],
    tags: ['소화기', '완강기', '연기대피', '유독가스', '방화문', '비상탈출'],
    keyActionPoints: [
      '화재 경보: "불이야!" 외치고 비상벨 누른 뒤 119 신고',
      '소화기 4단계: [안전핀 뽑기] -> [노즐 잡기] -> [바람 등지고 서기] -> [손잡이 강하게 움켜쥐기]',
      '연기 탈출: 젖은 수건으로 코와 입을 막고 자세를 낮춰(바닥 30~50cm 신선한 공기층) 벽을 짚고 피난',
      '문 손잡이가 뜨거우면 절대 열지 말고 다른 탈출로 모색 (완강기, 경량칸막이, 대피공간)',
    ],
    content: `## 🔥 1. 초기 소화와 대피의 골든타임 판단 기준

> ⚠️ **김은경 강사의 원칙**: 불길이 **자신의 키를 넘어서거나 천장에 닿은 경우** 즉시 진압을 포기하고 *"불이야!"*를 외치며 대피해야 합니다!

---

## 🧯 2. 분말소화기 작동 4단계 (PASS 원칙)

1. **소화기를 바닥에 놓고 안전핀을 뽑는다.**
   - *주의: 손잡이를 쥔 상태로 당기면 안전핀이 빠지지 않습니다.*
2. **바람을 등지고** 서서 노즐을 불길의 근원지로 향한다.
3. **손잡이를 힘껏 움켜쥔다.**
4. 빗자루로 바닥을 쓸 듯이 **좌우로 골고루 분사**한다.

---

## 🪟 3. 완강기(간이완강기) 비상탈출 5단계

완강기는 화재 시 고립된 3층~10층에서 로프를 타고 지상으로 탈출하는 피난기구입니다.

\`\`\`
[1. 완강기 함 개방] -> [2. 후크를 지지대에 걸고 볼트 조임] -> [3. 릴(로프)을 창밖으로 던짐] 
-> [4. 가슴벨트를 겨드랑이에 끼우고 조임] -> [5. 벽을 지지하며 양팔 뻗어 하강]
\`\`\`

- **가장 흔한 사고 원인**: 가슴벨트를 조이지 않고 양팔을 위로 번쩍 들어 벨트가 빠지는 경우입니다. **양팔을 절대 들지 말고 W자 형태로 유지하며 벽을 가볍게 밀며 내려옵니다.**`,
    checklists: [
      { id: 'fire-c1', text: '소화기 압력 게이지 바늘이 녹색 정상 범위(0.7~0.98 MPa)에 위치', checked: true },
      { id: 'fire-c2', text: '사무실/가정 내 완강기 지지대 고정 상태 및 릴 이상 유무 점검', checked: true },
      { id: 'fire-c3', text: '비상계단 방화문 닫힘 상태 유지 및 통로 내 장애물 적치 금지', checked: true },
      { id: 'fire-c4', text: '젖은 수건 비치 또는 화재대피용 구조 손수건 상비', checked: false },
    ],
    quizzes: [
      {
        id: 'fire-q1',
        question: '화재 발생 시 연기 속에서 피난할 때 가장 올바른 자세는?',
        options: [
          '숨을 깊이 들이쉬며 서서 빠르게 달린다.',
          '젖은 손수건으로 코와 입을 막고, 자세를 최대한 낮춰 벽을 짚으며 이동한다.',
          '연기가 꽉 찬 방에서 창문을 닫고 이불을 뒤집어쓴다.',
          '엘리베이터를 호출하여 옥상으로 올라간다.',
        ],
        correctIndex: 1,
        explanation: '연기 속 유독가스는 위로 상승하므로 바닥에서 30~50cm 높이에 신선한 공기층이 남습니다. 젖은 천으로 여과하며 낮은 자세로 벽을 짚고 이동해야 합니다.',
      },
    ],
    comments: [],
    revisions: [
      {
        id: 'fire-rev-1',
        version: 'v4.0',
        editorId: 'user-kim',
        editorName: '김은경',
        summary: '2026 소방청 표준 소방안전 매뉴얼 기준 완강기 안전 수칙 대폭 개편',
        timestamp: '2026-08-24T01:15:00Z',
        contentSnapshot: '',
      },
    ],
  },

  // 4. 환경안전: 유해화학물질 유출 & 밀폐공간 질식
  {
    id: 'doc-hazmat-leak',
    slug: 'hazardous-chemical-spill-confined-space',
    title: '환경·산업 안전: 유해화학물질 누출 방재 및 밀폐공간 질식재해 예방 수칙',
    category: '환경안전',
    summary: '사업장 내 불산, 염소, 암모니아 등 유독물 누출 시 풍향 기준 대피 요령과 맨홀·탱크 등 밀폐공간 3대 질식 예방 수칙(산소농도 측정, 환기, 송기마스크).',
    goldenTime: '누출 초기 5분 (풍상 방향 대피 및 환기팬 가동 차단)',
    emergencyContact: '환경부 화학물질안전원 (1522-8119) / 119 화학구조대',
    targetAudience: '사업장근로자',
    difficulty: '심화(전문가)',
    status: 'PUBLISHED',
    priority: 'HIGH',
    authorId: 'user-kim',
    authorName: '김은경',
    lastEditedById: 'user-lee',
    lastEditedByName: '이서연',
    createdAt: '2026-08-16T11:00:00Z',
    updatedAt: '2026-08-22T13:20:00Z',
    version: 'v1.8',
    viewCount: 620,
    isBookmarked: false,
    accessLevel: 'ORG_WIDE',
    allowedRoles: ['ADMIN', 'INSTRUCTOR', 'EDITOR', 'VIEWER'],
    editRoles: ['ADMIN', 'INSTRUCTOR', 'EDITOR'],
    allowedUserIds: [],
    editUserIds: ['user-kim', 'user-lee'],
    relatedDocIds: ['doc-fire-extinguisher'],
    tags: ['화학물질', 'MSDS', '밀폐공간', '산소농도', '질식재해', '풍상대피'],
    keyActionPoints: [
      '화학물질 누출 시: 바람을 안고(풍상) 높은 지대로 대피 (바람 방향과 직각으로 벗어남)',
      '밀폐공간 작업 전: 적정 산소 농도(18% ~ 23.5%) 및 유해가스 농도(H2S, CO) 측정 필수',
      '작업 중 지속 환기: 작업 전 환기뿐만 아니라 작업 중에도 급기팬 연속 가동',
      '동료 쓰러짐 시: 무작정 구조 진입 금지 -> 공기호흡기 착용자만 진입 가능',
    ],
    content: `## ☣️ 1. 유해화학물질 누출 시 비상행동 수칙

### 1) 바람을 고려한 대피 경로
- 가스성 화학물질은 공기 흐름을 타고 확산됩니다.
- **풍상(바람이 불어오는 쪽) 또는 풍측(바람 방향과 직각)**으로 이동합니다.
- 공기보다 무거운 가스(염소, LPG 등)는 지하층과 배수구에 고이므로 **높은 지대**로 대피합니다.

---

## 🕳️ 2. 밀폐공간 3대 질식재해 예방 수칙

밀폐공간(탱크, 맨홀, 정화조, 배관) 질식 사고는 **사망률이 50%에 달하는 극도로 치명적인 재해**입니다.

1. **산소 및 유해가스 농도 측정**
   - 산소(O₂): **18% 이상 ~ 23.5% 미만** (16% 이하 시 즉각 뇌손상 위험)
   - 황화수소(H₂S): 10 ppm 미만
   - 일산화탄소(CO): 30 ppm 미만
2. **작업 전 및 작업 중 지속적인 강제 환기**
3. **구조 시 송기마스크(공기호흡기) 필수 착용**
   - *동료를 구하려다 연쇄 사망하는 비극이 80% 이상입니다.*`,
    checklists: [
      { id: 'haz-c1', text: '화학물질 취급 장소 MSDS(물질안전보건자료) 비치 및 경고표지 부착', checked: true },
      { id: 'haz-c2', text: '복합가스 측정기 교정(Calibration) 유효기간 확인', checked: true },
      { id: 'haz-c3', text: '밀폐공간 작업허가서 발행 및 비상 연락 체계 확인', checked: false },
    ],
    quizzes: [
      {
        id: 'haz-q1',
        question: '밀폐공간 작업 시 안전한 적정 공기 기준(산소 농도)은?',
        options: [
          '10% ~ 15%',
          '18% ~ 23.5%',
          '25% ~ 30%',
          '5% 미만',
        ],
        correctIndex: 1,
        explanation: '산업안전보건기준에 관한 규칙 상 적정 공기란 산소 농도 18% 이상 23.5% 미만, 탄산가스 1.5% 미만, 황화수소 10ppm 미만인 상태를 말합니다.',
      },
    ],
    comments: [],
    revisions: [],
  },

  // 5. 디지털안전: 피싱/스미싱 & 랜섬웨어 & 정보보안
  {
    id: 'doc-cyber-security',
    slug: 'digital-safety-phishing-ransomware-protection',
    title: '디지털·사이버 안전: 기업 및 개인 타깃 피싱·스미싱 방어와 랜섬웨어 대응 3-2-1 백업 수칙',
    category: '디지털안전',
    summary: 'AI 딥페이크 보이스피싱, 지능형 스피어피싱 메일 식별법과 악성 첨부파일 실행 방지, 데이터 보존을 위한 3-2-1 백업 원칙 및 계정 2단계 인증(2FA) 표준화.',
    goldenTime: '피싱 의심 클릭 후 10분 (즉시 비행기탑승모드 전환 & 계좌 지급정지)',
    emergencyContact: '경찰청 사이버범죄신고 (182) / 금융감독원 (1332) / KISA (118)',
    targetAudience: '전체',
    difficulty: '실무(표준)',
    status: 'PUBLISHED',
    priority: 'HIGH',
    authorId: 'user-kim',
    authorName: '김은경',
    lastEditedById: 'user-kim',
    lastEditedByName: '김은경',
    createdAt: '2026-08-18T16:00:00Z',
    updatedAt: '2026-08-24T00:30:00Z',
    version: 'v2.5',
    viewCount: 1100,
    isBookmarked: false,
    accessLevel: 'PUBLIC',
    allowedRoles: ['ADMIN', 'INSTRUCTOR', 'EDITOR', 'VIEWER', 'GUEST'],
    editRoles: ['ADMIN', 'INSTRUCTOR', 'EDITOR'],
    allowedUserIds: [],
    editUserIds: ['user-kim'],
    relatedDocIds: ['doc-cpr-aed'],
    tags: ['사이버보안', '스미싱', '랜섬웨어', '2단계인증', '321백업', '딥페이크'],
    keyActionPoints: [
      '의심스러운 URL(.apk, 단축링크) 클릭 금지 및 첨부파일 매크로 실행 차단',
      '모든 주요 업무 계정 및 개인 포털에 다중인증(MFA/2FA - OTP 앱 권장) 활성화',
      '피싱 클릭 시 즉시 폰 비행기탑승모드 켜고 KISA 118 신고 및 악성 앱 삭제',
      '데이터 보호 3-2-1 백업: 3개 사본, 2가지 서로 다른 매체, 1개 오프라인(에어갭) 보관',
    ],
    content: `## 🛡️ 1. 진화하는 사이버 위협: 3대 피싱 공격 식별법

1. **스피어 피싱(Spear Phishing)**: 거래처, 사내 인사팀, 세무서를 사칭한 견적서.xlsx, 급여명세서.pdf.exe 파일
2. **스미싱(Smishing)**: "모바일 청첩장", "택배 주소 불일치", "교통범칙금 고지서" 링크 유도
3. **AI 딥페이크 보이스**: 가족 목소리를 모방한 긴급 송금 유도 -> **가족 간 비상 암호(Safe Word) 사전 지정**

---

## 💾 2. 랜섬웨어 무력화: 3-2-1 데이터 백업 법칙

\`\`\`
- 3: 원본을 포함하여 최소 3개의 데이터 복사본 유지
- 2: 2가지 서로 다른 저장 매체 사용 (예: 사내 NAS + 클라우드)
- 1: 1개는 반드시 네트워크와 단절된 오프라인(외장 HDD, Tape) 에어갭 보관
\`\`\`

---

## 🚨 3. 피싱 악성코드 실행 시 긴급 대응 5단계

1. **네트워크 즉시 차단**: 스마트폰 비행기 탑승 모드 ON / PC 랜선 즉시 분리
2. **금융 거래 정지**: 금융결제원 **계좌정보통합관리서비스(어카운트인포)**를 통해 본인 계좌 일괄 지급정지
3. **명의도용 방지**: **엠세이퍼(msafer.or.kr)** 접속하여 휴대폰 신규 개통 제한 설정
4. **증거 보존 및 신고**: 한국인터넷진흥원(118) 및 경찰청(182) 신고
5. **기기 초기화**: 공장초기화(Factory Reset) 수행 후 2FA 비밀번호 전면 교체`,
    checklists: [
      { id: 'sec-c1', text: '사내 업무 이메일 및 Google/Microsoft 계정 2단계 인증(2FA) 적용', checked: true },
      { id: 'sec-c2', text: '스마트폰 [알 수 없는 출처의 앱 설치 제한] 활성화', checked: true },
      { id: 'sec-c3', text: '오프라인 분리 백업(에어갭) 주 1회 정기 수행', checked: false },
      { id: 'sec-c4', text: '가족 간 AI 음성 피싱 방지용 비밀 키워드 공유', checked: true },
    ],
    quizzes: [
      {
        id: 'sec-q1',
        question: '스마트폰에서 의심스러운 스미싱 URL을 클릭해 악성 앱이 설치되었을 때 가장 먼저 해야 할 긴급 조치는?',
        options: [
          '앱을 지우지 않고 은행 앱을 켜서 잔액을 확인한다.',
          '즉시 비행기 탑승 모드를 켜서 통신(인터넷/블루투스)을 전면 차단한다.',
          '친구들에게 문자를 보내 확인을 요청한다.',
          '화면을 캡처하여 소셜미디어에 업로드한다.',
        ],
        correctIndex: 1,
        explanation: '비행기 탑승 모드를 켜면 악성 앱이 외부 C&C 해킹 서버와 통신하거나 추가 악성코드를 다운로드하고 문자/연락처를 유출하는 행위를 즉시 물리적으로 차단할 수 있습니다.',
      },
    ],
    comments: [],
    revisions: [],
  },

  // 6. 응급처치: 기도폐쇄 하임리히법
  {
    id: 'doc-choking-heimlich',
    slug: 'first-aid-choking-heimlich-maneuver',
    title: '영유아·성인 기도폐쇄 응급처치: 골든타임 하임리히법(복부 밀쳐올리기) 표준 가이드',
    category: '응급처치',
    summary: '음식물이나 이물질로 인한 기도폐쇄 시 징후 식별(V자 사인)과 성인 복부 밀쳐올리기, 영유아 5:5 등두드리기/가슴압박법.',
    goldenTime: '기도 완전 폐쇄 후 3분 (저산소증 뇌손상 방지)',
    emergencyContact: '119',
    targetAudience: '전체',
    difficulty: '기초(입문)',
    status: 'PUBLISHED',
    priority: 'HIGH',
    authorId: 'user-kim',
    authorName: '김은경',
    lastEditedById: 'user-park',
    lastEditedByName: '박준호',
    createdAt: '2026-08-19T09:30:00Z',
    updatedAt: '2026-08-23T18:00:00Z',
    version: 'v2.0',
    viewCount: 840,
    isBookmarked: false,
    accessLevel: 'PUBLIC',
    allowedRoles: ['ADMIN', 'INSTRUCTOR', 'EDITOR', 'VIEWER', 'GUEST'],
    editRoles: ['ADMIN', 'INSTRUCTOR'],
    allowedUserIds: [],
    editUserIds: ['user-kim', 'user-park'],
    relatedDocIds: ['doc-cpr-aed'],
    tags: ['하임리히', '기도폐쇄', '이물질흡인', '영유아응급처치', '질식사고'],
    keyActionPoints: [
      '의식 있는 성인: 환자 뒤에 서서 주먹을 쥐고 명치와 배꼽 중간에 댄 후 후상방으로 강하게 밀쳐올림',
      '의식 잃고 쓰러지면: 즉시 바닥에 눕히고 119 신고 후 심폐소생술(가슴압박) 전환',
      '영유아(1세 미만): 턱을 지지하여 머리를 낮추고 등 두드리기 5회 -> 가슴 압박 5회 반복',
    ],
    content: `## ⚠️ 1. 기도폐쇄 징후 파악
환자가 양손으로 목을 감싸 쥐는 **초킹 사인(Choking Sign)**을 보이며 말을 하지 못하고 청색증이 나타나면 즉각 개입해야 합니다.

## ✊ 2. 성인 하임리히법 시행 방법
1. 환자 뒤에서 감싸 안듯 선다.
2. 한쪽 주먹의 엄지손가락 쪽을 **배꼽과 명치 중간**에 댄다.
3. 다른 손으로 주먹을 감싸 쥐고 **안쪽 위(후상방, J자 형태)**로 강하게 밀쳐 올린다.
4. 이물이 배출되거나 의식을 잃을 때까지 반복한다.`,
    checklists: [
      { id: 'chk-c1', text: '환자의 기침 유도 가능 여부(부분 폐쇄) 우선 확인', checked: true },
      { id: 'chk-c2', text: '의식 소실 시 즉각 심폐소생술(CPR)로 전환 숙지', checked: true },
    ],
    quizzes: [],
    comments: [],
    revisions: [],
  },
];
