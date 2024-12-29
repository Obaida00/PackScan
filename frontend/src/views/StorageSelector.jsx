import * as React from "react";
import MenuItem from "../components/MenuItem.jsx";
import BackButton from "../components/BackButton.jsx";

function StorageSelector() {
  return (
    <div className="h-[60vh] flex justify-center w-[80vw]">
      <div className="flex place-items-center">
        <div>
          <BackButton />
          <MenuItem url="almousoaa" item="Almousoaa" />
          <MenuItem url="advanced" item="Almousoaa Advanced" />
        </div>
      </div>
    </div>
  );
}

export default StorageSelector;
