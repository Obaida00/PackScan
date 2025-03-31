import * as React from "react";

function TableDataCell({ data }) {
  return (
    <td
      scope="row"
      className="py-4 font-medium whitespace-nowrap dark:text-white text-slate-900"
    >
      {data}
    </td>
  );
}

export default TableDataCell;
