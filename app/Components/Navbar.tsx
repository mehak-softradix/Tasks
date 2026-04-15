"use client";

import React, { useState, useRef, useEffect } from "react";
import AddMemberPopup from "./AddMemberPopup";
import { NavbarProps } from "../Interafce/types";
import Image from "next/image";

const getInitial = (name: string) => {
  const words = name.split(" ");
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

const Navbar = ({ members, setMembers }: NavbarProps) => {
  const [showModal, setShowModal] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <div className="bg-black/10 backdrop-blur-md p-1 rounded-lg mb-5 relative z-10">
        <div className="flex justify-between items-center gap-3 p-2 mt-1">
          <h2 className="text-xl font-semibold text-gray-800">Trello Board</h2>

          {/* Members */}
          <div className="flex items-center relative">
            <h2 className="text-xl font-semibold text-gray-800 mr-2">
              Members
            </h2>

            {/* {members.map((member) => (
              <div
                key={member.id}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white text-sm font-semibold border-2 border-white -ml-2"
              >
                {getInitial(member.name)}
              </div>
            ))}

            <button
              className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-lg cursor-pointer ml-1"
              onClick={() => setShowModal(!showModal)}
            >
              +
            </button> */}

            <div className="flex gap-2">
              {members.map((member) => (
                <span
                  key={member.id}
                  className="flex justify-center items-center bg-blue-500 text-white text-xs font-bold w-7 h-7 rounded-full"
                >
                  {getInitial(member.name)}
                </span>
              ))}

              {/* + button */}
              <span className="flex justify-center items-center bg-[#504c4c] text-white text-xs font-bold w-7 h-7 rounded-full cursor-pointer">
                +
              </span>
            </div>

            {/* Popup */}
            {showModal && (
              <div ref={popupRef} className="absolute right-0 top-12">
                <AddMemberPopup onClose={() => setShowModal(false)} />
              </div>
            )}
          </div>

          <Image
            src="/images/three-dots.png"
            alt="menu"
            width={20}
            height={20}
            className=" cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
