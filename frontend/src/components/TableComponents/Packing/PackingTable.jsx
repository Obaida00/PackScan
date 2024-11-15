import * as React from "react";
import TableHeader from "../TableHeader.jsx";
import TableRow from "./PackingTableRow.jsx";
import TableEmptyRow from "../TableEmptyRow.jsx";

function PackingTable({ data, decrementFunc }) {
  return (
    <table className="table-fixed w-full text-md text-gray-300 tracking-wide ">
      <thead className="text-mg bg-gray-700 text-gray-400">
        <tr>
          <TableHeader columnName="Item Name" width={45} />
          <TableHeader columnName="Item Count" />
          <TableHeader columnName="" width={8} />
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((obj, key) => (
            <TableRow
              key={key}
              i={key}
              itemObj={obj}
              decrementFunc={decrementFunc}
            />
          ))
        ) : (
          <TableEmptyRow />
        )}
      </tbody>
    </table>
  );
}
export default PackingTable;
