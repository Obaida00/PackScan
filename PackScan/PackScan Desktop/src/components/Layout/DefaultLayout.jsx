import { Outlet } from "react-router-dom";
import Header from "/src/components/Header";
import "/src/App.css";

function DefaultLayout() {
  return (
    <>
      <Header />
      <div className="min-h-[90vh] bg-slate-600">
        <Outlet />
      </div>
    </>
  );
}

export default DefaultLayout;
