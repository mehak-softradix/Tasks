import React from "react";

import { Member } from "../Interafce/types";

const ProfileModal = ({
  member,
  onClose,
  onRemove,
}: {
  member: Member;
  onClose: () => void;
  onRemove: (memberId: number) => void;
}) => {
  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-72 bg-[#2c2c2c] text-white rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="relative bg-blue-400 px-3 py-3 flex items-center">
        <div className="w-18 h-18 bg-purple-400 rounded-full flex items-center justify-center font-bold text-3xl absolute top-6 left-2">
          {initials}
        </div>

        {/* Name + Email */}
        <div className="ml-20  ">
          <p className="font-semibold pt-5 ">{member.name}</p>
          <p className="text-xs text-gray-200">@{member.email}</p>
        </div>

        <button
          className="absolute top-2 right-2 text-black hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <div className="border-t border-gray-600"></div>

      {/* Options */}
      <div className="flex flex-col text-sm">
        <button className="text-left px-4 py-3 mt-5 hover:bg-gray-700">
          Edit profile info
        </button>
        <button
          className="text-left px-4 py-3 hover:bg-gray-700"
          onClick={() => {
            onRemove(member.id);
            onClose();
          }}
        >
          Remove from card
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
