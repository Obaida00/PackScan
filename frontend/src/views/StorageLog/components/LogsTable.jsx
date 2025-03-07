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
          invoice.is_missing ? (
            <LogsTableRowForMissingInvoices key={key} id={invoice.invoice_id} />
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
