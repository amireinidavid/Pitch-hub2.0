import React from "react";

const Page = () => {
  return (
    <div className="relative bg-gray-900 text-white min-h-screen flex items-center px-6">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: "url('/path-to-your-background-image.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-75"></div>
      <div className="relative max-w-3xl text-left space-y-6 z-10">
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full mb-4">
          Explore our Fund ERP software
        </button>
        <h1 className="text-4xl lg:text-6xl font-bold mb-4 tracking-wider">
          Built to scale all private funds
        </h1>
        <p className="text-xl mb-8 tracking-wide">
          AngelList provides investors and innovators with the tools to grow.
        </p>
        <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md">
          Contact sales
        </button>
      </div>
    </div>
  );
};

export default Page;
