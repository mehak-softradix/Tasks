import Image from "next/image";

const options = [
  { label: "Open card", icon: "/images/image.svg" },
  { label: "Edit labels", icon: "/images/image.svg" },
  { label: "Change members", icon: "/images/user.svg" },
  { label: "Change cover", icon: "/images/image.svg" },
  { label: "Edit dates", icon: "/images/clock.svg" },
  { label: "Move", icon: "/images/right-arrow.png" },
  { label: "Copy card", icon: "/images/copy.svg" },
  { label: "Copy link", icon: "/images/link.svg" },
  { label: "Mirror", icon: "/images/image.svg" },
  { label: "Archive", icon: "/images/archive.svg" },
];

const EditModal = ({
  onClose,
  taskId,
  position,
}: {
  onClose: () => void;
  taskId: string;
  position  ?: { top: number; left: number };
}) => {
  // console.log("Editing task:", taskId);
  return (
    <div>
      
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
          <div
      className="fixed z-50 ml-3"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
        {/* <button
          className="absolute top-2 right-2 text-white hover:text-gray-300 "
          onClick={onClose}
        >
          ✕
        </button> */}
        {options.map((item, index) => (
          <div
            key={index}
            className="flex gap-2 px-2 py-1 mt-1 bg-[#3a3939] w-[170px] border border-[#3f3e3e] text-[15px] font-medium rounded text-white whitespace-nowrap cursor-pointer"
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={16}
              height={16}
              className="w-4 h-4 filter invert mt-1"
            />
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditModal;
