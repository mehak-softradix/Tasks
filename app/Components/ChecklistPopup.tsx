import React, { useState } from "react";

import { ChecklistPopupProps } from "../Interafce/types";

const ChecklistPopup: React.FC<ChecklistPopupProps> = ({ onClose, onAddChecklist }) => {
  const [title, setTitle] = useState("Checklist");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
      <div className="bg-[#252525] w-[320px] rounded-md shadow-lg p-4 text-white">
        <div className="flex items-center mb-4 relative">
          <h1 className="text-base font-semibold text-gray-300 w-full text-center">
            Add checklist
          </h1>
          <button
            className="absolute right-0 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="mb-3">
          <label className="text-sm text-gray-300 block mb-1 font-semibold">
            Title
          </label>
          <input
            type="text"
            placeholder="Checklist"
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-1.5 rounded bg-[#1f1f1f] border border-gray-500 focus:outline-none text-white"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-300 block mb-1">
            Copy items from...
          </label>
          <select className="w-full px-3 py-2 rounded bg-[#1f1f1f] border border-gray-500 text-gray-400">
            <option>(none)</option>
          </select>
        </div>

        <button
          className="bg-blue-300 text-gray-900 px-4 py-1 rounded text-sm"
          onClick={() => {
            onAddChecklist(title.trim() || "Checklist");    
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ChecklistPopup;