import * as React from "react";
import TableHeader from "../../../shared/components/TableComponents/TableHeader.jsx";
import TableEmptyRow from "../../../shared/components/TableComponents/TableEmptyRow.jsx";
import { useTranslation } from "react-i18next";

function StorageTable({ invoices, RowComponent }) {
  const { t } = useTranslation();

  return (
    <table className="w-full text-md text-gray-300 tracking-wide">
      <thead className="text-mg dark:bg-gray-700 bg-gray-300 dark:text-gray-300 text-gray-700">
        <tr>
          <TableHeader columnName={t("invoice.id")} />
          <TableHeader columnName={t("invoice.status.title")} />
          <TableHeader columnName="" />
        </tr>
      </thead>
      <tbody>
        {invoices.length > 0 ? (
          invoices.map((invoice, key) => (
            <RowComponent key={key} i={key} invoice={invoice} />
          ))
        ) : (
          <TableEmptyRow />
        )}
      </tbody>
    </table>
  );
}
export default StorageTable;
