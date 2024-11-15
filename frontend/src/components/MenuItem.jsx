import * as React from "react";
import "/src/assets/css/navigator.css";
import { Link } from "react-router-dom";

function MenuItem({ url, item }) {
  return (
    <Link to={url}>
      <div className="menu-item group/item">
        <p className="text-3xl font-mono text-slate-100">{item}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="50px"
          viewBox="0 -960 960 960"
          fill="#94a3b8"
          className="invisible opacity-0 group-hover/item:visible group-hover/item:opacity-100 transition-opacity ease-out duration-300"
        >
          <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
        </svg>
      </div>
    </Link>

  );
}

export default MenuItem;
