import * as React from "react";

function TableDataCell({ data }) {
  return (
    <td
      scope="row"
      className="py-4 font-medium whitespace-nowrap dark:text-gray-100 text-slate-800"
    >
      {data}
    </td>
  );
}

export default TableDataCell;
