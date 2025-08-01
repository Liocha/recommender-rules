import React from 'react';

export default function CustomEdge2({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEndId,
}) {
  const offset = 15; // отступ от ноды для выхода линии под прямым углом

  // Координаты точки выхода из source с отступом
  let startX = sourceX;
  let startY = sourceY;

  switch (sourcePosition) {
    case 'left':
      startX = sourceX - offset;
      startY = sourceY;
      break;
    case 'right':
      startX = sourceX + offset;
      startY = sourceY;
      break;
    case 'top':
      startX = sourceX;
      startY = sourceY - offset;
      break;
    case 'bottom':
      startX = sourceX;
      startY = sourceY + offset;
      break;
    default:
      break;
  }

  // Координаты точки входа в target с отступом
  let endX = targetX;
  let endY = targetY;

  switch (targetPosition) {
    case 'left':
      endX = targetX - offset;
      endY = targetY;
      break;
    case 'right':
      endX = targetX + offset;
      endY = targetY;
      break;
    case 'top':
      endX = targetX;
      endY = targetY - offset;
      break;
    case 'bottom':
      endX = targetX;
      endY = targetY + offset;
      break;
    default:
      break;
  }

  // Строим путь по кускам — выход из source, горизонтальная/вертикальная линия, вход в target
  // Логика простая:
  // 1) Линия от source до точки startX,startY (отступ от ноды)
  // 2) Горизонтальная линия до x == endX
  // 3) Вертикальная линия до endY
  // 4) Линия до target (endX,endY)

  // Для упрощения нарисуем путь как последовательность сегментов:

  // Начинаем с sourceX, sourceY
  // Линия до startX, startY
  // Линия до endX, startY
  // Линия до endX, endY

  const path = `
    M${sourceX},${sourceY}
    L${startX},${startY}
    L${endX},${startY}
    L${endX},${endY}
  `;

  const markerEnd = `url(#${markerEndId})`;

  return (
    <>
      <defs>
        <marker
          id={markerEndId}
          markerWidth={20}
          markerHeight={20}
          viewBox="0 0 20 20"
          refX={15}
          refY={10}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L20,10 L0,20 Z" fill="#14823c" />
        </marker>
      </defs>
      <path
        id={id}
        d={path}
        stroke="#14823c"
        strokeWidth={2}
        fill="none"
        markerEnd={markerEnd}
        style={style}
        className="react-flow__edge-path"
      />
    </>
  );
}
