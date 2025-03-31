import React from "react";
import TableDataCell from "../../../shared/components/TableComponents/TableDataCell.jsx";
import "../../../shared/styles/Ribbon.css";
import { useTranslation } from "react-i18next";

function IndexTableRowForMissingInvoices({ id }) {
  const { t } = useTranslation();

  return (
    <tr
      className="relative border-b bg-gray-800 border-gray-700 hover:bg-gray-600 
    transition ease-in-out text-center ribbon-row"
    >
      <TableDataCell data={id} />
      <td colSpan="2" className="ribbon-wrapper">
        <div className="ribbon">{t("invoice.missing")}</div>
      </td>
    </tr>
  );
}

export default IndexTableRowForMissingInvoices;
