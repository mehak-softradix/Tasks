import React, { useState } from "react";
import { useEffect } from "react";

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

  position: {
    top: number;
    left: number;

  };
}) => {
  const [selectedListId, setSelectedListId] = useState(
    selectedTask?.colId || columnOrder[0]?.id,
  );

  const [selectedPosition, setSelectedPosition] = useState(
    board?.[selectedTask?.colId]?.length || 0,
  );

  const selectedColumn = board?.[selectedListId] || [];
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [showListDropdown, setShowListDropdown] = useState(false);
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState("My Board");
  const [listSearch, setListSearch] = useState("");

  const filteredColumns = columnOrder.filter((col) =>
    col.title.toLowerCase().includes(listSearch.toLowerCase()),
  );

  useEffect(() => {
    setSelectedPosition(board?.[selectedListId]?.length || 0);
  }, [selectedListId, board]);
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
            <p className="text-md font-semibold text-gray-300 ">Inbox</p>
            <p className="text-md font-semibold text-gray-300 ">Board</p>
          </div>

          <hr className="border-gray-400 my-2 " />

          <div>
            <p className="text-xs font-semibold mb-3 mt-3 text-gray-400 ">
              Select destination
            </p>
            <h2 className="text-base font-semibold">Board</h2>

            {/* <select className="border border-gray-400 px-4 py-2 rounded-md w-full">
              <option>My Board</option>
            </select> */}
            <div className="relative w-full">
              {/* Selected */}
              <div
                onClick={() => setShowBoardDropdown(!showBoardDropdown)}
                className="border border-gray-400 bg-[#2b2b2b] px-4 py-2 rounded-md text-white flex items-center justify-between cursor-pointer"
              >
                <span>{selectedBoard}</span>

                <span className="text-gray-300 text-sm">
                  {showBoardDropdown ? "⌃" : "⌄"}
                </span>
              </div>

              {/* Dropdown */}
              {showBoardDropdown && (
                <div className="absolute top-12 left-0 z-50 w-full rounded-md bg-[#2b2b2b] border border-[#4a4a4a] shadow-lg text-white">
                  {/* Header */}
                  <div className="px-3 py-2 border-b border-[#3d3d3d]">
                    <p className="text-sm font-medium text-gray-300">
                      Select Board
                    </p>
                  </div>

                  {/* Options */}
                  <div className="max-h-[200px] overflow-y-auto">
                    {["My Board"].map((board) => (
                      <div
                        key={board}
                        onClick={() => {
                          setSelectedBoard(board);
                          setShowBoardDropdown(false);
                        }}
                        className={`px-4 py-2 cursor-pointer text-sm transition-all ${
                          selectedBoard === board
                            ? "bg-[#0d3b66] text-[#4ea1ff]"
                            : "hover:bg-[#3a3a3a] text-gray-200"
                        }`}
                      >
                        {board}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <div>
              <p className="text-sm font-semibold">List</p>

              <div className="relative mt-1 w-[200px]">
                {/* Selected Value */}
                <div
                  className={`border px-4 py-1.5 rounded-md text-white flex items-center justify-between cursor-pointer bg-[#2b2b2b] ${
                    showListDropdown ? "border-blue-400" : "border-gray-400"
                  }`}
                  onClick={() => setShowListDropdown(!showListDropdown)}
                >
                  <span>
                    {
                      columnOrder.find((col) => col.id === selectedListId)
                        ?.title
                    }
                  </span>

                  <span className="text-gray-300 text-sm">
                    {showListDropdown ? "⌃" : "⌄"}
                  </span>
                </div>

                {/* Dropdown */}
                {showListDropdown && (
                  <div className="absolute top-12 left-0 z-50 w-full rounded-md bg-[#2b2b2b] border border-[#4a4a4a]  shadow-lg text-white">
                    {/* Header */}
                    <div className="px-3 py-1.5 border-b border-[#3d3d3d] ">
                      <p className="text-sm font-medium text-gray-300">
                        Select List
                      </p>
                      {/* <input
                        type="text"
                        placeholder="Search list..."
                        value={listSearch}
                        onChange={(e) => setListSearch(e.target.value)}
                        className="mt-2 w-full px-2 py-1 text-sm rounded bg-[#1f1f1f] border border-[#444] text-white outline-none"
                      /> */}
                    </div>

                    {/* List Options */}
                    <div className="max-h-40 overflow-y-auto">
                      {filteredColumns.map((col) => (
                        <div
                          key={col.id}
                          onClick={() => {
                            setSelectedListId(col.id);
                            setShowPositionDropdown(false);
                          }}
                          className={`px-4 py-1.5 cursor-pointer text-base font-medium transition-all  border-l-2 flex flex-col ${
                            selectedListId === col.id
                              ? "bg-[#0d3b66] text-[#4ea1ff]"
                              : "hover:bg-[#3a3a3a] text-gray-200 hover:border-l-2 hover:border-[#4ea1ff]"
                          }`}
                        >
                          {col.title}

                          {selectedTask?.colId === col.id && (
                            <span
                              className={` text-xs  ${
                                selectedListId === col.id
                                  ? "text-[#4ea1ff]"
                                  : "text-gray-300 group-hover:text-[#4ea1ff]"
                              }`}
                            >
                              (current)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold">Position</p>

              <div className="relative mt-1 w-20">
                {/* Selected Value */}
                <div
                  onClick={() => setShowPositionDropdown(!showPositionDropdown)}
                  className={`border px-4 py-1.5 rounded-md text-white flex items-center justify-between cursor-pointer bg-[#2b2b2b] ${
                    showPositionDropdown ? "border-blue-400" : "border-gray-400"
                  }`}
                >
                  <span>{selectedPosition + 1}</span>

                  <span className="text-gray-300 text-sm">
                    {showPositionDropdown ? "⌃" : "⌄"}
                  </span>
                </div>

                {/* Dropdown */}
                {showPositionDropdown && (
                  <div className="absolute top-12 left-0 z-50 w-full rounded-md bg-[#2b2b2b] border border-[#4a4a4a] shadow-lg text-white">
                    {/* Header */}
                    <div className="px-3 py-2 border-b border-[#3d3d3d]"></div>

                    {/* Position Options */}
                    <div className="max-h-40 overflow-y-auto">
                      {Array.from({
                        length: selectedColumn.length + 1,
                      }).map((_, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setSelectedPosition(index);
                            setShowPositionDropdown(false);
                          }}
                          className={`px-4 py-2 cursor-pointer text-sm transition-all flex gap-3 ${
                            selectedPosition === index
                              ? "bg-[#0d3b66] text-[#4ea1ff]"
                              : "hover:bg-[#3a3a3a] text-gray-200"
                          }`}
                        >
                          {index + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            className="w-full mt-5 bg-blue-400 py-2 rounded-md font-medium"
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
