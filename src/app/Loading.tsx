import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center bg-black/70 items-center w-screen fixed top-0 h-screen">
      <div className="relative flex justify-center items-center">
        {/* Círculo externo */}
        <div className="animate-spin rounded-full h-24 w-24 border-8 border-gray-600 border-solid border-t-yellow-500"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
