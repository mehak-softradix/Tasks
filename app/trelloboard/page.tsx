  "use client";

  import React, { useEffect, useState } from "react";
  import Cards from "../Components/Cards";
  import Sidebar from "../Components/Sidebar";
  import { BoardData, Column , Attachment, Checklist } from "../Interafce/types";
  import Popup from "../Components/Popup";
import Navbar from "../Components/Navbar";

  function TrelloPage() {
    const [board, setBoard] = useState<BoardData>({
      "1": [],
      "2": [],
      "3": [],
      "4": [],
    });

    const [columnOrder, setColumnOrder] = useState<Column[]>([
      { id: 1, title: "Backlog" },
      { id: 2, title: "Doing" },
      { id: 3, title: "QA" },
      { id: 4, title: "Production" },
    ]);

    const [dragItem, setDragItem] = useState<{
      fromCol: string;
      index: number;
    } | null>(null);

    const [selectedTask, setSelectedTask] = useState<{
      text: string;
      description?: string;
      attachment?: Attachment[];
      checklist?: Checklist[];
      priority?: string;
      index: number;
      colId: string;
    } | null>(null);

    const [dragColumn, setDragColumn] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const scrollRef = React.useRef<HTMLDivElement | null>(null);

    const [members, setMembers] = useState([
  { id: 1, name: "Mehak Verma" },
  { id: 2, name: "Mehakpreet Kaur" },
  { id: 3, name: "Karan Sharam" },
  { id: 4, name: "Ritika Rana" },
  { id: 5, name: "Raajev Kumar" },
]);


    useEffect(() => {
      const saveBoard = localStorage.getItem("board");
      const savedOrder = localStorage.getItem("columnOrder");

      if (saveBoard) setBoard(JSON.parse(saveBoard));

    
      if (savedOrder) setColumnOrder(JSON.parse(savedOrder));
      setLoading(false);
    }, []);

    useEffect(() => {
      localStorage.setItem("board", JSON.stringify(board));
      localStorage.setItem("columnOrder", JSON.stringify(columnOrder));
    }, [board, columnOrder]);





    // Replace your entire scroll useEffect with this:

    const isMouseDownRef = React.useRef(false);
    const startXRef = React.useRef(0);
    const startScrollLeftRef = React.useRef(0);



    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
      // if (dragColumn || dragItem) return;

      const handleMouseDown = (e: MouseEvent) => {
        if (e.button !== 0) return;

        const target = e.target as HTMLElement;

        if (target.closest('[draggable="true"]')) return;

        isMouseDownRef.current = true;
        startXRef.current = e.clientX;
        startScrollLeftRef.current = el.scrollLeft;

        e.preventDefault();
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isMouseDownRef.current) return;

        const deltaX = e.clientX - startXRef.current;
        el.scrollLeft = startScrollLeftRef.current - deltaX;
      };

      const handleMouseUp = () => {
        isMouseDownRef.current = false;
      };

      el.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        el.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, [dragItem, dragColumn]);

    const moveTask = (
      from: string,
      to: string,
      index: number,
      targetIndex?: number,
    ) => {
      setBoard((prev) => {
        const sourceList = [...prev[from]];
        const task = sourceList[index];

        sourceList.splice(index, 1);

        if (from === to) {
          const newIndex = targetIndex ?? sourceList.length;
          sourceList.splice(newIndex, 0, task);

          return { ...prev, [from]: sourceList };
        } else {
          const destList = [...prev[to]];
          const newIndex = targetIndex ?? destList.length;
          destList.splice(newIndex, 0, task);

          return {
            ...prev,
            [from]: sourceList,
            [to]: destList,
          };
        }
      });
    };

   
    const handleColumnDragStart = (colId: number) => {
      if (dragItem) return;
      isMouseDownRef.current = false;
      setDragColumn(colId);
    };

    const handleColumnDragOver = (e: React.DragEvent, targetId: number) => {
      e.preventDefault();

      if (!dragColumn || dragColumn === targetId) return;

      const oldIndex = columnOrder.findIndex((col) => col.id === dragColumn);
      const newIndex = columnOrder.findIndex((col) => col.id === targetId);

      const newOrder = [...columnOrder];
      const moved = newOrder.splice(oldIndex, 1)[0];
      newOrder.splice(newIndex, 0, moved);

      setColumnOrder(newOrder);
    };

    const handleColumnDragEnd = () => {
      setDragColumn(null);
      isMouseDownRef.current = false;
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen  bg-gradient-to-b from-[#FFDAB9] to-blue-100 ">
          <p className="text-xl text-gray-500">Loading...</p>
        </div>
      );
    }
    return (
      <>
        <div className="flex  h-screen p-5 pl-0 gap-2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <Sidebar setBoard={setBoard} setColumnOrder={setColumnOrder} />

          <div className="relative flex-1 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/background-trello.png')] bg-cover bg-center"></div>

            <div className="relative flex flex-col h-full">
             
              <Navbar members={members}  setMembers={setMembers}/>

              {/* <div ref={scrollRef} className="flex-1 overflow-auto cursor-grab active:cursor-grabbing "> */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing "
              >
                {selectedTask && (
                  <Popup
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={(
                      newText,
                      newDescription,
                      newAttachment,
                      newPriority,
                      newChecklists,
                      
                    ) => {
                      setBoard((prev) => ({
                        ...prev,
                        [selectedTask.colId]: prev[selectedTask.colId].map(
                          (task, i) =>
                            i === selectedTask.index
                              ? {
                                  ...task,
                                  text: newText,
                                  description: newDescription,
                                  attachment: newAttachment,
                                  priority: newPriority,
                                  checklist: newChecklists,
                                }
                              : task,
                        ),
                      }));
                      // setSelectedTask(null);

                        setSelectedTask((prev) =>
      prev
        ? {
            ...prev,
            text: newText,
            description: newDescription,
            attachment: newAttachment,
            priority: newPriority,
            checklist: newChecklists,
          }
        : null
    );
                    }}
                  />
                )}

                <div className="flex gap-6 px-6 py-6 items-start min-w-max">
                  {columnOrder.map((col) => (
                    <div
                      key={col.id}
                      draggable
                      onMouseDown={(e) => e.stopPropagation()}
                      onDragStart={() => handleColumnDragStart(col.id)}
                      onDragOver={(e) => handleColumnDragOver(e, col.id)}
                      onDragEnd={handleColumnDragEnd}
                      className={dragColumn === col.id ? "opacity-50" : ""}
                    >
                      <Cards
                        key={col.id}
                        id={String(col.id)}
                        title={col.title}
                        // tasks={board[col.id]}
                        tasks={board[String(col.id)] || []}
                        setBoard={setBoard}
                        dragItem={dragItem}
                        setDragItem={setDragItem}
                        moveTask={moveTask}
                        setColumnOrder={setColumnOrder}
                        setSelectedTask={setSelectedTask}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  export default TrelloPage;
