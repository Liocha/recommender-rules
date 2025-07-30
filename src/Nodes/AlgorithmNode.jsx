import { Handle } from 'reactflow';
import './AlgorithmNode.css';

export default function AlgorithmNode({ data }) {
    return (
        <div className="algorithm-node border ">
          {/* Верхний хендл */}
          <Handle
            type="target"
            position="top"
            className="top-handle"
          />
    
          {/* Основной контент */}
          <div className="card text-white text-center position-relative overflow-hidden">
            <div className="card-body">
              <h5 className="card-title">Алгоритм</h5>
              <p className="card-text">{data.type}</p>
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
    
          {/* Нижний хендл */}
          <Handle
            type="source"
            position="bottom"
            className="bottom-handle"
          />
        </div >
      );
}