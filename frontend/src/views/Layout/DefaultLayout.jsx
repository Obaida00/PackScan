import * as React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header.jsx";
import "./styles/App.css";

function DefaultLayout() {
  return (
    <>
      <Header />
      <div className="min-h-[90vh] bg-slate-700">
        <Outlet />
      </div>
    </>
  );
}

export default DefaultLayout;
