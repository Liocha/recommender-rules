export function getCustomLayout(nodes, edges, configOverrides = {}) {

    const nodeSizes = {
      start: { width: 180, height: 50 },
      action: { width: 180, height: 70 },
      algorithm: { width: 180, height: 90 },
      condition: { width: 200, height: 100 },
      default: { width: 180, height: 100 },
    };
  
    const config = {
      gapX: 200,
      gapY: 200,
      ...configOverrides,
    };
  
    const childrenMap = {};
    edges.forEach(({ source, target }) => {
      if (!childrenMap[source]) childrenMap[source] = [];
      childrenMap[source].push(target);
    });
  
    const nodesMap = Object.fromEntries(nodes.map(n => [n.id, { ...n }]));
    const positioned = new Set();
  
    // Подсчет высоты поддерева, возвращает сколько места нужно по Y
    function computeSubtreeHeight(nodeId) {
      const node = nodesMap[nodeId];
      const size = nodeSizes[node.type] || nodeSizes.default;
  
      const children = childrenMap[nodeId] || [];
  
      if (node.type === 'condition' && children.length >= 2) {
        const yesHeight = computeSubtreeHeight(children[0]);
        const noHeight = computeSubtreeHeight(children[1]);
        return size.height + config.gapY + Math.max(yesHeight, noHeight);
      }
  
      if (children.length === 0) {
        return size.height;
      }
  
      const childHeights = children.map(computeSubtreeHeight);
      return size.height + config.gapY + childHeights.reduce((a, b) => a + b, 0);
    }
  
    // Размещение с учетом смещений
    function layout(nodeId, x, y) {
      if (positioned.has(nodeId)) return;
  
      const node = nodesMap[nodeId];
      const size = nodeSizes[node.type] || nodeSizes.default;
  
      node.position = {
        x: x - size.width / 2,
        y,
      };
  
      positioned.add(nodeId);
  
      const children = childrenMap[nodeId] || [];
  
      if (node.type === 'condition' && children.length >= 2) {
        const [yesId, noId] = children;
  
        const yesHeight = computeSubtreeHeight(yesId);
        const noHeight = computeSubtreeHeight(noId);
  
        const childY = y + size.height + config.gapY;
  
        layout(yesId, x - config.gapX, childY);
        layout(noId, x + config.gapX, childY);
      } else {
        let currentY = y + size.height + config.gapY;
        children.forEach(childId => {
          layout(childId, x, currentY);
          const childHeight = computeSubtreeHeight(childId);
          currentY += childHeight + config.gapY;
        });
      }
    }
  
    const root = nodes.find(n => n.type === 'start') || nodes[0];
    layout(root.id, 0, 0);
  
    return {
      nodes: Object.values(nodesMap),
      edges,
    };
  }
  