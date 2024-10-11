import React from "react";

function Header({theme, themeToggle}) {

  return (
    <nav className="max-h-[10vh] bg-gray-800">
      <div className="max-w-screen-xl flex justify-between mx-auto p-[2vh]">
        <div className="flex space-x-2">
          <img className="h-[6vh]" alt="" src="/src/assets/Logo.svg"></img>
          <p className="self-center text-2xl whitespace-nowrap font-cocon text-white">
            PackScan
          </p>
        </div>
      </div>
    </nav>
  );
}

export default Header;
