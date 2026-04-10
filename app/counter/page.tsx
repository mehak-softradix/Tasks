"use client";

import { useState } from "react";

const Page = () => {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState("dark");

    const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
 <div
      className={`${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-black"
      } mx-auto p-10 h-[50vh] mt-10 cursor-pointer`}
    >
       <button
  onClick={toggleTheme}
  className={`w-14 h-7 flex items-center rounded-full p-1 transition duration-300 ${
    theme === "dark" ? "bg-gray-500" : "bg-gray-400"
  }`}
>
   <div
    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition duration-300 cursor-pointer ${
      theme === "dark" ? "translate-x-7" : "translate-x-0"
    }`}
  ></div>
</button> 
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold">Counter App</h1>

      <h2 className="text-xl mt-5">{count}</h2>

      <div className="mt-5 space-x-2">  
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-white text-black rounded-md"
        >
          Incraese
         
        </button>

        <button
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-white text-black rounded-md"
        >
          Decrease
        </button>

        <button
          onClick={() => setCount(0)}
          className="px-4 py-2 bg-white text-black rounded-md"
        >
          Reset
        </button>
      </div>
     
    </div>
    </div>
  );
};

export default Page;
