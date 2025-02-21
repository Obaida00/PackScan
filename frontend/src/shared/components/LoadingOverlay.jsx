import React from "react";
import { useLoadingContext } from "../contexts/LoadingContext.jsx";

const LoadingOverlay = () => {
  const { progressLoading, progress } = useLoadingContext();

  if (!progressLoading) return null;

  return (
    <div className="fixed bg-[#00000090] w-full h-full z-50 flex justify-center items-center">
      <div className="pb-32">
        <div className="loader" style={{ backgroundSize: `${progress}% 3px` }}></div>
        <div className="text-slate-100 text-xl font-sans text-center">
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
