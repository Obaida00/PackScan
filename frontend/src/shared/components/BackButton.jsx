import * as React from "react";
import { useTranslation } from "react-i18next";
import ArrowIcon from "./ArrowIcon.jsx";

function BackButton() {
  const { t } = useTranslation();

  const goBack = async () => {
    await ipcRenderer.invoke("go-back");
  };

  return (
    <button
      onClick={async () => await goBack()}
      className="text-slate-400 hover:text-slate-100 border border-slate-400 hover:bg-slate-700 font-semibold rounded-xl text-sm px-4 py-2 text-center flex items-center transition-all duration-75 group/start"
    >
      <ArrowIcon height="20px" groupName="start"></ArrowIcon>
      &nbsp;
      <p>{t("common.back")}</p>
    </button>
  );
}

export default BackButton;
