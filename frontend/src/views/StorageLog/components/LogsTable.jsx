import * as React from "react";
import TableHeader from "../../../shared/components/TableComponents/TableHeader.jsx";
import LogsTableRow from "./LogsTableRow.jsx";
import LogsTableRowForMissingInvoices from "./LogsTableRowForMissingInvoices.jsx";
import { useTranslation } from "react-i18next";

function LogsTable({ invoices, reloadInvoices }) {
  const { t } = useTranslation();

  return (
    <table className="w-full text-md text-gray-300 tracking-wide ">
      <thead className="text-mg bg-gray-300 dark:bg-gray-700 text-slate-800 dark:text-gray-400">
        <tr>
          <TableHeader columnName={t("invoice.id")} />
          <TableHeader columnName={t("status")} />
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
