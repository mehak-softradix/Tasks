"use client";

import React, { useState } from "react";

import { Member } from "../Interafce/types";
import { AddMemberPopupProps } from "../Interafce/types";

const AddMemberPopup = ({onClose} : AddMemberPopupProps) => {
  const [members, setMembers] = useState<Member[]>([
    { name: "Effie", role: "Admin" },
  ]);

  const [email, setEmail] = useState("");

  const handleAddMember = () => {
    if (!email) return;

    setMembers([
      ...members,
      { name: email.split("@")[0], role: "Member" },
    ]);

    setEmail("");
  };

  return (
    <div className="absolute top-5 right-4 z-50">
      <div className="bg-[#302f2f] w-[320px] rounded-md shadow-lg p-4 text-white">
        
        
        <div className="flex items-center relative mb-4">
        <h1 className="text-sm font-semibold text-gray-300 text-center w-full mb-3">
          Share board
        </h1>
          <button
            className="absolute right-0 text-gray-400 hover:text-white"
           onClick={onClose}
          >
            ✕
          </button>
</div>
      
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-[#1f1f1f] text-sm outline-none"
          />
          <button
            onClick={handleAddMember}
            className="bg-blue-400 px-3 py-2 rounded text-sm"
          >
            Add
          </button>
        </div>

        {/* Create Link */}
        
        {/* Members List */}
        <div className="space-y-2">
          {members.map((member, index) => (
            <div
              key={index}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
          
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold">
                  {member.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-sm">{member.name}</p>
                  <p className="text-xs text-gray-400">
                    Workspace member
                  </p>
                </div>
              </div>

              {/* Role Dropdown */}
              <select
                value={member.role}
                onChange={(e) => {
                  const updated = [...members];
                  updated[index].role = e.target.value;
                  setMembers(updated);
                }}
                className="bg-[#1f1f1f] text-xs px-2 py-1 rounded outline-none"
              >
                <option>Admin</option>
                <option>Member</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddMemberPopup;