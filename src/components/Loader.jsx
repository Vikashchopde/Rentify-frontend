import React from "react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center w-full h-full py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );
};
