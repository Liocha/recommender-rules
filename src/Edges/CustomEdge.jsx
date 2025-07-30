import {
    EdgeLabelRenderer,
    getSmoothStepPath,
    useReactFlow,
    BaseEdge,
  } from 'reactflow';
  
  export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  }) {
    const { setEdges } = useReactFlow();
  
    const [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      borderRadius: 0, // можно поставить >0 для мягких углов
    });
  
    return (
      <>
        {/* SVG-определение стрелки (один раз для всего документа) */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <marker
              id="arrow"
              markerWidth="15"
              markerHeight="15"
              refX="10"
              refY="5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L10,5 L0,10 Z" fill="#868e96" />
            </marker>
          </defs>
        </svg>
  
        {/* Линия со стрелкой */}
        <BaseEdge
          id={id}
          path={edgePath}
          markerEnd="url(#arrow)"
          style={{ stroke: '#868e96', strokeWidth: 2 }}
        />
  
        {/* Кнопка удаления */}
        <EdgeLabelRenderer>
          <button
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan btn btn-lg"
            onClick={() => {
              setEdges((es) => es.filter((e) => e.id !== id));
            }}
          >
            <i className="bi bi-plus-circle-fill text-primary bg-white"></i>
          </button>
        </EdgeLabelRenderer>
      </>
    );
  }
  