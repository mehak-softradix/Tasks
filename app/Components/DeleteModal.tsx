import React from 'react'
import { DeleteModalProps } from '../Interafce/types';

const DeleteModal = ({ onClose, onConfirm , title , description}: DeleteModalProps) => {
  return (
    <div>
      
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  <div className="bg-white w-[90%] max-w-[420px] rounded-2xl shadow-xl p-6 relative">


    <div className="absolute top-0 left-0 right-0 h-[60px] rounded-t-2xl bg-gradient-to-b from-[#FFE2E2] to-white"></div>

    <div className="relative text-center mt-4">
      <h2 className="text-xl font-semibold text-[#1E1D27]">
        {title}
      </h2>

      <p className="text-sm text-[#6B7782] mt-3">
   {description}
      </p>
    </div>

    
    <div className="flex justify-center gap-4 mt-6">
      <button onClick={onClose}
        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
      >
        Cancel
      </button>

      <button
      onClick={onConfirm}
        className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-700 transition cursor-pointer"
      >
        Delete
      </button>
    </div>

    
  </div>
</div>
    </div>
  )
}

export default DeleteModal
