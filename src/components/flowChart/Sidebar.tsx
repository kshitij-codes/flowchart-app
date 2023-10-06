// Sidebar.js

import React from "react";

interface Sidebar {
  onSave: () => void;
}

const Sidebar = ({ onSave }: Sidebar) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
    nodeVersion?: string
  ) => {
    const data = JSON.stringify({ nodeType, nodeVersion });
    event.dataTransfer.setData("application/reactflow", data);

    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="flex justify-between flex-col">
      <div>
        <div className="description">
          You can drag these nodes to the pane on the left.
        </div>
        <div
          className="dndnode input"
          onDragStart={(event) => onDragStart(event, "input")}
          draggable
        >
          Start
        </div>
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, "default", "statement")}
          draggable
        >
          Statement
        </div>
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, "default", "question")}
          draggable
        >
          Question
        </div>
        <div
          className="dndnode output"
          onDragStart={(event) => onDragStart(event, "output")}
          draggable
        >
          End
        </div>
      </div>
      <div>
        <button
          onClick={onSave}
          className="px-4 py-2 text-base rounded bg-lime-500 w-full mb-2"
        >
          Save Flow
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
