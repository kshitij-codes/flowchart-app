import React, { useEffect, useState } from "react";

interface DialogProps {
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
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Dialogbox = ({ nodeData, setNodeData, setOpen }: DialogProps) => {
  const [formData, setFormData] = useState({ prompt: { name: "", value: "" } });

  useEffect(() => {
    setFormData({
      prompt: {
        name: nodeData.formData.prompt.name || "",
        value: nodeData.formData.prompt.value || "",
      },
    });
    console.log(formData);
  }, [nodeData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      prompt: {
        ...prevFormData.prompt,
        name: name,
        value: value,
      },
    }));
    console.log(formData.prompt.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Update nodeData with updated formData
    setNodeData((prevNodeData) => ({
      ...prevNodeData,
      formData: formData,
    }));

    setOpen(false);
  };

  return (
    <div className="p-8 rounded border shadow m-4">
      <h1>
        <span className="font-medium">Node ID: </span>
        {nodeData.id}
      </h1>
      <h1 className="mb-6">
        <span className="font-medium">Node Type: </span>
        {nodeData.version}
      </h1>
      {nodeData.version === "statement" && (
        <form onSubmit={handleSubmit}>
          <label>
            Enter your Statement
            <input
              type="text"
              name="Statement"
              value={formData.prompt.value}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="px-4 py-2 mt-4 mr-2 rounded bg-lime-400"
            >
              Save
            </button>
            <button className="px-4 py-2 text-base rounded bg-red-500">
              Delete
            </button>
          </label>
        </form>
      )}
      {nodeData.version === "question" && (
        <form onSubmit={handleSubmit}>
          <label className="font-medium mb-3">
            Enter your Question:
            <input
              type="text"
              name="Question"
              value={formData.prompt.value}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="px-4 py-2 mt-4 rounded bg-lime-400"
            >
              Save
            </button>
            <button className="px-4 py-2 text-base rounded bg-red-500">
              Delete
            </button>
          </label>
        </form>
      )}
    </div>
  );
};

export default Dialogbox;
