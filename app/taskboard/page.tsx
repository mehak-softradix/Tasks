"use client";

import { useState , useEffect } from "react";


interface Task {
  text: string;
  completed: boolean;
}


const TaskPage = () => {
  const [addTask, setAddTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

useEffect(() => {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    setTasks(JSON.parse(storedTasks));
  }
}, []);

useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]);



  const handleAddTask = () => {
    if (addTask.trim() === "") return;

    setTasks([...tasks, { text: addTask, completed: false ,}]);
    setAddTask("");
  };



  const handleDeleteTask = (indexToDelete: number) => {
    const updatedTasks = tasks.filter((_, index) => index !== indexToDelete);
    setTasks(updatedTasks);

  
  };

  const handleCompleteTask = (indexToComplete: number) => {
    const updatedTasks = tasks.map((task, index) => {
      if (index === indexToComplete) {
        return {
          ...task,
          completed: !task.completed,
        };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  const handleUpdateTask = (indexToUpdate: number) => {
  if (editText.trim() === "") {
 handleDeleteTask(indexToUpdate);
 setEditText("");
 setEditIndex(null);  
    return;
  }

    const updatedTasks = tasks.map((task, index) => {
      if (index === indexToUpdate) {
        return {
          ...task,
          text: editText,
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    setEditIndex(null);
    setEditText("");
  };

  return (
    
 <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
    
    <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
      
      <div className="text-center mt-7 ">
        <h1 className="text-2xl font-bold text-white">Daily Tasks</h1>
   <div className=" mx-auto px-10 py-10  rounded-md min-h-[50vh] max-w-md">
        <div className="flex justify-center mt-10 gap-3">
          <div className="bg-white w-full p-2 rounded-md">
            <input
              type="text"
              placeholder="Add your task..."
              className="text-black w-full outline-none"
              value={addTask}
              onChange={(e) => setAddTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTask();
              }}

            />

       </div>

          <button
            onClick={handleAddTask}
            className="bg-gray-900 text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Add
          </button>
        </div>

        <div className=" mt-6 space-y-3">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white text-black p-3 rounded-md"
            >
              {editIndex === index ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)
                    
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUpdateTask(index);
                  }}
                  className="flex-1 text-left border outline-none px-2"
                  autoFocus
                />
              ) : (
                <p
                  className={`flex-1 text-left ${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.text}
                </p>
              )}

              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleCompleteTask(index)}
                className="mx-1 cursor-pointer"
              />

              <button
                onClick={() => {
                  setEditIndex(index);
                  setEditText(task.text);
                }}
              >
                <img
                  src="/images/protectededit.svg"
                  className="w-4.5 cursor-pointer mx-2"
                />
              </button>

              <button onClick={() => handleDeleteTask(index)}>
                <img
                  src="/images/sensidelete.svg"
                  className="w-4.5 cursor-pointer  "
                />
              </button>
              <div>
                {editIndex === index && (
                  <button
                    onClick={() => handleUpdateTask(index)}
                    className="bg-gray-900 text-white px-2 py-1 rounded-md cursor-pointer"
         
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          ))}
          
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default TaskPage;
