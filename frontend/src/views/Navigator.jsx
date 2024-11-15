import * as React from "react";
import MenuItem from "../components/MenuItem.jsx";

function Navigator() {
  return (
    <>
      <div className="flex justify-center align-middle pe-[20vw] pb-[20vh] w-screen h-screen">
        <div className="flex place-items-center">
          <div>
            <MenuItem url="monitor" item="Invoice Manager" />
            <MenuItem url="storage" item="Packaging Manager" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Navigator;
