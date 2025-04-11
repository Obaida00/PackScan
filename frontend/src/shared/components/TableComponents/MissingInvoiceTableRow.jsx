import React from "react";
import TableDataCell from "../../components/TableComponents/TableDataCell.jsx";
import "../../styles/Ribbon.css";
import { useTranslation } from "react-i18next";

function MissingInvoiceTableRow({ data }) {
  const { t } = useTranslation();

  return (
    <tr
      className="ribbon-column"
    >
      <TableDataCell data={data} />
      <td colSpan="3">
        <div className="ribbon">{t("invoice.missing")}</div>
      </td>
    </tr>
  );
}

export default MissingInvoiceTableRow;
