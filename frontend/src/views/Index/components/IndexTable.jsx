import * as React from "react";
import TableHeader from "../../../shared/components/TableComponents/TableHeader.jsx";
import IndexTableRow from "./IndexTableRow.jsx";
import IndexTableRowForMissingInvoices from "./IndexTableRowForMissingInvoices.jsx";

function IndexTable({ invoices, reloadInvoices }) {
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
            <IndexTableRowForMissingInvoices key={key} id={invoice.invoice_id} />
          ) : (
            <IndexTableRow key={key} i={key} invoice={invoice} reloadInvoices={reloadInvoices}/>
          )
        )}
      </tbody>
    </table>
  );
}

export default IndexTable;
