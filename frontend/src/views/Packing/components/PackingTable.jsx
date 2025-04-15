import * as React from "react";
import TableHeader from "../../../shared/components/TableComponents/TableHeader.jsx";
import PackingTableRow from "./PackingTableRow.jsx";
import TableEmptyRow from "../../../shared/components/TableComponents/TableEmptyRow.jsx";
import { useTranslation } from "react-i18next";

function PackingTable({ items, decrementFunc }) {
  const { t } = useTranslation();
  return (
    <table className="table-fixed w-full text-md tracking-wide ">
      <thead className="border-b bg-gray-300 border-gray-300 text-slate-800 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-300 transition ease-in-out text-center">
        <tr>
          <TableHeader columnName={t("invoice.item.name")} width={45} />
          <TableHeader columnName={t("invoice.item.count")} />
          <TableHeader columnName="" width={8} />
        </tr>
      </thead>
      <tbody>
        {items.length > 0 ? (
          items.map((item, key) => (
            <PackingTableRow
              key={key}
              i={key}
              item={item}
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
