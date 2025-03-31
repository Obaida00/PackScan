import * as React from "react";
import { Link } from "react-router-dom";
import ArrowIcon from "../components/ArrowIcon.jsx"

function MenuItem({ url, item }) {
  return (
    <Link to={url}>
      <div className="flex place-items-center gap-2 m-2 p-4 transform hover:scale-110 duration-300 transition-all group/item">
        <ArrowIcon height="50px" groupName="item" reversed={true}></ArrowIcon>
        <p className="text-3xl font-mono text-slate-100 px-2">{item}</p>
      </div>
    </Link>

  );
}

export default MenuItem;
