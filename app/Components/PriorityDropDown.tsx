"use client";

import { useState, useEffect } from "react";
import { DropDownProps, Label } from "../Interafce/types";
import LabelDropDown from "./LabelDropDown";
import Image from "next/image";

const PriorityDropDown = ({
  priority,
  setPriority,
  priorities,
  setPriorities,
  labels,
  setLabels,
  
}: DropDownProps) => {
  const [open, setOpen] = useState(false);
;
  const [newPriority, setNewPriority] = useState("");

  const [showLabelModal, setShowLabelModal] = useState(false);
  
  const [editingLabel, setEditingLabel] = useState<
    (Label & { index?: number; type?: "label" | "priority" }) | null
  >(null);

  // Load priorities from localStorage
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

  // Load labels
  useEffect(() => {
    const savedLabels = localStorage.getItem("labels");
    if (savedLabels) {
      setLabels(JSON.parse(savedLabels));
    }
  }, []);

  // Save priorities
  useEffect(() => {
    if (priorities.length > 0) {
      localStorage.setItem("priorities", JSON.stringify(priorities));
    }
  }, [priorities]);

  // Save labels
  useEffect(() => {
    localStorage.setItem("labels", JSON.stringify(labels));
  }, [labels]);

  // Add new priority
  const handleAddPriority = () => {
    if (!newPriority.trim()) return;
    if (priorities.some((p) => p.title === newPriority)) return;

    setPriorities((prev) => [
      ...prev,
      { title: newPriority, color: "#3b82f6" },
    ]);
    setNewPriority("");
  };

  const handleDelete = () => {
    if (!editingLabel) return;

    if (editingLabel.type === "label" && editingLabel.index !== undefined) {
      setLabels((prev) => prev.filter((_, i) => i !== editingLabel.index));
    } else if (editingLabel.type === "priority") {
      setPriorities((prev) =>
        prev.filter((p) => p.title !== editingLabel.title),
      );

      setPriority((prev) => prev.filter((p) => p !== editingLabel.title));
    }

    setShowLabelModal(false);
    setEditingLabel(null);
  };

  // const selected = priority[0];

  return (
    <div>
      
      <div
        className="flex gap-2 relative cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex gap-2">
          {priority.map((item, index) => (
            <span
              key={index}
              className="flex justify-center items-center text-white text-xs font-bold px-4 py-2 rounded-md"
              style={{
                backgroundColor:
                  priorities.find((p) => p.title === item)?.color || "#3b82f6",
              }}
            >
              {item}
            </span>
          ))}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            className="flex justify-center items-center bg-[#504c4c] text-white text-xs font-bold w-7 h-7 rounded-md"
          >
            +
          </button>
        </div>

        {open && (
          <div className="absolute top-10  bg-[#333333] shadow-md rounded-md w-50 z-10 p-2 overflow-y-auto max-h-[40vh]">
            {/* Add new priority */}
            <div className="mt-2 flex gap-1">
              <input
                value={newPriority}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setNewPriority(e.target.value)}
                placeholder="Add..."
                className="w-full px-4 py-2 text-xs rounded bg-gray-800 text-white outline-none"
                autoFocus
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddPriority();
                }}
                className="px-2 text-xs bg-gray-500 rounded text-white"
              >
                Add
              </button>
            </div>

            {/* Labels */}
            {labels.length > 0 && (
              <div className="mt-3">
                {labels.map((label, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2 mb-1"
                  >
                    <div
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-white flex-1"
                      style={{ backgroundColor: label.color }}
                    >
                      <input type="checkbox" />
                      {label.title}
                    </div>

                    <Image                
                      src="/images/edit.svg"
                      className=" filter invert cursor-pointer"
                            alt="EDIT"  
                        width={20}  
                        height={20}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingLabel({ ...label, index, type: "label" });
                        setShowLabelModal(true);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Priorities */}
            {priorities.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 py-1"
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setPriority([item.title]);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer rounded-md text-white"
                  style={{ backgroundColor: item.color }}
                >
                  <input
                    type="checkbox"
                    checked={priority.includes(item.title)}
                    onChange={() => {
                      if (priority.includes(item.title)) {
                        setPriority(priority.filter((p) => p !== item.title));
                      } else {
                        setPriority([...priority, item.title]);
                      }
                    }}
                  />
                  <span className="wrap-break-words text-left w-full">
                    {item.title}
                  </span>
                </div>

                <div className="w-5 h-5">
                  <Image
                    src="/images/edit.svg"
                    alt="EDIT"
                    width={20}
                    height={20}

                    className=" filter invert cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingLabel({ ...item, type: "priority" });
                      setShowLabelModal(true);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {showLabelModal && (
          <LabelDropDown
            onClose={() => setShowLabelModal(false)}
            onDelete={handleDelete}
            onSave={(newLabel) => {
              if (
                editingLabel?.type === "label" &&
                editingLabel.index !== undefined
              ) {
                setLabels((prev) =>
                  prev.map((label, i) =>
                    i === editingLabel.index ? newLabel : label,
                  ),
                );
              } else if (editingLabel?.type === "priority") {
                setPriorities((prev) =>
                  prev.map((p) =>
                    p.title === editingLabel.title ? newLabel : p,
                  ),
                );

                setPriority((prev) =>
                  prev.map((p) =>
                    p === editingLabel.title ? newLabel.title : p,
                  ),
                );
              } else {
                setLabels((prev) => [...prev, newLabel]);
              }

              setShowLabelModal(false);
              setEditingLabel(null);
            }}
            initialData={editingLabel}
          />
        )}
      </div>
    </div>
  );
};

export default PriorityDropDown;
