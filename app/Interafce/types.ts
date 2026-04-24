// Trello Board Interface

export interface Task {
  id: string;
  text: string;
  description: string;
  attachment?: Attachment[];
  completed: boolean;
  priority?: string[];
  checklist?: Checklist[];
  members?: Member[];
  coverColor?: string|null;
  coverImage?: string|null;
}

export interface BoardData {
  [key: string]: Task[];
}

export interface Column {
  id: string;
  title: string;
}

export interface Attachment {
  src: string;
  name: string;
  date: string;
}
// Card Interface

export interface CardProps {
  id: string;
  title: string;
  tasks: Task[];
  members: Member[];
  setBoard: React.Dispatch<React.SetStateAction<BoardData>>;
  dragItem: { fromCol: string; index: number } | null;
    columnOrder: { id: string; title: string }[];
  board: any;

  setDragItem: React.Dispatch<
    React.SetStateAction<{ fromCol: string; index: number } | null>
  >;
  moveTask: (
    from: string,
    to: string,
    index: number,
    targetIndex?: number,
  ) => void;

  setColumnOrder: React.Dispatch<React.SetStateAction<Column[]>>;
  setSelectedTask: React.Dispatch<
    React.SetStateAction<{
      id: string;
      text: string;
      description: string;
      attachment?: Attachment[];
      priority?: string[];
      checklist?: Checklist[];
      members?: Member[];
      completed: boolean;
      index: number;
      colId: string;
      coverColor?: string | null,
      coverImage?: string |  null,
    } | null>
  >;
}

export interface DeleteModalProps {
  title?: string;
  description?: string;
  onClose: () => void;
  onConfirm: () => void;
}

//Popup Interface

export interface PopupProps {
  task: Task;
  onClose: () => void;
  members: Member[];
  onUpdate: (
    newText: string,
    newDescription: string,
    newAttachment: Attachment[],

    priority?: string[],
    checklist?: Checklist[],
    newMembers?: Member[],
    coverColor?: string|null,
    coverImage?: string|null,


  ) => void;
}

export interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: number;
  title: string;
  items: ChecklistItem[];
}

// Checklist Props
export interface ChecklistPopupProps {
  onClose: () => void;
  onAddChecklist: (title: string) => void;
}

//DropDown Props

export interface PriorityDropDownProps {
  priority: string[];

  setPriority: React.Dispatch<React.SetStateAction<string[]>>;

  priorities: Label[];
  setPriorities: React.Dispatch<React.SetStateAction<Label[]>>;

  labels: Label[];
  setLabels: React.Dispatch<React.SetStateAction<Label[]>>;
  onClose?: () => void;
}

export type Label = {
  title: string;
  color: string;
};

// LabelDropDown Props

export interface LabelDropDownProps {
  onClose: () => void;
  onSave: (label: Label) => void;
  onDelete?: () => void;
  initialData: Label | null;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface NavbarProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}

export interface ImagePopupProps {
  src: string;
  addedAt: string;
  name: string;
  onClose: () => void;
  onDelete: () => void;
}
export interface AddMemberPopupProps {
  onClose: () => void;
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
}

export interface MemberModalProps {
  cardMembers: Member[];
  setCardMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  members: Member[];
  onClose: () => void;
}
