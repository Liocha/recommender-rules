import { Handle } from 'reactflow';
import './ConditionNode.css';

export default function ConditionNode({ data }) {
  return (
    <div className="condition-node border">
      {/* Вход */}
      <Handle type="target" position="top" className="top-handle" />

      {/* Карточка */}
      <div className="card text-white text-center position-relative overflow-hidden">
        <div className="card-body">
          <h5 className="card-title">Условие</h5>
          <p className="card-text">
            {JSON.stringify(data.value)}
          </p>
        </div>

        <div className="hover-buttons slide-in-right">
          <button className="btn btn-primary btn-sm rounded-circle m-1">
            <i className="bi bi-gear-fill"></i>
          </button>
          <button className="btn btn-danger btn-sm rounded-circle m-1">
            <i className="bi bi-trash-fill"></i>
          </button>
        </div>
      </div>

      <Handle type="source" position="left" id="yes" style={{ left: '0%' }} className="bottom-handle" />
      <Handle type="source" position="right" id="no" style={{ left: '100%' }} className="bottom-handle" />
    </div>
  );
}
