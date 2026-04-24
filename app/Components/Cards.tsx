"use client";

import { useState, useRef, useEffect } from "react";
import { CardProps, Label, Member } from "../Interafce/types";
import DeleteModal from "./DeleteModal";
import Image from "next/image";
import Popup from "./Popup";
import EditModal from "./EditModal";
import { useRouter } from "next/navigation";

import MemberModal from "./MemberModal";
import Labels from "./Labels";
import ChangeCoverPoup from "./ChangeCoverPoup";
import MoveCardPopup from "./MoveCardPopup";

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
  members,
  columnOrder,
  board,
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

  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const [openMemberModal, setOpenMemberModal] = useState(false);

  const [activeCard, setActiveCard] = useState<{
    id: string;
    index: number;
    top: number;
    left: number;
  } | null>(null);

  const [priority, setPriority] = useState<string[]>([]);
  // const [priorities, setPriorities] = useState<Label[]>([
  //   { title: "High Priority", color: "#ef4444" },
  //   { title: "Medium Priority", color: "#eab308" },
  //   { title: "Low Priority", color: "#22c55e" },
  // ]);
  const [priorities, setPriorities] = useState<Label[]>([]);
  // const [labels, setLabels] = useState<Label[]>([]);
  const [cardMembers, setCardMembers] = useState<Member[]>([]);
  const [showChangeCoverPopup, setShowChangeCoverPopup] = useState(false);
  const [moveCardPopup, setMoveCardPopup] = useState(false);
  const selectedTask = activeCard
    ? {...tasks.find((t) => t.id === activeCard?.id),
      colId: id,
      index: activeCard.index,
    }

    : null;

  const titleInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

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
          members: [],
          coverColor: null,
          coverImage: null,
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

  const handleOpenCard = (task, index) => {
    setSelectedTask({
      id: task.id,
      text: task.text,
      description: task.description,
      attachment: task.attachment || [],
      priority: task.priority || [],
      checklist: task.checklist || [],
      members: task.members || [],
      index,
      completed: task.completed,
      colId: id,
    });

    router.replace(`?taskId=${task.id}`);
  };
  const handlePriorityChange = (newPriority: string[]) => {
    if (!activeCard) return;

    setBoard((prev) => ({
      ...prev,
      [id]: prev[id].map((task) =>
        task.id === activeCard.id ? { ...task, priority: newPriority } : task,
      ),
    }));

    setPriority(newPriority);
  };

  //   const handleSetAttachments = (newAttachments) => {
  //   if (!activeCard) return;

  //   setBoard((prev) => ({
  //     ...prev,
  //     [id]: prev[id].map((task) =>
  //       task.id === activeCard.id
  //         ? { ...task, attachment: newAttachments }
  //         : task
  //     ),
  //   }));
  // };

  const handleSetAttachments = (
    newAttachmentsOrUpdater:
      | Attachment[]
      | ((prev: Attachment[]) => Attachment[]),
  ) => {
    if (!activeCard) return;

    setBoard((prev) => ({
      ...prev,
      [id]: prev[id].map((task) => {
        if (task.id !== activeCard.id) return task;

        const currentAttachments = task.attachment || [];
        const newAttachments =
          typeof newAttachmentsOrUpdater === "function"
            ? newAttachmentsOrUpdater(currentAttachments)
            : newAttachmentsOrUpdater;

        return { ...task, attachment: newAttachments };
      }),
    }));
  };

  const handleSetCoverColor = (color: string | null) => {
    if (!activeCard) return;

    setBoard((prev) => ({
      ...prev,
      [id]: prev[id].map((task) =>
        task.id === activeCard.id ? { ...task, coverColor: color } : task,
      ),
    }));
  };

  const handleSetCoverImage = (image: string | null) => {
    if (!activeCard) return;

    setBoard((prev) => ({
      ...prev,
      [id]: prev[id].map((task) =>
        task.id === activeCard.id ? { ...task, coverImage: image } : task,
      ),
    }));
  };
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    const saved = localStorage.getItem("priorities");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Handle old string data
      if (typeof parsed[0] === "string") {
        setPriorities(
          parsed.map((p: string) => ({ title: p, color: "#3b82f6" })),
        );
      } else {
        setPriorities(parsed);
      }
    } else {
      setPriorities([
        { title: "High Priority", color: "#f87171" },
        { title: "Medium Priority", color: "#facc15" },
        { title: "Low Priority", color: "#4ade80" },
      ]);
    }
  }, []);
  useEffect(() => {
    if (priorities.length > 0) {
      localStorage.setItem("priorities", JSON.stringify(priorities));
    }
  }, [priorities]);

  useEffect(() => {
    if (activeCard) {
      localStorage.setItem(
        `members-${activeCard.id}`,
        JSON.stringify(cardMembers),
      );
    }
  }, [cardMembers, activeCard]);

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
                      index,
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

                  <div className="flex gap-2 mt-2"></div>
                </>
              ) : (
                <>
                  <div
                    className="text-sm text-gray-800 mt-1 break-words"
                    onClick={() => {
                      const selected = {
                        id: task.id,
                        text: task.text,
                        description: task.description,
                        attachment: task.attachment || [],
                        priority: task.priority || [],
                        checklist: task.checklist || [],
                        members: task.members || [],
                        index,
                        completed: task.completed,
                        colId: id,
                        coverColor: task.coverColor ?? null,
                        coverImage: task.coverImage ?? null,
                      };
                      setSelectedTask(selected);
                      // router.replace(`taskId?${task.id}`);
                      router.replace(`?taskId=${task.id}`);
                    }}
                  >
                    {/* {task.attachment &&
                      task.attachment.length > 0 &&
                      task.attachment[0]?.src && ( */}
                    {(task.coverColor || task.coverImage) && (
                      <div className="w-full h-25 relative ">
                        {/* <Image
                            src={task.attachment[0].src}
                            alt="cover"
                            fill
                            className=" object-cover rounded-t-lg"
                          /> */}
                        {/* {!task.coverColor && (task.attachment?.length ?? 0) > 0 && (
      <Image
        src={task.attachment![0].src}
        alt="cover"
        fill
        className="object-cover rounded-t-lg"
      />
    )} */}
                        {!task.coverColor && task.coverImage && (
                          <Image
                            src={task.coverImage}
                            alt="cover"
                            fill
                            className="object-cover rounded-t-lg"
                          />
                        )}
                        {task.coverColor && (
                          <div
                            className="absolute inset-0 rounded-t-lg"
                            style={{
                              backgroundColor: task.coverColor,
                              opacity: 1,
                            }}
                          />
                        )}

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
                                index,
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

                    <div className=" flex gap-5  items-center ml-2">
                      <div className="  relative w-3.5 h-3.5 ml-2">
                        <Image src="/images/attach.svg" alt="attach" fill />
                        {task.attachment && task.attachment.length > 0 && (
                          <span className="text-[15px] font-medium text-gray-600 absolute -top-1 left-5 px-1 ">
                            {task.attachment.length}
                          </span>
                        )}
                      </div>
                      <div className="">
                        {task.members && task.members.length > 0 && (
                          <div className="flex  gap-5 px-3 mt-2 ml-20">
                            {task.members.map((m) => (
                              <div
                                key={m.id}
                                className="w-6 h-6 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold"
                              >
                                {m.name
                                  .split(" ")
                                  .map((w) => w[0])
                                  .slice(0, 2)
                                  .join("")
                                  .toUpperCase()}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* <div className="">
                  {task.members}
                    </div> */}

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
            <div className=" inset-0 z-50  relative  ">
              <div onClick={(e) => e.stopPropagation()}>
                <EditModal
                  taskId={activeCard.id}
                  onClose={() => {
                    setActiveCard(null);
                    setActiveCardId(null);
                  }}
                  onOpenCard={() => {
                    const task = tasks.find((t) => t.id === activeCard.id);
                    if (task) handleOpenCard(task, id);
                  }}
                  onEditLabels={() => {
                    const task = tasks.find((t) => t.id === activeCard?.id);

                    if (task) {
                      setPriority(task.priority || []);
                    }

                    setPriorityDropdownOpen(true);
                  }}
                  onChangeMembers={() => {
                    if (!activeCard) return;

                    const saved = localStorage.getItem(
                      `members-${activeCard.id}`,
                    );

                    setCardMembers(saved ? JSON.parse(saved) : []);

                    setOpenMemberModal(true);
                  }}
                  onChangeCover={() => {
                    setShowChangeCoverPopup(true);
                  }}
                  onMoveCard={() => {
                    setMoveCardPopup(true);
                  }}
                  position={{
                    top: activeCard.top,
                    left: activeCard.left,
                  }}
                />

                {priorityDropdownOpen && (
                  <Labels
                    onClose={() => setPriorityDropdownOpen(false)}
                    selected={priority}
                    setSelected={(value) => {
                      const newValue =
                        typeof value === "function" ? value(priority) : value;

                      handlePriorityChange(newValue);
                    }}
                    labels={priorities}
                    setLabels={setPriorities}
                  />
                )}

                {openMemberModal && activeCard && (
                  <div className="fixed inset-0 z-80 left-90 top-[-190] flex items-center justify-center">
                    <MemberModal
                      members={members}
                      cardMembers={cardMembers}
                      setCardMembers={setCardMembers}
                      onClose={() => setOpenMemberModal(false)}
                    />
                  </div>
                )}
                {showChangeCoverPopup && activeCard && (
                  <ChangeCoverPoup
                    onClose={() => setShowChangeCoverPopup(false)}
                    // attachments={selectedTask?.attachment || []}
                    attachments={
                      tasks.find((t) => t.id === activeCard.id)?.attachment ||
                      []
                    }
                    setAttachments={handleSetAttachments}
                    onRemoveCover={() => {
                      handleSetAttachments([]);
                      handleSetCoverColor(null);
                      handleSetCoverImage(null);
                    }}
                    onCoverColor={handleSetCoverColor}
                    coverColor={selectedTask?.coverColor || null}
                    onCoverImage={handleSetCoverImage}
                    coverImage={selectedTask?.coverImage || null}
                  />
                )}
                {moveCardPopup && activeCard && (
                  <MoveCardPopup
                    //onClose={() => setMoveCardPopup(false)}
                    onClose={() => {
  setMoveCardPopup(false);
  setActiveCard(null);
  setActiveCardId(null);
}}
                   
                    columnOrder={columnOrder}
                    board={board}
                    selectedTask={selectedTask}
                    moveTask={moveTask}
                  />
                )}
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
