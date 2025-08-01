import React, { useState, useEffect } from 'react';
import { ReactFlow, Background, MiniMap, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

import ActionNode from './Nodes/ActionNode';
import AlgorithmNode from './Nodes/AlgorithmNode';
import ConditionNode from './Nodes/ConditionNode';
import StartnNode from './Nodes/StartNode';

import CustomEdge from './Edges/CustomEdge';
import CustomEdge2 from './Edges/CustomEdge2';

import LayoutSettings from './Components/LayoutSettings';
import PresetSelector from './Components/PresetSelector';
import { SettingsImportModal } from './Components/SettingsImportModal';

import { getDagreLayout } from './utils/layoutDagre';
import { getCustomLayout } from './utils/layoutCustom';

const nodeTypes = {
  action: ActionNode,
  algorithm: AlgorithmNode,
  condition: ConditionNode,
  start: StartnNode
};

const edgeTypes = {
  default: undefined,
  'custom-edge': CustomEdge,
  'custom-edge-2': CustomEdge2,
};

function App() {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [layoutConfig, setLayoutConfig] = useState({
    layoutAlgorithm: 'dagre',
    rankdir: 'TB',
    nodesep: 200,
    ranksep: 200,
  });

  const [edgeTypeVariant, setEdgeTypeVariant] = useState('custom-edge'); // 'default', 'custom-edge', 'custom-edge-2'

  const [rawNodes, setRawNodes] = useState([
    { id: '1', type: 'start', data: { label: 'Start' }, position: { x: 0, y: 0 } },
    { id: '2', type: 'action', data: { label: 'Node 2' }, position: { x: 0, y: 0 } },
    { id: '3', type: 'algorithm', data: { label: 'Node 3' }, position: { x: 0, y: 0 } },
  ]);

  const [rawEdges, setRawEdges] = useState([
    { id: 'e1-2', type: 'custom-edge', source: '1', target: '2' },
    { id: 'e2-3', type: 'custom-edge', source: '2', target: '3' },
  ]);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    const layouted = layoutConfig.layoutAlgorithm === 'dagre'
      ? getDagreLayout(rawNodes, rawEdges, layoutConfig)
      : getCustomLayout(rawNodes, rawEdges, layoutConfig);

    // Заменяем тип ребер на выбранный
    const updatedEdges = layouted.edges.map(edge => ({
      ...edge,
      type: edgeTypeVariant === 'default' ? undefined : edgeTypeVariant,
    }));

    setNodes(layouted.nodes);
    setEdges(updatedEdges);
  }, [rawNodes, rawEdges, layoutConfig, edgeTypeVariant]);

  const handleImport = (json) => {
    try {
      const { newNodes, newEdges } = transformJsonToFlowElements(json);
      setRawNodes(newNodes);
      setRawEdges(newEdges);
      setIsImportModalOpen(false);
    } catch (error) {
      console.error('Ошибка импорта:', error);
    }
  };

  const handlePresetSelect = (preset) => {
    const { newNodes, newEdges } = transformJsonToFlowElements(preset);
    setRawNodes(newNodes);
    setRawEdges(newEdges);
  };

  function transformJsonToFlowElements(steps) {
    const nodes = [];
    const edges = [];

    // Добавляем стартовую ноду
    nodes.push({
      id: 'start',
      type: 'start',
      data: {},
      position: { x: 0, y: 0 },
    });

    function sanitize(text) {
      return text.replace(/[^a-zA-Z0-9_]/g, '_');
    }

    function addStep(step, parentId, idPath, sourceHandle = null) {
      const currentId = sanitize(idPath);

      nodes.push({
        id: currentId,
        type: step.component,
        data: {
          ...step,
          value: step.value ?? null,
          type: step.type ?? null,
        },
        position: { x: 0, y: 0 },
      });

      edges.push({
        id: `e${parentId}-${currentId}`,
        source: parentId,
        target: currentId,
        sourceHandle,
        type: edgeTypeVariant,
      });

      if (step.component === 'condition') {
        const yesFirstId = addSequentialSteps(step.yes, currentId, 'yes', `${idPath}_yes`);
        const noFirstId = addSequentialSteps(step.no, currentId, 'no', `${idPath}_no`);
      }

      return currentId;
    }

    function addSequentialSteps(stepsArray, initialParentId, sourceHandle = null, basePath = '') {
      let parentId = initialParentId;

      stepsArray.forEach((step, index) => {
        const idPath = `${basePath}${index}`;
        const currentId = addStep(step, parentId, idPath, index === 0 ? sourceHandle : null);
        parentId = currentId;
      });

      return stepsArray.length > 0 ? `${basePath}0` : null;
    }

    // 🔧 Основной линейный поток
    let parentId = 'start';
    steps.forEach((step, index) => {
      const idPath = `n${index}`;
      const currentId = addStep(step, parentId, idPath);
      parentId = currentId;
    });

    return { newNodes: nodes, newEdges: edges };
  }



  return (
    <div style={{ width: '100%', height: 1200 }}>
      <div className="position-absolute top-0 start-0 mt-2 ms-2 d-flex flex-column gap-2" style={{ width: '260px', zIndex: 10 }}>
        {/* Импорт */}
        <div className="card shadow-sm">
          <div className="card-body p-3">
            <h6 className="card-title mb-2 text-muted">Импорт</h6>
            <button
              className="btn btn-sm btn-primary w-100"
              onClick={() => setIsImportModalOpen(true)}
            >
              <i className="bi bi-upload me-2" />
              Импорт настроек
            </button>
          </div>
        </div>

        {/* Настройки */}
        <LayoutSettings config={layoutConfig} onChange={setLayoutConfig} />

        {/* Варианты эйджа */}
        <div className="card shadow-sm">
          <div className="card-body p-3">
            <h6 className="card-title mb-2 text-muted">Тип ребра</h6>
            <select
              className="form-select form-select-sm"
              value={edgeTypeVariant}
              onChange={(e) => setEdgeTypeVariant(e.target.value)}
            >
              <option value="default">По умолчанию</option>
              <option value="custom-edge">Кастомный</option>
              <option value="custom-edge-2">Кастомный 2</option>
            </select>
          </div>
        </div>

        {/* Пресеты */}
        <PresetSelector onSelect={handlePresetSelect} />
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.05}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      <SettingsImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
}

export default App;
