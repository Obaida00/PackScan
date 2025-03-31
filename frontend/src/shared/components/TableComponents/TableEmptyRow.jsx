import React from "react";
import TableDataCell from "./TableDataCell.jsx";
import { useTranslation } from "react-i18next";

function TableEmptyRow() {
  const { t } = useTranslation();

  return (
    <tr className=" border-b bg-gray-200 dark:bg-gray-800 border-gray-700 hover:bg-gray-600 transition ease-in-out text-center">
      <TableDataCell data={t("common.noContent")} />
      <TableDataCell data="" />
      <TableDataCell data="" />
    </tr>
  );
}

export default TableEmptyRow;
