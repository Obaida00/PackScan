import * as React from "react";
import TableHeader from "../../../shared/components/TableComponents/TableHeader.jsx";
import IndexTableRow from "./IndexTableRow.jsx";
import MissingInvoiceTableRow from "../../../shared/components/TableComponents/MissingInvoiceTableRow.jsx";
import { useTranslation } from "react-i18next";

function IndexTable({ invoices, reloadInvoices }) {
  const { t } = useTranslation();

  return (
    <table className="w-full text-md text-gray-900 tracking-wide">
      <thead className="text-mg dark:bg-gray-700 dark:text-gray-300 bg-gray-300 text-gray-700">
        <tr>
          <TableHeader columnName={t("invoice.title")} />
          <TableHeader columnName={t("invoice.pharmacist")} />
          <TableHeader columnName={t("invoice.status.title")} />
          <TableHeader columnName="" />
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice, key) =>
          invoice.is_missing ? (
            <MissingInvoiceTableRow
              key={key}
              data={`${
                invoice.invoice_id
              }-${invoice.storage_code.toUpperCase()}`}
            />
          ) : (
            <IndexTableRow
              key={key}
              invoice={invoice}
              reloadInvoices={reloadInvoices}
            />
          )
        )}
      </tbody>
    </table>
  );
}

export default IndexTable;
