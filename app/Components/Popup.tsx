import React, { useState, useRef, useEffect } from "react";
import {
  PopupProps,
  Attachment,
  Checklist,
  ChecklistItem,
  Label,
  Member,
} from "../Interafce/types";
import DeleteModal from "./DeleteModal";
import DropDown from "./DropDown";
import ImagePopup from "./ImagePopup";
import ChecklistPopup from "./ChecklistPopup";
import MemberModal from "./MemberModal";
import ProfileModal from "./ProfileModal";
import Image from "next/image";

const Popup = ({ task, onClose, onUpdate }: PopupProps) => {
  const [text, setText] = useState(task.text);
  const [description, setDescription] = useState(task.description);
  const [attachments, setAttachments] = useState<Attachment[]>(
    task.attachment || [],
  );
  const [editingDesc, setEditingDesc] = useState(false);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [priority, setPriority] = useState(task.priority || "Low Priority");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showChecklistPopup, setShowChecklistPopup] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [currentImage, setCurrentImage] = useState<Attachment | null>(null);

  const [checklists, setChecklists] = useState<Checklist[]>(
    task.checklist || [],
  );

  const [openChecklistMenu, setOpenChecklistMenu] = useState<number | null>(
    null,
  );
  const [showChecklistDeleteModal, setShowChecklistDeleteModal] =
    useState(false);
  const [selectedChecklistItem, setSelectedChecklistItem] = useState<{
    clIdx: number;
    itemId: number;
  } | null>(null);
  const [editingItem, setEditingItem] = useState<{
    clIdx: number;
    itemId: number;
  } | null>(null);
  const [originalChecklists, setOriginalChecklists] = useState(
    task.checklist || [],
  );
  const [showInput, setShowInput] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [comment, setComment] = useState("");
  const [priorities, setPriorities] = useState<Label[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [activity, setActivity] = useState([
    {
      user: "John Doe",
      action: "added this card to Bugs",
      time: "2 hours ago",
      initials: "JD",
    },
  ]);

  const [showMemberModal, setShowMemberModal] = useState(false);
  // const [cardMembers, setCardMembers] = useState<Member[]>([]);
  const [cardMembers, setCardMembers] = useState<Member[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`members-${task.id}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [hoveredMember, setHoveredMember] = useState<Member | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const checklistInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sync = () => {
      const saved = localStorage.getItem("priorities");
      if (saved) setPriorities(JSON.parse(saved));

      const savedLabels = localStorage.getItem("labels");
      if (savedLabels) setLabels(JSON.parse(savedLabels));
    };

    sync(); // initial load

    window.addEventListener("storage", sync); // sync across tabs

    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    localStorage.setItem(`members-${task.id}`, JSON.stringify(cardMembers));
  }, [cardMembers, task.id]);

  useEffect(() => {
    const saved = localStorage.getItem(`members-${task.id}`);
    setCardMembers(saved ? JSON.parse(saved) : []);
  }, [task.id]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  useEffect(() => {
    if (showInput && checklistInputRef.current) {
      checklistInputRef.current.focus();
    }
  }, [showInput]);

  // Read files and return src, name, date
  const readFilesAsDataUrls = (files: FileList) => {
    return Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise<Attachment>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === "string") {
                resolve({
                  src: reader.result,
                  name: file.name,
                  // date: new Date().toLocaleString(),
                  date:
                    new Date().toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }) +
                    ", " +
                    new Date().toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }),
                });
              } else reject(new Error("Failed to read file as data URL."));
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          }),
      ),
    );
  };

  const handleChecklistSave = () => {
    handleSave(); // already sends checklists
    setOriginalChecklists(checklists);
    setEditingItem(null);
  };
  const addChecklistItem = (clIdx: number) => {
    if (newItemText.trim() === "") return;

    const newItem: ChecklistItem = {
      id: Date.now(),
      text: newItemText,
      completed: false,
    };

    const updatedChecklists = checklists.map((cl, idx) => {
      if (idx !== clIdx) return cl;

      return {
        ...cl,
        items: [...cl.items, newItem],
      };
    });

    setChecklists(updatedChecklists);
    setNewItemText("");
    setShowInput(false);
  };
  // Save changes helper
  const handleSave = () => {
    onUpdate(text, description, attachments, priority, checklists);
  };
  useEffect(() => {
    setOriginalChecklists(task.checklist || []);
  }, [task]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSave();
    }, 500);
    return () => clearTimeout(timeout);
  }, [text, description, priority, attachments, checklists]);

  const addMember = (member: Member) => {
    if (!cardMembers.find((m) => m.id === member.id)) {
      setCardMembers([...cardMembers, member]);
    }
  };

  const handleRemove = (id: number) => {
    setCardMembers(cardMembers.filter((m) => m.id !== id));
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      // onClick={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white w-[1100px] mx-auto rounded-xl shadow-lg z-10 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative shrink-0">
          <button
            onClick={onClose}
            className="absolute right-2 top-2 bg-[#2a2a2a] text-white shadow rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-gray-800"
          >
            X
          </button>

          {attachments.length > 0 && (
            <img
              src={attachments[0].src}
              alt={attachments[0].name}
              className="w-full h-[15vh] mt-2 rounded-lg object-contain cursor-pointer"
              onClick={() => {
                setCurrentImage(attachments[0]);

                setShowImagePopup(true);
              }}
            />
          )}
        </div>

        {/* MAIN CONTENT */}
        <div className="flex bg-[#2a2a2a] border border-gray-700 w-full overflow-hidden">
          {/* LEFT SIDE */}
          <div className="w-[60%] p-4 overflow-y-auto">
            {/* Title */}
            <div className="flex justify-between items-start mb-4 gap-3">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter title..."
                className="w-full text-lg font-semibold text-white outline-none pb-1 mt-3 bg-[#2a2a2a] resize-none overflow-hidden"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault();
                    handleSave();
                  }
                }}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-3">
              <div className="px-4 py-0.5 border border-gray-500 rounded text-center cursor-pointer">
                <button className="text-sm text-white cursor-pointer">
                  + Add
                </button>
              </div>
              <div className="px-2 py-0.5 rounded border border-gray-500 text-center cursor-pointer">
                <Image
                  src="/images/clock.svg"
                  alt="clock"
                  width={12}
                  height={12}

                  className="w-3 h-3 inline-block mr-1 filter invert"
                />
                <button className="text-sm text-white cursor-pointer">
                  Dates
                </button>
              </div>
              <div
                className="px-2 py-0.5 rounded border border-gray-500 text-center cursor-pointer flex"
                onClick={() => setShowChecklistPopup(true)}
              >
                <Image
                  src="/images/checklist.svg"
                  alt="checklist"
                  width={16}
                  height={16}

                  className="w-4 h-4 inline-block mr-1 mt-1 filter invert"
                />
                <button className="text-sm text-white cursor-pointer">
                  Checklist
                </button>
              </div>

              <div
                className="px-2 py-0.5 rounded border border-gray-500 text-center cursor-pointer flex"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <Image
                  src="/images/attach.svg"
                  alt="attachment"
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5 inline-block mr-1 mt-1 filter invert"
                />
                <button className="text-sm text-white cursor-pointer">
                  Attachment
                </button>
              </div>
            </div>
            {showChecklistPopup && (
              <ChecklistPopup
                onClose={() => setShowChecklistPopup(false)}
                onAddChecklist={(title) => {
                  setChecklists((prev) => [
                    ...prev,
                    { id: Date.now(), title, items: [] },
                  ]);
                  setShowChecklistPopup(false);
                }}
              />
            )}

            {/* Members & Labels */}
            <div className="flex gap-4">
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-300 mb-2">
                  Members
                </p>
                <div className="flex gap-2">
                  {cardMembers.map((member) => (
                    <span
                      key={member.id}
                      className="flex justify-center items-center bg-blue-500 text-white text-xs font-bold w-7 h-7 rounded-full "
                      onClick={() => {
                        setHoveredMember(member);
                        setShowProfileModal(true);
                      }}
                    >
                      {member.name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </span>
                  ))}
                  {showProfileModal && hoveredMember && (
                    <ProfileModal
                      member={hoveredMember}
                      onClose={() => setShowProfileModal(false)}
                      onRemove={handleRemove}
                    />
                  )}
                  <span
                    className="flex justify-center items-center bg-[#504c4c] text-white text-xs font-bold w-7 h-7 rounded-full"
                    onClick={() => setShowMemberModal(true)}
                  >
                    +
                  </span>
                </div>
              </div>
              {showMemberModal && (
                <MemberModal
                  onClose={() => setShowMemberModal(false)}
                  cardMembers={cardMembers}
                  setCardMembers={setCardMembers}
                />
              )}

              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-300 mb-2">
                  Priority
                </p>
                <DropDown
                  priority={priority}
                  setPriority={setPriority}
                  priorities={priorities}
                  setPriorities={setPriorities}
                  labels={labels}
                  setLabels={setLabels}
                />
              </div>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              id="fileInput"
              className="hidden"
              multiple
              onChange={async (e) => {
                const files = e.target.files;
                if (files) {
                  const newAttachments = await readFilesAsDataUrls(files);
                  setAttachments((prev) => [...prev, ...newAttachments]);
                }
              }}
            />

            {/* Description */}
            <div className="mb-6 mt-4">
              <div className="flex items-center gap-2 text-base font-semibold text-white mb-2">
                <Image
                  src="/images/menu.svg"
                  alt="description"
                  width={16}  
                  height={16}
                  className="w-4 h-4 filter invert"
                />
                Description
              </div>

              {editingDesc ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleSave}
                  className="w-full p-3 rounded-lg border border-blue-300 bg-white text-sm text-black outline-none resize-none h-32 focus:ring-2 focus:ring-blue-300 transition"
                  placeholder="Add a description…"
                  autoFocus
                />
              ) : description ? (
                <div
                  className="text-sm text-white leading-relaxed cursor-pointer p-3 rounded-lg transition whitespace-pre-wrap"
                  onClick={() => setEditingDesc(true)}
                >
                  {description}
                </div>
              ) : (
                <div
                  className="text-sm text-gray-400 italic p-3 rounded-lg bg-white border border-dashed border-gray-300 cursor-pointer hover:bg-white/60 transition"
                  onClick={() => setEditingDesc(true)}
                >
                  Add a more detailed description…
                </div>
              )}
            </div>

            {/* Attachments */}
            <div>
              <div className="flex items-center gap-2 text-base font-semibold text-white mb-2">
                <Image
                  src="/images/attach.svg"
                  alt="attachment"
                  width={16}
                  height={16}

                  className="w-4 h-4 filter invert"
                />
                Attachments
              </div>
              <div className="flex flex-col gap-3 mt-3">
                {attachments.map((att, idx) => (
                  <div key={idx} className="flex flex-col gap-1 relative">
                    <div className="">
                    <img
                      src={att.src}
                      className="w-50 h-28 object-conatin rounded-md border border-gray-400 cursor-pointer"
                      onClick={() => {
                        setCurrentImage(att);
                        setShowImagePopup(true);
                      }}
                      alt={att.name}
                      
                    />
                    </div>
                    <div className="text-xs text-gray-300">{att.name} </div>
                    <div className="text-xs text-gray-300">{att.date} </div>

                    <div className="absolute top-1 right-1 bg-[#333333] px-2 py-1 rounded-md cursor-pointer">
                      <span
                        onClick={() =>
                          setShowMenu(showMenu === idx ? null : idx)
                        }
                      >
                        <Image
                          alt="menu"
                          src="/images/three-dots.svg"
                          width={12}
                          height={12}
                          className="w-5 h-5 filter invert"
                        />
                      </span>
                    </div>

                    {showMenu === idx && (
                      <div className="absolute right-2 top-8 bg-white shadow-md text-gray-500 rounded-md p-2 z-10">
                        <button className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 w-full cursor-pointer">
                          <Image
                            alt="edit"
                            width={16}
                            height={16}
                            src="/images/protectededit.svg"
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-black">Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedIndex(idx);
                            setShowDeleteModal(true);
                            setShowMenu(null);
                          }}
                          className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 w-full text-red-500 cursor-pointer"
                        >
                          <Image
                          alt="delete"
                          width={16}
                          height={16}
                            src="/images/sensidelete.svg"
                          
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {checklists.map((cl, clIdx) => (
                <div key={cl.id} className="mb-4">
                  <div className="flex items-center gap-2 text-base font-semibold text-white mb-2 mt-4">
                    <Image
                      src="/images/checklist.svg"
                      alt="checklist"
                      width={16}
                      height={16}

                      className="w-4 h-4 filter invert"
                    />
                    {cl.title}
                  </div>

                  {/* Checklist items */}
                  <div className="flex flex-col gap-2 ">
                    {cl.items.map((item) => (
                      <div
                        key={item.id}
                        // className={`flex items-center justify-between p-2 rounded ${
                        //   item.completed
                        //     ? "line-through text-gray-400"
                        //     : "text-white"
                        // }`}
                        className={`flex items-center justify-between p-2 rounded ${
                          item.completed &&
                          !(
                            editingItem?.itemId === item.id &&
                            editingItem?.clIdx === clIdx
                          )
                            ? "line-through text-gray-400"
                            : "text-white"
                        }`}
                      >
                        <div className="flex  items-start gap-2 w-[90%]">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => {
                              const updatedChecklists = checklists.map(
                                (cl, idx) => {
                                  if (idx !== clIdx) return cl;
                                  return {
                                    ...cl,
                                    items: cl.items.map((i) =>
                                      i.id === item.id
                                        ? { ...i, completed: !i.completed }
                                        : i,
                                    ),
                                  };
                                },
                              );
                              setChecklists(updatedChecklists);
                              // handleSave();
                            }}
                            className="mt-1"
                          />
                          {/* <span>{item.text}</span> */}
                          {editingItem?.itemId === item.id &&
                          editingItem?.clIdx === clIdx ? (
                            <div className="flex flex-col w-full ">
                              <textarea
                                // type="text"
                                value={item.text}
                                onChange={(e) => {
                                  const updatedChecklists = checklists.map(
                                    (cl, idx) => {
                                      if (idx !== clIdx) return cl;

                                      return {
                                        ...cl,
                                        items: cl.items.map((i) =>
                                          i.id === item.id
                                            ? { ...i, text: e.target.value }
                                            : i,
                                        ),
                                      };
                                    },
                                  );

                                  setChecklists(updatedChecklists);
                                }}
                                onBlur={() => setEditingItem(null)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    setEditingItem(null);
                                  }
                                }}
                                className="bg-[#1f1f1f] text-white px-2 py-1 rounded outline-none w-full focus:ring-1 focus: ring-blue-400"
                              />
                              <div className="flex gap-1 mt-2">
                                <button
                                  className="px-4 py-1 rounded-md  bg-blue-400 text-gray-900 font-medium"
                                  // onClick={() => addChecklistItem(clIdx)}
                                  onClick={handleChecklistSave}
                                >
                                  Save
                                </button>

                                <button
                                  className="px-3 py-1 rounded-md"
                                  onClick={() => {
                                    setChecklists(originalChecklists);
                                    setEditingItem(null);
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span
                              onClick={() =>
                                setEditingItem({ clIdx, itemId: item.id })
                              }
                              className="cursor-pointer "
                            >
                              {item.text}
                            </span>
                          )}
                        </div>

                        {/* Three dots menu */}
                        <div className="relative">
                          <div
                            className="bg-[#333333] px-2 py-1 rounded-md cursor-pointer"
                            onClick={() =>
                              setOpenChecklistMenu(
                                openChecklistMenu === item.id ? null : item.id,
                              )
                            }
                          >
                            <Image
                              alt="menu"
                              src="/images/three-dots.svg"
                              className="w-5 h-5 filter invert"
                            />
                          </div>

                          {openChecklistMenu === item.id && (
                            <div className="absolute right-2 top-8 bg-white shadow-md text-gray-500 rounded-md p-2 pr-5">
                              <button className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 w-full cursor-pointer">
                                <Image
                                  src="/images/protectededit.svg"
                                  alt="EDIT"
                                  className="w-4 h-4"
                                />
                                <span className="text-sm text-black">Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedChecklistItem({
                                    clIdx,
                                    itemId: item.id,
                                  });
                                  setShowChecklistDeleteModal(true);
                                  setOpenChecklistMenu(null);
                                }}
                                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 w-full text-red-500 cursor-pointer"
                              >
                                <Image
                                
                                  src="/images/sensidelete.svg"
                                  alt="delete"
                                  className="w-4 h-4"
                                />
                                <span className="text-sm">Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Add new checklist item */}
                    {showInput && (
                      <>
                        <input
                          ref={checklistInputRef}
                          type="text"
                          value={newItemText}
                          onChange={(e) => setNewItemText(e.target.value)}
                          placeholder="Add an item..."
                          className="px-2 py-1.5 rounded bg-[#1f1f1f] border border-gray-500 text-white text-sm  focus:outline-none focus:ring-1 focus:ring-blue-400"
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              newItemText.trim() !== ""
                            ) {
                              addChecklistItem(clIdx);
                            }
                          }}
                        />

                        <div className="flex gap-1 mt-2">
                          <button
                            className="px-4 py-1 rounded-md  bg-blue-400 text-gray-900 font-medium"
                            onClick={() => addChecklistItem(clIdx)}
                          >
                            Add
                          </button>

                          <button
                            className="px-3 py-1 rounded-md "
                            onClick={() => setShowInput(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}

                    {!showInput && (
                      <button
                        className="bg-[#333333] px-3 py-1 rounded-md w-30"
                        onClick={() => setShowInput(true)}
                      >
                        Add an item
                      </button>
                    )}
                  </div>
                </div>
              ))}{" "}
              {/* Image Popup */}
              {showImagePopup && currentImage && (
                <ImagePopup
                  src={currentImage.src}
                  addedAt={currentImage.date}
                  name={currentImage.name}
                  onClose={() => setShowImagePopup(false)}
                  onDelete={() => {
                    // const index = attachments.findIndex(
                    //   (att) => att.src === currentImage.src
                    // );

                    // if (index !== -1) {
                    //   const updatedAttachments = attachments.filter(
                    //     (_, i) => i !== index
                    //   );
                    //   setAttachments(updatedAttachments);
                    // }

                    setShowImagePopup(false);
                    setCurrentImage(null);
                  }}
                />
              )}
              {/* Delete Modal */}
              {showDeleteModal && (
                <DeleteModal
                  title="Delete Image"
                  description="Are you sure you want to delete this image? this action cannot be undone"
                  onClose={() => setShowDeleteModal(false)}
                  onConfirm={() => {
                    if (selectedIndex !== null) {
                      const deletedItem = attachments[selectedIndex];
                      const updatedAttachments = attachments.filter(
                        (_, i) => i !== selectedIndex,
                      );
                      if (currentImage?.src === deletedItem.src) {
                        setShowImagePopup(false);
                        setCurrentImage(null);
                      }
                      setAttachments(updatedAttachments);
                      setShowDeleteModal(false);
                    }
                  }}
                />
              )}
              {showChecklistDeleteModal && selectedChecklistItem && (
                <DeleteModal
                  title="Delete Checklist Item"
                  description="Are you sure you want to delete this item? This action cannot be undone."
                  onClose={() => setShowChecklistDeleteModal(false)}
                  onConfirm={() => {
                    const { clIdx, itemId } = selectedChecklistItem;
                    const updatedChecklists = checklists.map((cl, idx) => {
                      if (idx !== clIdx) return cl;

                      return {
                        ...cl,
                        items: cl.items.filter((i) => i.id !== itemId),
                      };
                    });

                    setChecklists(updatedChecklists);
                    setShowChecklistDeleteModal(false);
                  }}
                />
              )}
            </div>
          </div>

          <div className="border-l border-gray-500 p-5 w-[40%]">
            <div className="flex items-center justify-between mt-3 pb-1">
              <div className="flex items-center gap-2 text-lg font-semibold text-white">
                Comments and Activity
              </div>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-white hover:text-gray-800 bg-[#333333] px-2 py-1 rounded transition"
              >
                {showDetails ? "Hide details" : "Show details"}
              </button>
            </div>

            {/* Comment input */}
            <div className="gap-2 mt-3 pb-1">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 text-base bg-[#333333] rounded-lg px-3 py-2 outline-none text-white transition w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && comment.trim() !== "") {
                    const newActivity = {
                      user: "You",
                      action: comment,
                      time: "Just now",
                      initials: "JD",
                    };
                    setActivity((prev) => [newActivity, ...prev]);
                    setComment("");
                  }
                }}
                autoFocus
              />
            </div>

            {/* Activity feed */}
            <div className="flex flex-col gap-4 mt-3">
              {activity.map((a, i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-400 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                    {a.initials}
                  </div>
                  <div>
                    <p className="text-sm text-white">
                      <span className="font-semibold">{a.user}</span>{" "}
                      <span className="text-white">{a.action}</span>
                    </p>
                    <p className="text-xs text-blue-500 mt-0.5 cursor-pointer hover:underline">
                      {a.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
