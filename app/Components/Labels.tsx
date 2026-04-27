"use client";

import Image from "next/image";
import React, { useState } from "react";
import LabelDropDown from "./LabelDropDown";
import { Label } from "../Interafce/types";

const initialData: Label[] = [
  { title: "High Priority", color: "#ef4444" },
  { title: "Medium Priority", color: "#eab308" },
  { title: "Low Priority", color: "#22c55e" },
];

const Labels = ({
  onClose,
  selected,
  setSelected,
  labels,
  setLabels,
}: {
  onClose: () => void;
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  labels: Label[];
  setLabels: React.Dispatch<React.SetStateAction<Label[]>>;
}) => {
  const [search, setSearch] = useState("");

  const [showLabelModal, setShowLabelModal] = useState(false);

  const [editingLabel, setEditingLabel] = useState<
    (Label & { index?: number }) | null
  >(null);

  const toggleLabel = (title: string) => {
    setSelected((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };
  const filtered = labels.filter((label) =>
    label.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = () => {
    if (!editingLabel || editingLabel.index === undefined) return;

    setLabels((prev) => prev.filter((_, i) => i !== editingLabel.index));

    setShowLabelModal(false);
    setEditingLabel(null);
  };



  return (
    <div className="absolute top-[-50] left-60 z-50">
      <div className="bg-[#2b2b2b] w-[320px] rounded-md shadow-lg p-4 text-white relative">
        {/* Header */}
        <h1 className="text-md font-semibold text-gray-300 text-center mb-3">
          Labels
        </h1>
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          
          ✕
        </button>

        {/* Search */}
        <input
          type="text"
          placeholder="Search labels..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded bg-[#1f1f1f] border border-gray-600 text-sm outline-none focus:border-blue-500"
        />

        {/* Label List */}
        <div className="space-y-2 max-h-[250px] overflow-y-auto">
          {filtered.map((label, index) => (
            <div key={label.title} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(label.title)}
                onChange={() => toggleLabel(label.title)}
                className="w-4 h-4 accent-blue-500"
              />

              <div
                className="flex-1 px-3 py-2 rounded text-sm font-medium"
                style={{ backgroundColor: label.color }}
              >
                {label.title}
              </div>

              <Image
                src="/images/edit.svg"
                alt="EDIT"
                width={20}
                height={20}
                className="filter invert cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingLabel({ ...label, index });
                  setShowLabelModal(true);
                }}
              />
            </div>
          ))}
        </div>

        {/* Modal */}
        {showLabelModal && (
          <LabelDropDown
            onClose={() => setShowLabelModal(false)}
            onDelete={handleDelete}
            onSave={(newLabel) => {
              if (editingLabel?.index !== undefined) {
                // Edit
                setLabels((prev) =>
                  prev.map((l, i) =>
                    i === editingLabel.index
                      ? {
                          ...l,
                          title: newLabel.title,
                          color: newLabel.color,
                        }
                      : l,
                  ),
                );
              } else {
                // Create new
                setLabels((prev) => [
                  ...prev,
                  {
                    title: newLabel.title,
                    color: newLabel.color,
                  },
                ]);
              }

              setShowLabelModal(false);
              setEditingLabel(null);
            }}
            initialData={
              editingLabel
                ? { title: editingLabel.title, color: editingLabel.color }
                : null
            }
          />
        )}

        {/* Footer */}
        <div className="mt-4 space-y-2">
          <button
            onClick={() => {
              setEditingLabel(null);
              setShowLabelModal(true);
            }}
            className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] py-2 rounded text-sm"
          >
            Create a new label
          </button>
          <button className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] py-2 rounded text-sm">
            Show more labels
          </button>
          <hr className="border-gray-600 my-2" />
          <button className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] py-2 rounded text-sm">
            Enable colorblind friendly mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default Labels;
