import React, { useState } from "react";
import DeleteModal from "./DeleteModal";

interface ImagePopupProps {
  src: string;
  addedAt: string;
  name: string;
  onClose: () => void;
  onDelete: () => void;
}

const ImagePopup: React.FC<ImagePopupProps> = ({
  src,
  addedAt,
  name,
  onClose,
  onDelete,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDownload = () => {
    const byteString = atob(src.split(",")[1]);
    const mimeString = src.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = name || "download";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleOpenNewTab = () => {
    const byteString = atob(src.split(",")[1]);
    const mimeString = src.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex flex-col justify-between items-center p-10 z-10  "
      onClick={onClose}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          className="w-full h-[60vh] rounded-lg object-cover mt-15  "
          alt="attachment"
        />
      </div>

      <div className="text-white text-center mt-35">
        <p className="text-2xl font-bold">{name}</p>
        <p className="text-base font-medium text-white mt-2 ">Added {addedAt}</p>
           </div>
      <div
        className="flex justify-center gap-4 "
        onClick={(e) => e.stopPropagation()}
      >
   
        
        <div
          className="px-2 py-0.5 rounded border border-[#2a2a2a]  text-center cursor-pointer flex gap-1"
          onClick={handleOpenNewTab}
        >
          <img
            src="/images/download.svg"
            alt="checklist"
            className="w-4 h-4 inline-block mr-1 mt-1.5 filter invert "
          />
          <button className="text-sm text-white cursor-pointer font-medium">
            Open in new tab
          </button>
        </div>
        <div
          className="px-2 py-0.5 rounded border border-[#2a2a2a]  text-center cursor-pointer flex gap-1 "
          onClick={handleDownload}
        >
          <img
            src="/images/csvdownload.svg"
            alt="checklist"
            className="w-4 h-4 inline-block mr-1 mt-2  filter invert brightness-0 "
          />
          <button className="text-sm text-white cursor-pointer font-medium">
            Download
          </button>
        </div>  
        <div
          className="px-2 py-0.5 rounded border border-[#2a2a2a]  text-center cursor-pointer flex gap-1"
          onClick={onClose}
        >
          <img
            src="/images/image.svg"
            alt="checklist"
            className="w-3 h-3 inline-block mr-1 mt-2  filter invert "
          />
          <button className="text-sm text-white cursor-pointer font-medium">
            Remove Cover
          </button>
        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          className=" text-white px-3 py-1 rounded border border-[#2a2a2a] flex gap-2"
        >
          
          X 
            <span className="text-sm text-white cursor-pointer font-medium">
            Delete
          </span>
        </button>
      </div>
      {showDeleteModal && (
        <div className="z-50">
          <DeleteModal
            title="Delete Image"
            description="Are you sure you want to delete this image? this action cannot be undone"
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => {
              onDelete();
              setShowDeleteModal(false);
            }}
          />
        </div>
      )}
    </div>
  );
};


export default ImagePopup;
