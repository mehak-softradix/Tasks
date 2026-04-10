"use client";

import { useState } from "react";
import { BoardData, Column } from "../Interafce/types";

type Props = {
  setBoard: React.Dispatch<React.SetStateAction<BoardData>>;
  setColumnOrder: React.Dispatch<React.SetStateAction<Column[]>>;
  
};

const Sidebar = ({ setBoard, setColumnOrder }: Props) => {
  const [newColumn, setNewColumn] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleAddColumn = () => {

    if (!newColumn.trim()) return;

    const newColObj: Column = {
      id:  Date.now(),
      title: newColumn,
    };

    setBoard((prev) => {
      if (prev[newColumn]) return prev;

      return {
        [newColumn]: [],
        ...prev,
      };
    });

    setColumnOrder((prev) => [newColObj, ...prev]);
    setNewColumn("");
  };

  return (
    <div
      className="h-auto w-80 shrink-0 
  bg-gradient-to-b from-[#ecd3bc] to-blue-100 
  backdrop-blur-lg border-r shadow-lg rounded-lg"
    >
      <div className="bg-black/10 backdrop-blur-md p-2  rounded-lg mb-5">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center mt-2">
          Workspace
        </h2>
      </div>
      {!showInput && (
        <button
          onClick={() => setShowInput(true)}
          className="w-full text-lg text-left px-3 py-2 rounded-lg text-gray-800 font-semibold cursor-pointer "
        >
          + Add a card
        </button>
      )}

      {showInput && (
        <div className="mt-3 bg-white p-3 rounded-xl shadow-sm border">
          <textarea
            placeholder="Enter a title for this card..."
            className="w-full p-2 border rounded-md text-base text-gray-800 font-medium focus:outline-none   resize-none"
            value={newColumn}
            onChange={(e) => setNewColumn(e.target.value)}
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); 
                handleAddColumn();
                setShowInput(false);
              }
            }}
            autoFocus
          />

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => {
                handleAddColumn();
                setShowInput(false);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 text-sm  font-semibold rounded-md transition"
            >
              Add Card
            </button>

            <button
              onClick={() => {
                setShowInput(false);
                setNewColumn("");
              }}
              className="text-gray-400 hover:text-gray-700 text-lg leading-none"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
