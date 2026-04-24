import Image from "next/image";
import React, { useEffect, useState } from "react";
import { colors } from "../static/static";

type Attachment = {
  src: string;
  name?: string;
  date?: string;
};

const ChangeCoverPoup = ({
  onClose,
  attachments,
  setAttachments,
  onRemoveCover,
  onCoverColor,
  coverColor,
  onCoverImage,
  coverImage,
}: {
  onClose: () => void;
  attachments: Attachment[];
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
  onRemoveCover: () => void;
  onCoverColor: (color: string | null) => void;
  onCoverImage: (image: string | null) => void;

  coverColor: string | null;
  coverImage: string | null;
}) => {
  const limitedColors = colors.slice(3, 13);

  // const [coverColor, setCoverColor] = useState<string | null>(null);
  const [selectedCover, setSelectedCover] = useState<string | null>(null);

  // upload handler
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const newAttachment = {
        src: reader.result as string,
        name: file.name,
        date: new Date().toISOString(),
      };

      // setAttachments((prev) => [...prev, newAttachment]);

      setAttachments((prev) => [...prev, newAttachment]);
      setSelectedCover(newAttachment.src);
      onCoverImage(newAttachment.src);
      onCoverColor(null);
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className="absolute top-0 left-60 z-50">
      <div className="bg-[#2b2b2b] w-[320px] rounded-md shadow-lg p-4 text-white relative">
        <h1 className="text-md font-semibold text-gray-300 text-center mb-3">
          Cover
        </h1>

        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>

        {/* SIZE / ATTACHMENT PREVIEW */}
        <p className="text-xs font-semibold mb-2">Size</p>
        <div className="flex gap-2 mb-3 overflow-x-auto">
          {attachments.length > 0 ? (
            attachments.map((img, i) => (
              <div
                key={i}
                className="w-30 h-16 relative rounded overflow-hidden border border-gray-600 cursor-pointer"
                style={{
                  backgroundColor: coverColor ? coverColor : "transparent",
                }}
                onClick={() => {
                
                  setSelectedCover(img.src);
                  onCoverImage(img.src);
                  onCoverColor(null);
                  // setCoverColor(null);
                }}
              >
                {/* show image ONLY if no color is selected */}
                {(selectedCover === img.src || coverImage === img.src) &&
                  !coverColor && (
                    <Image
                      src={img.src}
                      alt="cover"
                      fill
                      className="object-cover"
                    />
                  )}
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400">No attachments</p>
          )}
        </div>

        {/* REMOVE COVER */}
        <button
          className="w-full text-sm text-gray-400 bg-[#1f1f1f] py-2 rounded mb-3"
          onClick={() => {
            // setCoverColor(null);
            onRemoveCover();
            onCoverImage(null);
          }}
        >
          Remove cover
        </button>

        {/* COLORS */}
        <p className="text-xs font-semibold mb-2">Colors</p>
       
        <div className="grid grid-cols-5 gap-2 mb-3">
          {limitedColors.map((color, i) => {
            const isSelected = coverColor === color;

            return (
              <div
                key={i}
                className="w-10 h-8 rounded cursor-pointer border border-gray-500 flex items-center justify-center"
                style={{
                  backgroundColor: color,
                  outline: isSelected ? "2px solid white" : "none",
                }}
                onClick={() => {
                  if (coverColor === color) {
                    // setCoverColor(null);
                    onCoverColor(null);
                    setSelectedCover(null);
                  } else {
                    // setCoverColor(color);
                    onCoverColor(color);
                    onCoverImage(null);
                    setSelectedCover(null);
                  }
                }}
              >
                {isSelected && (
                  <Image
                    src="/images/check.svg"
                    alt="check"
                    width={20}
                    height={20}
                  />
                )}
              </div>
            );
          })}
        </div>
        <button className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] py-2 rounded text-sm">
          Enable colorblind friendly mode
        </button>

        <hr className="border-gray-600 my-2" />

        {/* ATTACHMENTS */}
        <p className="text-xs font-semibold mb-2">Attachments</p>

        <input
          type="file"
          accept="image/*"
          id="coverUpload"
          className="hidden"
          onChange={handleUpload}
        />

        <div className="flex gap-2 mb-3 overflow-x-auto">
          {attachments.length > 0 ? (
            attachments.map((img, i) => (
              <div
                key={i}
                className="w-30 h-16 relative rounded overflow-hidden border border-gray-600 cursor-pointer"
                onClick={() => {
                  setAttachments((prev) => {
                    const updated = [...prev];
                    const selected = updated.splice(i, 1)[0];
                    updated.unshift(selected);
                    return updated;
                  });

                  setSelectedCover(img.src);
                  onCoverImage(img.src);
                  onCoverColor(null);
                }}
              >
                <Image
                  src={img.src}
                  alt="cover"
                  fill
                  className="object-cover"
                />
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400">No attachments</p>
          )}
        </div>

        {/* UPLOAD */}
        <button
          onClick={() => document.getElementById("coverUpload")?.click()}
          className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] py-2 rounded text-sm"
        >
          Upload a cover image
        </button>
      </div>
    </div>
  );
};

export default ChangeCoverPoup;
