"use client";

import { useState, useRef, useEffect } from "react";
import { CardProps } from "../Interafce/types";
import DeleteModal from "./DeleteModal";
import Image from "next/image";
import Popup from "./Popup";
import EditModal from "./EditModal";

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

  const [showPopup, setShowPopup] = useState(false);

  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const [activeCard, setActiveCard] = useState<{
    id: string;
    top: number;
    left: number;
  } | null>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);

 

  const handleAddTask = () => {
    if (addTask.trim() === "") return;

    setBoard((prev) => ({
      ...prev,
      [id]: [
        ...(prev[id] || []),
        {
          id: Date.now().toString(),
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

    setColumnOrder((prev) =>
      prev.map((col) => (col.id === id ? { ...col, title: newTitle } : col)),
    );

    setIsEditingTitle(false);
  };

  const handleConfirmDeleteColumn = () => {
    setBoard((prev) => {
      const newBoard = { ...prev };
      delete newBoard[id];
      return newBoard;
    });

    setColumnOrder((prev) => prev.filter((col) => col.id !== id));

    setShowDeleteModal(false);
  };

  

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  return (
    <>
      <div
        className="  bg-gray-100 rounded-xl p-4 w-[270px]  shadow-md  max-h-[80vh]   shrink-0  flex flex-col   "
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e)}
      >
        <div className="relative flex justify-between items-center mb-3  ">
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
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
            <Image
              alt="menu"
              width={20}
              height={20}
              src="/images/three-dots.png"
              className=" cursor-pointer"
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
                  <Image
                    src="/images/protectededit.svg"
                    alt="edit"
                    width={20}
                    height={20}
                  />
                  <span className="text-sm text-black ">Edit</span>
                </button>

                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 w-full text-red-500 cursor-pointer"
                >
                  <Image
                    src="/images/sensidelete.svg"
                    alt="delete"
                    width={20}
                    height={20}
                  />
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
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverIndex(index);
              }}
              onDrop={(e) => handleDrop(e, index)}
              className={`bg-white pb-3 rounded-lg shadow-sm border-b border-gray-200 cursor-pointer relative group  ${
                dragOverIndex === index ? "ring-2 " : ""
              }     ${activeCardId === task.id ? "z-50" : "z-0"}`}
            >
              <div className="absolute top-2 right-2  opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/80 backdrop-blur  rounded-md shadow">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditIndex(index);
                    setEditText(task.text);
                  }}
                >
                  <Image
                    src="/images/edit.svg"
                    alt="edit"
                    width={20}
                    height={20}
                  />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(index);
                  }}
                ></button>
              </div>
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
                  <div
                    className="text-sm text-gray-800 mt-1 break-words"
                    onClick={() =>
                      setSelectedTask({
                        id: task.id,
                        text: task.text,
                        description: task.description,
                        attachment: task.attachment || [],
                        priority: task.priority || [],
                        checklist: task.checklist || [],
                        index,
                        completed: task.completed,
                        colId: id,
                      })
                    }
                  >
                    {task.attachment && task.attachment.length > 0 && (
                      <div className="w-full h-25 relative ">
                        <Image
                          src={task.attachment[0].src}
                          alt="cover"
                          fill
                          className=" object-cover rounded-t-lg"
                        />
                        <div className="absolute  p-1 top-2 right-2  opacity-0 group-hover:opacity-100 transition-opacity flex justify-center  rounded-full  bg-white/80 backdrop-blur   shadow">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              const rect = (
                                e.currentTarget as HTMLElement
                              ).getBoundingClientRect();

                              const modalWidth = 180;
                              const gap = 10;

                              let left = rect.right + gap;

                              // prevent right overflow
                              if (left + modalWidth > window.innerWidth) {
                                left = rect.left - modalWidth - gap;
                              }

                              setActiveCard({
                                id: task.id,
                                top: rect.top,
                                left,
                              });
                              setActiveCardId(task.id);
                            }}
                          >
                            <Image
                              src="/images/edit.svg"
                              alt="edit"
                              width={20}
                              height={20}
                              className="ml-[1px]"
                            />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              handleDeleteTask(index);
                            }}
                          ></button>
                        </div>
                      </div>
                    )}

                    {task.priority && task.priority.length > 0 && (
                      <div className=" flex gap-1 flex-wrap px-3">
                        {task.priority.map((p: string, i: number) => (
                          <span
                            key={i}
                            className={`text-xs px-[8px] py-[2px] rounded font-semibold mt-2.5 ${
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
                    <div className="px-3 py-1 font-medum text-gray-800 font-medium">
                      {task.text}
                    </div>
                  </div>

                  <div className="flex justify-start items-center  px-3.5">
                    <div className="">
                      <Image
                        src="/images/menu.svg"
                        alt="checklist"
                        width={20}
                        height={20}
                        className="cursor-pointer "
                        onClick={() => setShowPopup(true)}
                      />
                    </div>

                    <div className=" flex gap-2 items-center ml-2">
                      <div className="  relative w-3.5 h-3.5 ml-2">
                        <Image src="/images/attach.svg" alt="attach" fill />
                        {task.attachment && task.attachment.length > 0 && (
                          <span className="text-[15px] font-medium text-gray-600 absolute -top-1 left-5 px-1 ">
                            {task.attachment.length}
                          </span>
                        )}
                      </div>
                    </div>
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
                        <Image
                          src="/images/protectededit.svg"
                          alt="edit"
                          width={20}
                          height={20}
                        />
                      </button>

                      <button
                        onClick={() => {
                          handleDeleteTask(index);
                          setActiveIndex(null);
                        }}
                      >
                        <Image
                          src="/images/sensidelete.svg"
                          alt="delete"
                          width={20}
                          height={20}
                        />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {activeCard && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/90   z-40"
              onClick={() => setActiveCardId(null)}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50  ">
              <div onClick={(e) => e.stopPropagation()}>
                <EditModal
                  taskId={activeCard.id}
                  onClose={() => {
                    setActiveCard(null);
                    setActiveCardId(null);
                  }}
                  position={{
                    top: activeCard.top,
                    left: activeCard.left,
                  }}
                />
              </div>
            </div>
          </>
        )}

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
