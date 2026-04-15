import Image from "next/image";

const options = [
  { label: "Open Card", icon: "/images/image.svg" },
  { label: "Edit Labels", icon: "/images/image.svg" },
  { label: "Change Members", icon: "/images/image.svg" },
  { label: "Change Cover", icon: "/images/image.svg" },
  { label: "Edit dates", icon: "/images/clock.svg" },
  { label: "Move", icon: "/images/image.svg" },
  { label: "Copy Card", icon: "/images/image.svg" },
  { label: "Copy Link", icon: "/images/image.svg" },
  { label: "Mirror", icon: "/images/image.svg" },
  { label: "Archive", icon: "/images/image.svg" },
];

const EditModal = ({
  onClose,
  taskId,
}: {
  onClose: () => void;
  taskId: string;
}) => {
  console.log("Editing task:", taskId);
  return (
    <div>
      <div className="absolute top-[180px] right- rounded shadow-lg z-50  ">
        <button
          className="absolute top-2 right-2 text-white hover:text-gray-300 "
          onClick={onClose}
        >
          ✕
        </button>
        {options.map((item, index) => (
          <div
            key={index}
            className="flex gap-2 px-2 py-1 mt-3 bg-[#1b1b1b] w-[170px] border border-[#1b1b1b]  rounded text-white whitespace-nowrap cursor-pointer"
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={16}
              height={16}
              className="w-4 h-4 filter invert"
            />
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditModal;
