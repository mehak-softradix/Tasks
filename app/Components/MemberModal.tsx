"use client";

import React, { useState } from "react";
import { MemberModalProps, Member } from "../Interafce/types";
import { getInitials } from "../static/static";

const MemberModal = ({
  onClose,
  cardMembers,
  setCardMembers,
  members: boardMembers,
  position,
}: MemberModalProps & {
  position: { top: number; left: number };
}) => {
  const [search, setSearch] = useState("");

  const filteredMembers = (boardMembers || [])
    .filter((m) => (m?.name ?? "").toLowerCase().includes(search.toLowerCase()))
    .filter((m) => !cardMembers.some((cm) => cm.id === m.id));

  const addMember = (member: Member) => {
    if (!cardMembers.find((m) => m.id === member.id)) {
      setCardMembers([...cardMembers, member]);
    }
    onClose();
  };

  const removeMember = (id: string) => {
    setCardMembers(cardMembers.filter((m) => m.id !== id));
    onClose();
  };

  return (
    // <div className="absolute top-55 right-0 left-70 w-80 bg-[#2c2c2c] text-white rounded-xl shadow-lg p-4 z-20 items-center mt-70 ml-30 h-[30vh] overflow-y-auto">
    <div
      className="fixed w-80 bg-[#2c2c2c] text-white rounded-xl shadow-lg p-4 z-50 h-[30vh] overflow-y-auto mt-15"
      style={{
        top: position?.top,
        left: position?.left,
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold">Members</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          ✕
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search members"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-3 py-2 rounded-md bg-[#1f1f1f] border border-gray-600 text-sm outline-none"
      />

      {/* Card Members */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-400 mb-2">Card members</p>

        {cardMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between bg-[#3a3a3a] px-2 py-2 rounded-md mb-1"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">
                {getInitials(member.name)}
              </div>
              <span className="text-sm">{member.name}</span>
            </div>

            <button
              onClick={() => removeMember(member.id)}
              className="text-gray-400 hover:text-gray-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Board Members */}
      <div>
        <p className="text-sm font-semibold text-gray-400 mb-2">
          Board members
        </p>

        {filteredMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => addMember(member)}
            className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[#3a3a3a] cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
              {getInitials(member.name)}
            </div>
            <span className="text-sm">{member.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberModal;
