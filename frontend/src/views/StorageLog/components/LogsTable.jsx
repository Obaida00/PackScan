import * as React from "react";
import TableHeader from "../../../shared/components/TableComponents/TableHeader.jsx";
import LogsTableRow from "./LogsTableRow.jsx";
import LogsTableRowForMissingInvoices from "./LogsTableRowForMissingInvoices.jsx";

function LogsTable({ data, minId, maxId, reloadInvoices }) {
  // Create a full range of IDs for the current page
  const fullData = Array.from({ length: maxId - minId + 1 }, (_, i) => {
    const id = maxId - i;
    return data.find((obj) => obj.id === id) || { missing: id }; // Use null for missing IDs
  });

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
        {fullData.map((obj, key) =>
          obj["missing"] !== undefined ? (
            <LogsTableRowForMissingInvoices key={key} id={obj["missing"]} />
          ) : (
            <LogsTableRow key={key} i={key} invoice={obj} reloadInvoices={reloadInvoices} />
          )
        )}
      </tbody>
    </table>
  );
}

export default LogsTable;
