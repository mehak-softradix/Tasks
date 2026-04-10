  "use client";

  import React, { useState } from "react";
  import { LabelDropDownProps } from "../Interafce/types";
  import DeleteModal from "./DeleteModal";

  const colors = [
    "#065f46",
    "#92400e",
    "#9a3412",
    "#7f1d1d",
    "#581c87",
    "#047857",
    "#a16207",
    "#b45309",
    "#dc2626",
    "#7e22ce",
    "#10b981",
    "#fbbf24",
    "#fb923c",
    "#f87171",
    "#c084fc",
    "#1e3a8a",
    "#0f766e",
    "#365314",
    "#701a1a",
    "#374151",
    "#2563eb",
    "#0891b2",
    "#4d7c0f",
    "#be185d",
    "#6b7280",
    "#60a5fa",
    "#67e8f9",
    "#a3e635",
    "#f472b6",
    "#9ca3af",
  ];

  const LabelDropDown = ({
    onClose,
    onSave,
    initialData,
    onDelete
  }: LabelDropDownProps) => {
    const [title, setTitle] = useState(initialData?.title || "");
    const [showModal, setShowModal] = useState(false);

    const [selectedColor, setSelectedColor] = useState<string | null>(
      initialData?.color || "bg-gray-500",
    );

    const handleSave = () => {
      if (!title || !selectedColor) return;

      onSave({
        title,
        color: selectedColor ,
        
      });
    
    };

    
  

    return (
      <div className="absolute top-10 right-0 z-20">
        <div className="bg-[#2b2b2b] w-[320px] rounded-md shadow-lg p-4 text-white relative">
          <h1 className="text-md font-semibold text-gray-300 text-center mb-3">
            Edit label
          </h1>

          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>

          {/* Preview */}
          <div
            className="w-full text-sm px-3 py-2 rounded mb-4 text-center w-30"
            style={{ backgroundColor: selectedColor || "#232323" }}
          >
            {title}
          </div>

          {/* Title Input */}
          <label className="text-sm font-semibold text-gray-400">Title</label>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={2}
            className="w-full mt-1 mb-4 px-2 py-1 rounded bg-[#1f1f1f] border border-gray-600 outline-none text-sm break-words"
          />

          <p className="text-xs text-gray-400 mb-2">Select a color</p>

          <div className="grid grid-cols-5 gap-2 mb-4">
            {colors.map((color, index) => (
              <div
                key={index}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-8 rounded cursor-pointer border-2 ${
                  selectedColor === color ? "border-white" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <button
            onClick={() => setSelectedColor("transparent")}
            className="w-full text-sm text-gray-400 bg-[#1f1f1f] py-2 rounded mb-3"
          >
            ✕ Remove color
          </button>

          <div className="flex justify-between">
            <button
              className="bg-blue-400 px-3 py-1 rounded text-sm text-gray-900 font-medium"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="bg-red-400 px-3 py-1 rounded text-sm text-gray-900 font-medium"
              onClick={() => setShowModal(true)}
            >
              Delete
            </button>
          </div>
          {showModal && (
            <DeleteModal
              title="Delete Label"
              description="Are you sure you want to delete this label? this action cannot be undone"

              onClose={() => setShowModal(false)}
              onConfirm={() => {
              if (onDelete) onDelete();
                setShowModal(false);
                onClose();
              }}
            />
          )}
        </div>
      </div>
    );
  };

  export default LabelDropDown;
