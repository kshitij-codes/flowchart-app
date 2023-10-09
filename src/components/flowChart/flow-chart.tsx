import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button, Modal } from "flowbite-react";

import Sidebar from "./Sidebar";

interface Node {
  id: string;
  type: string;
  data: {
    label: string;
    version: string;
    formData?: {
      prompt: {
        name: string;
        value: string;
      };
    };
  };
  position: {
    x: number;
    y: number;
  };
}

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Start", version: "Start" },
    position: { x: 250, y: 5 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

interface NodeProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  nodeData: {
    id: string;
    version: string;
    formData: {
      prompt: {
        name: string;
        value: string;
      };
    };
  };
  setNodeData: React.Dispatch<
    React.SetStateAction<{
      id: string;
      version: string;
      formData: {
        prompt: {
          name: string;
          value: string;
        };
      };
    }>
  >;
}

const DnDFlow = ({ setOpen, nodeData, setNodeData }: NodeProps) => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { project, setViewport } = useReactFlow();

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      if (reactFlowWrapper.current) {
        const reactFlowBounds = (
          reactFlowWrapper.current as HTMLElement
        ).getBoundingClientRect();
        const data = event.dataTransfer.getData("application/reactflow");
        const { nodeType, nodeVersion } = JSON.parse(data);
        // check if the dropped element is valid
        if (typeof nodeType === "undefined" || !nodeType) {
          return;
        }
        if (reactFlowInstance) {
          const position = project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          });
          const newNode = {
            id: getId(),
            type: nodeType,
            position,
            data: {
              label: `${
                nodeType === "input"
                  ? "Start"
                  : nodeType === "output"
                  ? "End"
                  : nodeVersion !== ""
                  ? nodeVersion
                  : "Unknown"
              }`,
              version: nodeVersion,
            },
          };

          setNodes((nds) => nds.concat(newNode));
        }
      }
    },
    [reactFlowInstance, project]
  );

  const setReactFlow = (e: any) => {
    setReactFlowInstance(e);
    onRestore();
  };
  useEffect(() => {
    setNodes((prevNodes) => {
      return prevNodes.map((node) => {
        if (node.id === nodeData.id) {
          // Update the node data to include formData while keeping the existing label
          node.data = {
            ...node.data,
            formData: {
              prompt: {
                name: nodeData.formData.prompt.name,
                value: nodeData.formData.prompt.value,
              },
            },
          };
        }
        return node;
      });
    });
  }, [nodeData, setNodes]);

  const onNodeClick = (event: React.MouseEvent, node: any) => {
    const newNodeId = node.id;

    setOpen((prevOpen) => {
      // Toggle dialog box if clicking the same node
      if (prevOpen && (nodeData.id === newNodeId || nodeData.id === "")) {
        return !prevOpen;
      }

      // Update nodeData and formData
      setNodeData({
        id: node.id,
        version: node.data.version,
        formData: {
          prompt: {
            name: node.data?.formData?.prompt.name,
            value: node.data?.formData?.prompt.value,
          },
        },
      });
      return true;
    });
  };

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem("flow1", JSON.stringify(flow));
      console.log({ flow });
    }
  }, [reactFlowInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = () => {
      const storedFlow = localStorage.getItem("flow1");

      if (storedFlow) {
        const flow = JSON.parse(storedFlow);
        const { x = 0, y = 0, zoom = 0.5 } = flow.viewport;
        console.log({ x, y, zoom });
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setEdges, setViewport]);

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlow}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          fitView
        >
          <Controls />
        </ReactFlow>
      </div>
      <Sidebar onSave={onSave} />
    </div>
  );
};

export default ({
  setOpen,
  nodeData,
  setNodeData,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  nodeData: {
    id: string;
    version: string;
    formData: {
      prompt: {
        name: string;
        value: string;
      };
    };
  };
  setNodeData: React.Dispatch<
    React.SetStateAction<{
      id: string;
      version: string;
      formData: {
        prompt: {
          name: string;
          value: string;
        };
      };
    }>
  >;
}) => (
  <ReactFlowProvider>
    <DnDFlow setOpen={setOpen} setNodeData={setNodeData} nodeData={nodeData} />
  </ReactFlowProvider>
);
