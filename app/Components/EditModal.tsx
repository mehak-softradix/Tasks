import Image from "next/image";
import { options } from "../static/static";


const EditModal = ({
  onClose,

  position,
}: {
  onClose: () => void;
  taskId: string;
  position?: { top: number; left: number };
}) => {
  
  return (
    <div>
      
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
          <div
      className="fixed z-50 ml-3 "
      style={{
        top: position?.top,
        left: position?.left,
      }}
    >
       
        {options.map((item, index) => (
          <div
            key={index}
            className="flex gap-2 px-3 py-1 mt-1 bg-[#3a3939] border border-[#3f3e3e] text-[15px] font-medium rounded text-white whitespace-nowrap cursor-pointer w-max"
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
