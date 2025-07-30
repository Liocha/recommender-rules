import { Handle } from 'reactflow';
import './StartNode.css';

export default function StartNode() {
    return (
        <div className="start-node">
            <div className="custom-arrow">
  <svg width="24" height="32" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
    {/* Ножка стрелки */}
    <line x1="12" y1="4" x2="12" y2="20" stroke="#adb5bd" strokeWidth="3" strokeLinecap="round" />

    {/* Наконечник в виде простой стрелки (V) */}
    <polyline points="6,22 12,28 18,22" fill="none" stroke="#adb5bd" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
</div>


            <Handle
                type="source"
                position="bottom"
                className="bottom-handle"
            />
        </div>
    );
}
