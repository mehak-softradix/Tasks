"use client";

import { useState } from "react";
import { CardProps } from "../Interafce/types";
import DeleteModal from "./DeleteModal";

const Cards: React.FC<CardProps> = ({
  id,
  title,
  tasks,
  setBoard,
  dragItem,
  setDragItem,
  moveTask,
  setColumnOrder,
  setSelectedTask,
}) => {
  const [addTask, setAddTask] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAddTask = () => {
    if (addTask.trim() === "") return;

    setBoard((prev) => ({
      ...prev,
      [id]: [
        ...(prev[id] || []),
        {
          text: addTask,
          completed: false,
          description: "",
          checklist: [],
          priority: [],
        },
      ],
    }));
    setAddTask("");
  };

  const handleCompleteTask = (index: number) => {
    setBoard((prev) => ({
      ...prev,
      [id]: prev[id].map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task,
      ),
    }));
  };

  const handleEditTask = () => {
    if (editIndex === null || editText.trim() === "") return;

    setBoard((prev) => ({
      ...prev,
      [id]: prev[id].map((task, i) =>
        i === editIndex ? { ...task, text: editText } : task,
      ),
    }));

    setEditIndex(null);
    setEditText("");
  };

  const handleDeleteTask = (index: number) => {
    setBoard((prev) => ({
      ...prev,
      [id]: prev[id].filter((_, i) => i !== index),
    }));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.stopPropagation();
    setDragItem({ fromCol: id, index });
  };

  const handleDrop = (e: React.DragEvent, dropIndex?: number) => {
    e.preventDefault();
    if (!dragItem) return;

    const targetIndex = dropIndex !== undefined ? dropIndex : tasks.length;

    moveTask(dragItem.fromCol, id, dragItem.index, targetIndex);
    setDragItem(null);
    setDragOverIndex(null);
  };

  const handleEditColumn = () => {
    if (newTitle.trim() === "") return;

    // setBoard((prev) => {
    //   const newBoard = { ...prev };
    //   const columnData = newBoard[id];
    //   delete newBoard[id];
    //   newBoard[newTitle] = columnData;
    //   return newBoard;
    // });

    // setColumnOrder((prev) =>
    //   prev.map((col) => (col === id ? newTitle : col)),
    // );

    setColumnOrder((prev) =>
      prev.map((col) =>
        col.id === Number(id) ? { ...col, title: newTitle } : col,
      ),
    );

    setIsEditingTitle(false);
  };

  const handleConfirmDeleteColumn = () => {
    setBoard((prev) => {
      const newBoard = { ...prev };
      delete newBoard[id];
      return newBoard;
    });

    setColumnOrder((prev) => prev.filter((col) => col.id !== Number(id)));

    setShowDeleteModal(false);
  };

  return (
    <>
      <div
        className="  bg-gray-100 rounded-xl p-5 w-[300px]  shadow-md  max-h-[80vh]   shrink-0  flex flex-col "
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e)}
      >
        <div className="relative flex justify-between items-center mb-3 ">
          {/* <h2 className="text-lg font-semibold text-gray-800">{title}</h2> */}

          {isEditingTitle ? (
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleEditColumn}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEditColumn();
              }}
              className="border px-2 py-1 rounded text-black"
              autoFocus
            />
          ) : (
            <h2
              className="text-lg font-semibold text-gray-800 cursor-pointer"
              onClick={() => setIsEditingTitle(true)}
            >
              {title}
              <span className="text-sm bg-gray-200 px-2 py-0.5 rounded ml-3">
                {tasks?.length}
              </span>
            </h2>
          )}

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-600 hover:text-gray-800"
          >
            <img
              src="/images/three-dots.png"
              className="w-5 h-5 cursor-pointer"
            />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-0"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 bg-white shadow-md rounded-md p-2 z-10">
                <button
                  onClick={() => {
                    setIsEditingTitle(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 w-full cursor-pointer"
                >
                  <img src="/images/protectededit.svg" className="w-4 h-4 " />
                  <span className="text-sm text-black ">Edit</span>
                </button>

                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 w-full text-red-500 cursor-pointer"
                >
                  <img src="/images/sensidelete.svg" className="w-4 h-4 " />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            </>
          )}
          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setShowDeleteModal(false)}
              />

              <div
                className="relative z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <DeleteModal
                  title="Delete Card"
                  description="Are you sure you want to delete this card? This action cannot be undone"
                  onClose={() => setShowDeleteModal(false)}
                  onConfirm={handleConfirmDeleteColumn}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tasks */}
        <div className="space-y-2 overflow-y-auto">
          {tasks?.map((task, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverIndex(index);
              }}
              onDrop={(e) => handleDrop(e, index)}
              className={`bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-pointer ${
                dragOverIndex === index ? "ring-2 " : ""
              }`}
            >
              {editIndex === index ? (
                <>
                  <textarea
                    className="w-full text-sm p-2 border rounded-md outline-none resize-none text-black"
                    value={editText}
                    autoFocus
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleEditTask();
                      }
                      if (e.key === "Escape") {
                        setEditIndex(null);
                        setEditText("");
                      }
                    }}
                  />

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleEditTask}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => {
                        setEditIndex(null);
                        setEditText("");
                      }}
                      className="text-gray-500 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p
                    className="text-sm text-gray-800 mt-1 break-words"
                    onClick={() =>
                      setSelectedTask({
                        text: task.text,
                        description: task.description,
                        attachment: task.attachment || [],
                        priority: task.priority || [],
                        checklist: task.checklist || [],
                        index,
                        colId: id,
                      })
                    }
                  >
                      {task.attachment && task.attachment.length > 0 && (
                    <img
                      src={task.attachment[0].src} 
                      alt="cover"
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                  )}
                    {task.text}
                  </p>
                
                  {task.priority && task.priority.length > 0 && (
                    <div className="mt-2 flex gap-1 flex-wrap">
                      {task.priority.map((p: string, i: number) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-1 rounded font-medium ${
                            p === "High Priority"
                              ? "bg-red-400 text-white"
                              : p === "Medium Priority"
                                ? "bg-yellow-400 text-white"
                                : "bg-green-400 text-white"
                          }`}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end items-center mt-2">
                    <img
                      src="/images/download.png"
                      className="w-5 h-5 cursor-pointer"
                      onClick={() =>
                        setActiveIndex(index === activeIndex ? null : index)
                      }
                    />
                  </div>

                  {activeIndex === index && (
                    <div className="flex gap-2 mt-2 bg-gray-100 p-2 rounded-md shadow">
                      <button
                        onClick={() => {
                          setEditIndex(index);
                          setEditText(task.text);
                          setActiveIndex(null);
                        }}
                      >
                        <img src="/images/protectededit.svg" />
                      </button>

                      <button
                        onClick={() => {
                          handleDeleteTask(index);
                          setActiveIndex(null);
                        }}
                      >
                        <img src="/images/sensidelete.svg" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add Card Button */}

        {showInput && (
          <div className="mt-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <textarea
              placeholder="Enter a title..."
              className="w-full text-sm p-2 border rounded-md outline-none resize-none text-black"
              rows={3}
              value={addTask}
              autoFocus
              onChange={(e) => setAddTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddTask();
                  setShowInput(false);
                }
              }}
            />

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => {
                  handleAddTask();
                  setShowInput(false);
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
              >
                Add
              </button>

              <button
                onClick={() => {
                  setShowInput(false);
                  setAddTask("");
                }}
                className="text-gray-500 text-lg"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="mt-3">
          {!showInput && (
            <button
              onClick={() => {
                setShowInput(true);
                setEditIndex(null);
              }}
              className="text-base text-gray-600 hover:text-black flex items-center gap-1 cursor-pointer"
            >
              + Add a card
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Cards;
