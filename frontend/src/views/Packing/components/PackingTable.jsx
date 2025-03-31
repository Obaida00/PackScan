import * as React from "react";
import TableHeader from "../../../shared/components/TableComponents/TableHeader.jsx";
import PackingTableRow from "./PackingTableRow.jsx";
import TableEmptyRow from "../../../shared/components/TableComponents/TableEmptyRow.jsx";
import { useTranslation } from "react-i18next";

function PackingTable({ items, decrementFunc }) {
  const { t } = useTranslation();
  return (
    <table className="table-fixed w-full text-md text-gray-300 tracking-wide ">
      <thead className="text-mg bg-gray-700 text-gray-400">
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
