import React from "react";
import TableDataCell from "../../../shared/components/TableComponents/TableDataCell.jsx";
import "../../../shared/styles/Ribbon.css";
import { useTranslation } from "react-i18next";

function IndexTableRowForMissingInvoices({ id, storageCode }) {
  const { t } = useTranslation();

  return (
    <tr
      className="relative border-b-2 border-t-2 bg-red-100 border-red-900 dark:bg-red-950 dark:border-red-900 hover:bg-red-200 dark:hover:bg-red-900 transition ease-in-out text-red-900 dark:text-red-100 text-center ribbon-row"
    >
      <TableDataCell data={`${id}-${storageCode.toUpperCase()}`} />
      <td colSpan="3" className="ribbon-wrapper">
        <div className="ribbon">{t("invoice.missing")}</div>
      </td>
    </tr>
  );
}

export default IndexTableRowForMissingInvoices;
