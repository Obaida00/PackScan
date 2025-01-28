import * as React from "react";
import TableHeader from "../TableHeader.jsx";
import TableRow from "./StorageTableRow.jsx";
import TableEmptyRow from "../TableEmptyRow.jsx";

function StorageTable({ data }) {
  return (
    <table className="w-full text-md text-gray-300 tracking-wide ">
      <thead className="text-mg bg-gray-700 text-gray-400">
        <tr>
          <TableHeader columnName="Package ID" />
          <TableHeader columnName="Status" />
          <TableHeader columnName="" />
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((obj, key) => <TableRow key={key} i={key} invoice={obj} />)
        ) : (
          <TableEmptyRow />
        )}
      </tbody>
    </table>
  );
}
export default StorageTable;
