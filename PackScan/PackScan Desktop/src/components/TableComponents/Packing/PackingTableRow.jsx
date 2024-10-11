import React, { useEffect, useState } from "react";
import TableDataCell from "../TableDataCell";

function PackingTableRow({ itemObj }) {
  //make this a progress bar
  return (
    <tr className=" border-b bg-gray-800 border-gray-700 hover:bg-gray-600 transition ease-in-out text-center">
      <TableDataCell data={itemObj.name} />
      <TableDataCell data={""} />
      <TableDataCell data={`${itemObj.count} / ${itemObj.total}`} />
    </tr>
  );
}

export default PackingTableRow;
