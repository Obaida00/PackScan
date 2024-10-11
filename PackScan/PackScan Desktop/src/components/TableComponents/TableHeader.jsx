import React from "react";

function TableHeader({columnName}) {
  return (
    <th scope="col" className="px-6 py-3">
      {columnName}
    </th>
  );
}

export default TableHeader;
