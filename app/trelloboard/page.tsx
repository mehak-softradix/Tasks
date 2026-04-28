"use client";

import React, { useEffect, useState ,  } from "react";

import Cards from "../Components/Cards";
import Sidebar from "../Components/Sidebar";
import { BoardData, Column, Attachment, Checklist, Member } from "../Interafce/types";
import Popup from "../Components/Popup";
import Navbar from "../Components/Navbar";
import ScreenDrag from "../Components/ScreenDrag";
import { useSearchParams } from "next/navigation";

function TrelloPage() {
  const [board, setBoard] = useState<BoardData>({
    "1": [],
    "2": [],
    "3": [],
    "4": [],
  });

  const [columnOrder, setColumnOrder] = useState<Column[]>([
    { id: "1", title: "Backlog" },
    { id: "2", title: "Doing" },
    { id: "3", title: "QA" },
    { id: "4", title: "Production" },
  ]);

  const [dragItem, setDragItem] = useState<{
    fromCol: string;
    index: number;
  } | null>(null);

  const [selectedTask, setSelectedTask] = useState<{
    id: string;
    text: string;
    description: string;
    attachment?: Attachment[];
    checklist?: Checklist[];
    priority?: string[];
    completed: boolean;
    index: number;
    colId: string;
  } | null>(null);

  // console.log("Selected Task:", selectedTask);

  const [dragColumn, setDragColumn] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

useEffect(() => {
  if (!taskId) return;

  for (const colId in board) {
    const index = board[colId].findIndex((t) => t.id === taskId);

    if (index !== -1) {
      const task = board[colId][index];

      setSelectedTask({
        ...task,
        index,
        colId,
      });
                                                                                                                                                                                                                               
      break;
    }
  }
}, [taskId, board]);

  const [members, setMembers] = useState<Member[]>(() => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("members");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }
  return [];
}); 
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

    useEffect(() => {
    localStorage.setItem("members", JSON.stringify(members));
  }, [members]);

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
        const destList = [...prev[to] || []];
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

  const handleColumnDragStart = (colId: string) => {
    if (dragItem) return;

    setDragColumn(colId);
  };

  const handleColumnDragOver = (e: React.DragEvent, targetId: string) => {
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
      <div className="fixed inset-0  bg-black/70 backdrop-blur-sm "></div>
      <div className="flex  h-screen p-2 pl-0 gap-2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Sidebar setBoard={setBoard} setColumnOrder={setColumnOrder} />

        <div className="relative flex-1 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/background-trello.png')] bg-cover bg-center"></div>

          <div className="relative flex flex-col h-full">
            <Navbar members={members} setMembers={setMembers} />

            <ScreenDrag>
              {selectedTask && (
                <Popup
                key={selectedTask.id}
                  task={selectedTask}
                  members={members}
                  onClose={() => setSelectedTask(null)}
                  onUpdate={(
                    newText,
                    newDescription,
                    newAttachment,
                    newPriority,
                    newChecklists,
                    newMembers,
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
                                members: newMembers,
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
                            members: newMembers,
                          }
                        : null,
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
                        columnOrder={columnOrder}
                      setSelectedTask={setSelectedTask}
                      members={members}
                      board={board}
                    />
                  </div>
                ))}
              </div>
            </ScreenDrag>
          </div>
        </div>
      </div>
    </>
  );
}

export default TrelloPage;
