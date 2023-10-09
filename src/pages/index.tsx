import Dialogbox from "@/components/dialogBox/dialogbox";
import Chatbox from "@/components/flowChart/Chatbox";
import Flowchart from "@/components/flowchart2/Flowchart";
import { useState } from "react";

export default function App() {
  const [open, setOpen] = useState(false);
  const [nodeData, setNodeData] = useState({
    id: "",
    version: "",
    formData: { prompt: { name: "", value: "" } },
  });

  return (
    <div className="p-4">
      <h1 className="text-center mb-4 text-2xl font-medium">FlowChart App</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Flowchart />
        </div>
        <div className="col-span-1">
          {open && (
            <Dialogbox
              nodeData={nodeData}
              setNodeData={setNodeData}
              setOpen={setOpen}
            />
          )}
        </div>
        <div>
          <Chatbox />
        </div>
      </div>
    </div>
  );
}
