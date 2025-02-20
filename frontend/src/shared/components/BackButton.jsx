import * as React from "react";

function BackButton() {
  const goBack = async () => {
    await ipcRenderer.invoke("go-back");
  };

  return (
        <button
          onClick={async () => await goBack()}
          className="text-slate-400 hover:text-slate-100 border border-slate-400 hover:bg-slate-700 font-semibold rounded-xl text-sm px-4 py-2 text-center flex items-center transition-all duration-75 group/start"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            className="fill-slate-500 group-hover/start:fill-slate-200 rotate-180"
          >
            <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
          </svg>
          &nbsp;
          <p>Back</p>
        </button>
  );
}

export default BackButton;
