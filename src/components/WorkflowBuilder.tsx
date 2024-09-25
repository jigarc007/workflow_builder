import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
} from "react-flow-renderer";
import FilterNode from "./FilterNode";
import FileNode from "./FileNode";
import { storeEdgesData } from "../redux/EdgesReducer";
import { storeNodesData } from "../redux/NodeReducer";
import { useDispatch } from "react-redux";
// Custom node component


const initialEdges: Edge[] = [];

const WorkflowBuilder: React.FC<{initialNodes: Node[],initialEdges: Edge[], nodeTypes: any}> = ({initialNodes,initialEdges, nodeTypes}) => {
  console.log('WorkflowBuilder nodeTypes:>',nodeTypes)
  console.log('WorkflowBuilder initialNodes:>',initialNodes)
  const dispatch = useDispatch();
  // Using the latest React Flow hooks for nodes and edges state management
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  console.log('WorkflowBuilder initialEdges==============:>',initialEdges)
  
  console.log('WorkflowBuilder edges==============:>',edges)
  const [nodeTypeValues, setNodeTypeValues] = useState<any>({});
 
  //   const handleCsvData = (data: CsvDataType) => {
  //     setCsvData(data);
  // }
  // Function to handle node dragging
  useEffect(()=>{
    console.log('useEffect initialNodes:>',initialNodes)
    setNodes(initialNodes)
    dispatch(storeNodesData(initialNodes));
  },[dispatch, JSON.stringify(initialNodes), setNodes])
  useEffect(()=>{
    console.log('useEffect initialNodes:>',initialNodes)
    setEdges(initialEdges)
  },[dispatch, JSON.stringify(initialEdges), setEdges])
  useEffect(()=>{
    console.log('useEffect nodeTypes:>',nodeTypes)

    setNodeTypeValues(nodeTypes)
  },[setNodeTypeValues, JSON.stringify(nodeTypes)])
  useEffect(()=>{
    console.log('useEffect edges:>',edges)

    dispatch(storeEdgesData(edges));
  },[dispatch, JSON.stringify(edges)])
  console.log('workflowbuilder nodes:>',nodes);
  const onNodeDragStart = useCallback(
    (event: React.DragEvent, nodeType: string) => {
      const newNode: Node = {
        id: `${nodeType}-${+new Date()}`,
        type: `${nodeType}Node`,
        position: { x: Math.random() * 250 + 50, y: Math.random() * 250 + 50 }, // Random position on canvas
        data: { label: `${nodeType} Node` },
      };
      dispatch(storeNodesData(newNode));
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  // Function to handle adding edges
  const onConnect = useCallback(
    (params: Edge | Connection) => {
      
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  // Function to remove nodes and edges
  const onElementsRemove = useCallback(
    (elementsToRemove: (Node | Edge)[]) => {
      const nodesToRemove = elementsToRemove.filter(
        (el) => "id" in el && el.type !== "edge"
      );
      const edgesToRemove = elementsToRemove.filter(
        (el) => "id" in el && el.type === "edge"
      );

      if (nodesToRemove.length) {
        setNodes((nds) =>
          nds.filter((n) => !nodesToRemove.find((el) => el.id === n.id))
        );
      }
      if (edgesToRemove.length) {
        setEdges((eds) =>
          eds.filter((e) => !edgesToRemove.find((el) => el.id === e.id))
        );
      }
    },
    [setNodes, setEdges]
  );
  console.log({nodes});
  return (
    <ReactFlowProvider>
      <div
        className="workflow-builder"
        style={{ height: "100%", display: "flex" }}
      >
        {/* React Flow Canvas */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onElementsRemove}
          nodeTypes={nodeTypes}
          onConnectStart={(params)=>{
            console.log('on connect start is called', params)
          }}
          fitView
        >
          {/* Optional Helpers */}
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default WorkflowBuilder;
