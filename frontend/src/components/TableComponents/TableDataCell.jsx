import * as React from "react";

function TableDataCell({ data }) {
  return (
    <td
      scope="row"
      className="px-6 py-4 font-medium whitespace-nowrap text-white"
    >
      {data}
    </td>
  );
}

export default TableDataCell;
