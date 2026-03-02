"use client";

import { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { Plus, RotateCcw } from "lucide-react";

const NODE_COLORS = [
  "#1d4ed8", "#7c3aed", "#0f766e", "#b45309", "#be185d",
];

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "👤 User Auth" },
    style: { background: "#1d4ed8", color: "#fff", borderRadius: "12px" },
  },
  {
    id: "2",
    position: { x: 250, y: 100 },
    data: { label: "📦 Products Table" },
    style: {
      background: "#1e293b",
      color: "#fff",
      borderRadius: "12px",
      border: "1px solid #334155",
    },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
];

export default function QuantumCanvas() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge({ ...params, animated: true, style: { stroke: "#3b82f6" } }, eds)
      );
      console.log(
        "🔮 QoreDev Agent: Establishing relational link in Database..."
      );
    },
    []
  );

  const handleAddNode = useCallback(() => {
    const id = String(Date.now());
    const colorIdx = nodes.length % NODE_COLORS.length;
    const newNode: Node = {
      id,
      position: { x: Math.random() * 300, y: Math.random() * 200 },
      data: { label: `🗂️ Table ${nodes.length + 1}` },
      style: {
        background: NODE_COLORS[colorIdx],
        color: "#fff",
        borderRadius: "12px",
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length]);

  const handleReset = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs text-gray-500">
          {nodes.length} nodes · {edges.length} edges
        </span>
        <div className="ml-auto flex gap-2">
          <button
            onClick={handleAddNode}
            className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={13} /> Add Node
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-medium px-3 py-1.5 rounded-lg border border-gray-700 transition-colors"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>
      <div style={{ width: "100%", height: "400px" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
