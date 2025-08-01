import dagre from 'dagre';

const nodeWidth = 180;
const nodeHeight = 100;

export function getDagreLayout(nodes, edges, config) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: config.rankdir,
    nodesep: config.nodesep,
    ranksep: config.ranksep,
    align: config.align || undefined,
    ranker: config.ranker || 'network-simplex',
    marginx: config.marginx ?? 0,
    marginy: config.marginy ?? 0,
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
