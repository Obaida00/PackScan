import * as React from "react";
import { Outlet } from "react-router-dom";
import Header from "/src/components/Header.jsx";
import "/src/App.css";

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
