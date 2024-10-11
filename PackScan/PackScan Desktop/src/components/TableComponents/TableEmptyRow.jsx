import React from "react";
import TableDataCell from "./TableDataCell";

function TableEmptyRow() {
  return (
    <tr className=" border-b bg-gray-800 border-gray-700 hover:bg-gray-600 transition ease-in-out text-center">
      <TableDataCell data="No Content" />
      <TableDataCell data="" />
    </tr>
  );
}

export default TableEmptyRow;
