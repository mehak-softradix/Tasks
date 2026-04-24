import React, { useState } from "react";

const MoveCardPopup = ({
  onClose,
  columnOrder,
  board,
  selectedTask,
  moveTask,
}: {
  onClose: () => void;
  columnOrder: { id: string; title: string }[];
  board: any;
  selectedTask: any;
  moveTask: (
    from: string,
    to: string,
    index: number,
    targetIndex?: number,
  ) => void;
}) => {
  const [selectedListId, setSelectedListId] = useState(
    selectedTask?.colId || columnOrder[0]?.id,
  );

  const [selectedPosition, setSelectedPosition] = useState(
    board?.[selectedTask?.colId]?.length || 0,
  );

  const selectedColumn = board?.[selectedListId] || [];

  return (
    <div>
      <div className="absolute top-0 left-60 z-50">
        <div className="bg-[#2b2b2b] w-[320px] rounded-md shadow-lg p-4 text-white relative">
          <h1 className="text-md font-semibold text-gray-300 text-center mb-3">
            Move Card
          </h1>

          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>

          <div className="flex gap-2">
            <p>Inbox</p>
            <p>Board</p>
          </div>

          <hr className="border-gray-400 my-2" />

          <div>
            <p className="text-xs font-medium mb-3">Select Destination</p>
            <h2 className="text-base font-semibold">Board</h2>

            <select className="border border-gray-400 px-4 py-2 rounded-md w-full">
              <option>My Board</option>
            </select>
          </div>

          <div className="flex gap-5 mt-5">
            <div>
              <p className="text-sm font-semibold">List</p>

              <select
                className="border border-gray-400 w-45 px-4 py-1.5 rounded-sm mt-1"
                value={selectedListId}
                onChange={(e) => setSelectedListId(e.target.value)}
              >
                {columnOrder.map((col) => (
                  <option
                    key={col.id}
                    value={col.id}
                    className="bg-[#2b2b2b]  text-white rounded-md"
                  >
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-sm font-semibold">Position</p>

              <select
                className="border border-gray-400 w-20 px-4 py-1.5 mt-1 rounded-sm"
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(Number(e.target.value))}
              >
                {Array.from({
                  length: selectedColumn.length + 1,
                }).map((_, index) => (
                  <option
                    key={index}
                    value={index}
                    className="bg-[#2b2b2b] text-white"
                  >
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="w-full mt-5 bg-blue-500 py-2 rounded-md"
            onClick={() => {
              moveTask(
                selectedTask.colId,
                selectedListId,
                selectedTask.index,
                selectedPosition,
              );
              onClose();
            }}
          >
            Move
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveCardPopup;
