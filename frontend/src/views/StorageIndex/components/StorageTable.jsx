import * as React from "react";
import TableHeader from "../../../shared/components/TableComponents/TableHeader.jsx";
import TableEmptyRow from "../../../shared/components/TableComponents/TableEmptyRow.jsx";

function StorageTable({ data, RowComponent }) {
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
          data.map((obj, key) => (
            <RowComponent key={key} i={key} invoice={obj} />
          ))
        ) : (
          <TableEmptyRow />
        )}
      </tbody>
    </table>
  );
}
export default StorageTable;
