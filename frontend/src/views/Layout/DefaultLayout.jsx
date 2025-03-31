import * as React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header.jsx";
import "./styles/App.css";

function DefaultLayout() {
  return (
    <>
      <Header />
      <div className="min-h-[90vh] dark:bg-slate-700 bg-slate-100">
        <Outlet />
      </div>
    </>
  );
}

export default DefaultLayout;
