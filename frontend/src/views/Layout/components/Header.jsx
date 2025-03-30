import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "/src/assets/images/Logo.svg";
import { useTranslation } from "react-i18next";

function Header() {
  const logoPath = Logo;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <nav className="max-h-[10vh] bg-slate-500 dark:bg-gray-800">
      <div className="max-w-screen-xl flex justify-between mx-auto p-[2vh]">
        <div
          className="flex space-x-2 cursor-pointer"
          onClick={handleLogoClick}
        >
          <img className="h-[6vh]" alt="logo" src={logoPath}></img>
          <p className="self-center text-2xl whitespace-nowrap font-cocon text-white">
            PackScan
          </p>
        </div>
        <div className="flex items-center">
          <button
            onClick={handleSettingsClick}
            className="text-white hover:text-gray-300 focus:outline-none"
            title={t("navigation.settings")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              className="fill-slate-900 dark:fill-white"
            >
              <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Header;
