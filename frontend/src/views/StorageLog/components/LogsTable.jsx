import * as React from "react";
import TableHeader from "../../../shared/components/TableComponents/TableHeader.jsx";
import LogsTableRow from "./LogsTableRow.jsx";
import LogsTableRowForMissingInvoices from "./LogsTableRowForMissingInvoices.jsx";

function LogsTable({ invoices, reloadInvoices }) {
  return (
    <table className="w-full text-md text-gray-300 tracking-wide ">
      <thead className="text-mg bg-gray-700 text-gray-400">
        <tr>
          <TableHeader columnName="Invoice ID" />
          <TableHeader columnName="Status" />
          <TableHeader columnName="" />
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice, key) =>
          false ? ( // for future missing invoices handling
            <LogsTableRowForMissingInvoices key={key} id={0} />
          ) : (
            <LogsTableRow
              key={key}
              i={key}
              invoice={invoice}
              reloadInvoices={reloadInvoices}
            />
          )
        )}
      </tbody>
    </table>
  );
}

export default LogsTable;
