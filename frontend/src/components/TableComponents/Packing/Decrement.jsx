import * as React from "react";

function Decrement({ data, action }) {
  return (
    <div className="w-full flex justify-center">
      <button
        className="w-[24px] rounded-full bg-red-500 hover:bg-red-700 opacity-0 group-hover:opacity-70 font-serif font-black transition-all duration-200"
        onClick={() => action(data.barcode)}
      >
        -
      </button>
    </div>
  );
}

export default Decrement;
