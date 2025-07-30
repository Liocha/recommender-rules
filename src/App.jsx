import React, { useState, useMemo } from 'react';
import { ReactFlow, Background, MiniMap, Controls, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import ActionNode from './Nodes/ActionNode';
import AlgorithmNode from './Nodes/AlgorithmNode';
import ConditionNode from './Nodes/ConditionNode';
import { SettingsImportModal } from './Components/SettingsImportModal';
import CustomEdge from './Edges/CustomEdge';
import StartnNode from './Nodes/StartNode';


const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 100;

function getLayoutedElements(nodes, edges, direction = 'TB') {
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 200,  // ширина между нодами
    ranksep: 200, // высота между уровнями (по направлению потока)

  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const { x, y } = dagreGraph.node(node.id);
    return {
      ...node,
      position: { x, y },
      style: { width: nodeWidth, height: nodeHeight },
    };
  });

  return { nodes: layoutedNodes, edges };
}

const nodeTypes = {
  action: ActionNode,
  algorithm: AlgorithmNode,
  condition: ConditionNode,
  start: StartnNode
};

const edgeTypes = {
  'custom-edge': CustomEdge,
};

function App() {

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleImport = (jsonString) => {
    try {
      const rules = jsonString;
      const { newNodes, newEdges } = transformJsonToFlowElements(rules);
      setNodes(newNodes);
      setEdges(newEdges);
      setIsImportModalOpen(false);
    } catch (error) {
      console.error('Ошибка импорта:', error);
    }
  };

  function transformJsonToFlowElementsOld(steps) {
    const newNodes = steps.map((step, index) => {
      const id = (index + 1).toString();
      const value = step.value;
      const nodeType = step.component; // 'action' или 'algorithm' или condition
      const type = step.type;
      return {
        id,
        type: nodeType,
        data: { value, type },
        position: { x: 0, y: 0 }, // вычисляется через dagre
      };
    });

    const newEdges = steps.slice(1).map((_, index) => {
      const source = (index + 1).toString();
      const target = (index + 2).toString();
      return {
        id: `e${source}-${target}`,
        source,
        target,
        type: 'custom-edge',
      };
    });

    console.dir({ newNodes, newEdges });
    return { newNodes, newEdges };
  }


  function transformJsonToFlowElements(steps) {
    const nodes = [];
    const edges = [];

    // Стартовая нода
    nodes.push({
      id: 'start',
      type: 'start',
      data: {},
      position: { x: 0, y: 0 },
    });

    let prevId = 'start';
    let idCounter = 1;

    function generateId() {
      return (idCounter++).toString();
    }

    function addStep(step, parentId, handleId = null) {
      const currentId = generateId();

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
        sourceHandle: handleId, // 👈 используем yes/no для condition
        type: 'custom-edge',
      });

      // если это condition — обрабатываем yes и no отдельно
      if (step.component === 'condition') {
        addSequentialSteps(step.yes, currentId, 'yes');
        addSequentialSteps(step.no, currentId, 'no');
      }


      return currentId;
    }

    function addSequentialSteps(stepsArray, initialParentId, handleId = null) {

      let parentId = initialParentId;
  
      stepsArray.forEach((step, index) => {
        const currentId = addStep(step, parentId, index === 0 ? handleId : null);
        parentId = currentId;
      });
    }

    steps.forEach((step) => {
      const newId = addStep(step, prevId);
      prevId = newId;
    });

    return { newNodes: nodes, newEdges: edges };
  }




  const [nodes, setNodes] = useState([
    { id: '1', type: 'start', data: { label: 'Start' } },
    { id: '2', type: 'action', data: { label: 'Node 2' } },
    { id: '3', type: 'algorithm', data: { label: 'Node 3' } },
    { id: '4', data: { label: 'Node 4' } },
    { id: '5', data: { label: 'Node 5' } },
  ]);

  const [edges, setEdges] = useState([
    { id: 'e1-2', type: 'custom-edge', source: '1', target: '2' },
    { id: 'e2-3', type: 'custom-edge', source: '2', target: '3' },
    { id: 'e3-4', type: 'custom-edge', source: '3', target: '4' },
    { id: 'e4-5', type: 'custom-edge', source: '4', target: '5' },
  ]);

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => getLayoutedElements(nodes, edges), [nodes, edges]);

  return (
    <div style={{ width: '100%', height: 1000 }}>
      <button
        onClick={() => setIsImportModalOpen(true)}
        style={importButtonStyle}
      >
        Импорт настроек
      </button>
      <ReactFlow
        nodes={layoutedNodes}
        edges={layoutedEdges}
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

const importButtonStyle = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  zIndex: 10,
  padding: '8px 16px',
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '4px',
  cursor: 'pointer'
};
