import * as React from "react";

function ArrowIcon({ height, groupName, reversed = false }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      viewBox="0 -960 960 960"
      className={`fill-slate-500 group-hover/${groupName}:fill-slate-200 ${
        reversed ? "rotate-180 rtl:rotate-0" : "rtl:rotate-180"
      }`}
    >
      <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
    </svg>
  );
}

export default ArrowIcon;
