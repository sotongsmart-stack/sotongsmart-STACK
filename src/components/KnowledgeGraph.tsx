import React, { useState, useMemo } from 'react';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Filter, 
  FileText, 
  ExternalLink, 
  Flame, 
  Activity, 
  Leaf, 
  Laptop, 
  LandPlot,
  Info
} from 'lucide-react';
import { useSafetyBrain } from '../context/SafetyBrainContext';
import { SafetyCategory, SafetyDoc } from '../types';

interface GraphNode {
  id: string;
  type: 'category' | 'document';
  label: string;
  category: SafetyCategory;
  x: number;
  y: number;
  radius: number;
  color: string;
  doc?: SafetyDoc;
}

interface GraphLink {
  sourceId: string;
  targetId: string;
  label?: string;
  type: 'category_link' | 'cross_link';
}

export const KnowledgeGraph: React.FC = () => {
  const { docs, setCurrentDocId, setActiveTab } = useSafetyBrain();
  const [selectedCategory, setSelectedCategory] = useState<SafetyCategory | 'ALL'>('ALL');
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const categories: Array<{ name: SafetyCategory; color: string; icon: any }> = [
    { name: '지진안전', color: '#d97706', icon: LandPlot }, // amber
    { name: '화재안전', color: '#dc2626', icon: Flame }, // red
    { name: '응급처치', color: '#e11d48', icon: Activity }, // rose
    { name: '환경안전', color: '#059669', icon: Leaf }, // emerald
    { name: '디지털안전', color: '#2563eb', icon: Laptop }, // blue
  ];

  // Build Graph Nodes & Coordinates
  const { nodes, links } = useMemo(() => {
    const calculatedNodes: GraphNode[] = [];
    const calculatedLinks: GraphLink[] = [];

    const width = 800;
    const height = 550;
    const centerX = width / 2;
    const centerY = height / 2;

    // 1. Add Category Hub Nodes in a circle
    const catRadius = 180;
    const catPositions: Record<SafetyCategory, { x: number; y: number }> = {
      '지진안전': { x: centerX + catRadius * Math.cos(-Math.PI / 2), y: centerY + catRadius * Math.sin(-Math.PI / 2) },
      '화재안전': { x: centerX + catRadius * Math.cos(-Math.PI / 2 + (2 * Math.PI / 5)), y: centerY + catRadius * Math.sin(-Math.PI / 2 + (2 * Math.PI / 5)) },
      '응급처치': { x: centerX + catRadius * Math.cos(-Math.PI / 2 + (4 * Math.PI / 5)), y: centerY + catRadius * Math.sin(-Math.PI / 2 + (4 * Math.PI / 5)) },
      '환경안전': { x: centerX + catRadius * Math.cos(-Math.PI / 2 + (6 * Math.PI / 5)), y: centerY + catRadius * Math.sin(-Math.PI / 2 + (6 * Math.PI / 5)) },
      '디지털안전': { x: centerX + catRadius * Math.cos(-Math.PI / 2 + (8 * Math.PI / 5)), y: centerY + catRadius * Math.sin(-Math.PI / 2 + (8 * Math.PI / 5)) },
    };

    categories.forEach(cat => {
      const pos = catPositions[cat.name];
      calculatedNodes.push({
        id: `cat-${cat.name}`,
        type: 'category',
        label: cat.name,
        category: cat.name,
        x: pos.x,
        y: pos.y,
        radius: 28,
        color: cat.color,
      });
    });

    // 2. Add Document Nodes orbiting around their category hub
    docs.forEach((doc, docIdx) => {
      const catPos = catPositions[doc.category] || { x: centerX, y: centerY };
      const catDocs = docs.filter(d => d.category === doc.category);
      const indexInCat = catDocs.findIndex(d => d.id === doc.id);
      const totalInCat = catDocs.length;

      // angle around category center
      const docAngle = (indexInCat / (totalInCat || 1)) * 2 * Math.PI + docIdx * 0.3;
      const docDistance = 85;
      const docX = catPos.x + docDistance * Math.cos(docAngle);
      const docY = catPos.y + docDistance * Math.sin(docAngle);

      calculatedNodes.push({
        id: doc.id,
        type: 'document',
        label: doc.title,
        category: doc.category,
        x: docX,
        y: docY,
        radius: 16,
        color: categories.find(c => c.name === doc.category)?.color || '#64748b',
        doc,
      });

      // Link doc to its category
      calculatedLinks.push({
        sourceId: `cat-${doc.category}`,
        targetId: doc.id,
        type: 'category_link',
      });

      // Cross-document links from relatedDocIds (Second brain connections)
      doc.relatedDocIds?.forEach(relId => {
        if (docs.some(d => d.id === relId)) {
          calculatedLinks.push({
            sourceId: doc.id,
            targetId: relId,
            label: '상호연계',
            type: 'cross_link',
          });
        }
      });
    });

    return { nodes: calculatedNodes, links: calculatedLinks };
  }, [docs]);

  // Filtered nodes
  const visibleNodes = nodes.filter(n => {
    if (selectedCategory !== 'ALL' && n.category !== selectedCategory) return false;
    if (searchTerm.trim() && !n.label.toLowerCase().includes(searchTerm.toLowerCase().trim())) {
      return false;
    }
    return true;
  });

  const visibleNodeIds = new Set(visibleNodes.map(n => n.id));

  const visibleLinks = links.filter(l => 
    visibleNodeIds.has(l.sourceId) && visibleNodeIds.has(l.targetId)
  );

  const getNode = (id: string) => nodes.find(n => n.id === id);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      
      {/* Controls & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              김은경 안전 세컨드 브레인 상호 연결망 (Knowledge Graph)
            </h3>
            <p className="text-xs text-slate-500">
              5대 안전 분야와 재난 대응 프로토콜 간의 유기적 상호 연결 관계도
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2 py-1 rounded text-xs font-semibold ${
                selectedCategory === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              전체
            </button>
            {categories.map(c => (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  selectedCategory === c.name ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Node Search */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="노드 검색..."
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none w-32"
          />

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setZoom(prev => Math.min(prev + 0.15, 1.8))}
              className="p-1 text-slate-600 hover:text-slate-900"
              title="확대"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.6))}
              className="p-1 text-slate-600 hover:text-slate-900"
              title="축소"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setZoom(1); setSearchTerm(''); setSelectedCategory('ALL'); }}
              className="p-1 text-slate-600 hover:text-slate-900"
              title="초기화"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full h-[520px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-60" />

        <svg
          viewBox="0 0 800 550"
          className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Defs for gradients & markers */}
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
            </marker>
          </defs>

          {/* Links */}
          <g>
            {visibleLinks.map((link, idx) => {
              const src = getNode(link.sourceId);
              const tgt = getNode(link.targetId);
              if (!src || !tgt) return null;

              const isCross = link.type === 'cross_link';

              return (
                <line
                  key={idx}
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={isCross ? '#818cf8' : '#334155'}
                  strokeWidth={isCross ? 2 : 1}
                  strokeDasharray={isCross ? '4 2' : undefined}
                  className={isCross ? 'animate-pulse' : ''}
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g>
            {visibleNodes.map((node) => {
              const isCategory = node.type === 'category';
              const isHovered = hoveredNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => {
                    if (node.doc) {
                      setCurrentDocId(node.doc.id);
                      setActiveTab('docs');
                    }
                  }}
                >
                  {/* Pulsing ring for categories */}
                  {isCategory && (
                    <circle
                      r={node.radius + 6}
                      fill="none"
                      stroke={node.color}
                      strokeWidth={1.5}
                      opacity={0.4}
                      className="animate-ping origin-center"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r={node.radius}
                    fill={isCategory ? node.color : '#0f172a'}
                    stroke={node.color}
                    strokeWidth={isCategory ? 3 : 2}
                    className={`transition-all ${isHovered ? 'scale-125 stroke-white' : ''}`}
                  />

                  {/* Icon or Symbol */}
                  <text
                    textAnchor="middle"
                    dy=".3em"
                    fill="#ffffff"
                    fontSize={isCategory ? '12px' : '9px'}
                    fontWeight="bold"
                    className="select-none pointer-events-none"
                  >
                    {isCategory ? node.label.slice(0, 2) : '📄'}
                  </text>

                  {/* Node Label Below */}
                  <text
                    y={node.radius + 12}
                    textAnchor="middle"
                    fill={isCategory ? '#ffffff' : '#94a3b8'}
                    fontSize={isCategory ? '11px' : '10px'}
                    fontWeight={isCategory ? 'bold' : 'normal'}
                    className="select-none pointer-events-none"
                  >
                    {node.label.length > 12 ? node.label.slice(0, 12) + '...' : node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hovered Node Tooltip Preview */}
        {hoveredNode && hoveredNode.doc && (
          <div className="absolute bottom-4 left-4 max-w-sm bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3.5 text-white text-xs shadow-2xl space-y-2 animate-in fade-in duration-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                {hoveredNode.doc.category}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {hoveredNode.doc.version}
              </span>
            </div>
            <h4 className="font-bold text-sm text-white line-clamp-1">
              {hoveredNode.doc.title}
            </h4>
            <p className="text-slate-300 line-clamp-2 text-[11px] leading-relaxed">
              {hoveredNode.doc.summary}
            </p>
            {hoveredNode.doc.goldenTime && (
              <div className="text-[10px] text-amber-300 font-medium">
                ⏱️ 골든타임: {hoveredNode.doc.goldenTime}
              </div>
            )}
            <div className="pt-1 text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> 클릭 시 이 지침서로 이동
            </div>
          </div>
        )}

      </div>

      {/* Legend & Explanations */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-2">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>지진안전</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span>화재안전</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span>응급처치</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>환경안전</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span>디지털안전</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400">
          💡 점선 화살표는 재난 복합 상황(예: 지진 발생 → 화재 발화 → 응급 구호) 간의 연계 지침을 나타냅니다.
        </div>
      </div>

    </div>
  );
};
