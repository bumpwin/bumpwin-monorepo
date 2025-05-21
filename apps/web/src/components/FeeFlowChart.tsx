"use client";

import ReactFlow, {
  Controls,
  Background,
  type Node,
  type Edge,
  Position,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

// Add CSS to disable pointer events globally
const customStyles = `
  .no-drag-nodes .react-flow__node {
    cursor: default !important;
  }
`;

// Custom node styles
const nodeStyles = {
  battleAmm: {
    background:
      "linear-gradient(135deg, rgba(107, 33, 168, 0.8), rgba(159, 18, 57, 0.8))",
    color: "white",
    border: "1px solid rgb(159, 18, 57)",
    width: 160,
    borderRadius: 8,
    padding: "10px",
    fontWeight: "bold",
  },
  championAmm: {
    background: "linear-gradient(135deg, #ffe259 0%, #f6e27a 100%)",
    color: "#7c4700",
    border: "1.5px solid #ffe259",
    width: 160,
    borderRadius: 8,
    padding: "10px",
    fontWeight: "bold",
  },
  feeVault: {
    background: "rgba(13, 148, 136, 0.85)",
    color: "white",
    border: "1.5px solid #14b8a6",
    width: 120,
    height: 120,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  loserStakers: {
    background:
      "linear-gradient(135deg, rgba(4, 120, 87, 0.8), rgba(6, 95, 70, 0.8))",
    color: "white",
    border: "1px solid rgb(5, 150, 105)",
    width: 180,
    borderRadius: 8,
    padding: "10px",
    fontWeight: "bold",
  },
};

// Default nodes - horizontal layout (left to right)
const initialNodes: Node[] = [
  {
    id: "battle-amm",
    type: "input",
    data: { label: "Battle Market" },
    position: { x: 50, y: 50 },
    sourcePosition: Position.Right,
    style: nodeStyles.battleAmm,
    draggable: false,
  },
  {
    id: "champion-amm",
    type: "input",
    data: { label: "Champion Market" },
    position: { x: 50, y: 150 },
    sourcePosition: Position.Right,
    style: nodeStyles.championAmm,
    draggable: false,
  },
  {
    id: "fee-vault",
    data: { label: "FEE VAULT" },
    position: { x: 300, y: 100 },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    style: nodeStyles.feeVault,
    draggable: false,
  },
  {
    id: "loser-stakers",
    type: "output",
    data: { label: "LOSER STAKERS" },
    position: { x: 550, y: 100 },
    targetPosition: Position.Left,
    style: nodeStyles.loserStakers,
    draggable: false,
  },
];

// Default edges with dashed lines
const initialEdges: Edge[] = [
  {
    id: "battle-to-vault",
    source: "battle-amm",
    target: "fee-vault",
    label: "Trading Fee 1%",
    labelStyle: { fill: "#ec4899", fontWeight: "bold" },
    style: { stroke: "#ec4899", strokeWidth: 2, strokeDasharray: "5,5" },
    animated: true,
  },
  {
    id: "champion-to-vault",
    source: "champion-amm",
    target: "fee-vault",
    label: "Trading Fee 1%",
    labelStyle: { fill: "#ffe259", fontWeight: "bold" },
    style: { stroke: "#ffe259", strokeWidth: 2, strokeDasharray: "5,5" },
    animated: true,
  },
  {
    id: "vault-to-stakers",
    source: "fee-vault",
    target: "loser-stakers",
    label: "100% of All Fees",
    labelStyle: { fill: "#14b8a6", fontWeight: "bold" },
    style: { stroke: "#14b8a6", strokeWidth: 2, strokeDasharray: "5,5" },
    animated: true,
  },
];

interface FeeFlowChartProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

export default function FeeFlowChart({
  className = "",
  title,
  subtitle,
}: FeeFlowChartProps) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className={`w-full ${className}`}>
      {/* Inject custom CSS */}
      <style jsx global>
        {customStyles}
      </style>

      {title && (
        <div className="text-center mb-6">
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            {title}
          </h3>
          {subtitle && <p className="text-gray-300 mt-2">{subtitle}</p>}
        </div>
      )}

      <div className="w-full h-[400px] bg-gray-900/80 rounded-xl overflow-hidden border border-gray-800">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnScroll={false}
          zoomOnScroll={false}
          panOnDrag={false}
          fitView
          attributionPosition="bottom-right"
          className="no-drag-nodes"
          preventScrolling={true}
        >
          <Background color="#6b7280" gap={16} size={1} />
          <Controls
            showInteractive={false}
            showZoom={false}
            showFitView={false}
          />
        </ReactFlow>
      </div>

      <div className="max-w-2xl mx-auto text-center mt-6 p-6 bg-teal-900/20 rounded-lg border border-teal-500/30">
        <p className="text-lg text-white">
          <span className="text-teal-400 font-bold">Trading fee (1%)</span> from
          all transactions don&apos;t go to the team or developers -
          <span className="text-green-400 font-bold">
            {" "}
            100% goes to LOSER token stakers
          </span>
          .
        </p>
        <p className="text-sm text-gray-300 mt-2">
          Unlike traditional protocol fees, BUMPWIN returns all fee revenue to
          the community.
        </p>
      </div>
    </div>
  );
}
