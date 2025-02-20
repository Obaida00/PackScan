import React from "react";
import TableDataCell from "../../../shared/components/TableComponents/TableDataCell.jsx";
import "../../../shared/styles/Ribbon.css";

function LogsTableRowForMissingInvoices({ id }) {
  return (
    <tr className="relative border-b bg-gray-800 border-gray-700 hover:bg-gray-600 
    transition ease-in-out text-center ribbon-row">
        <TableDataCell data={id} />
      <td colSpan="2" className="ribbon-wrapper">
        {/* Ribbon */}
        <div className="ribbon">Missing Invoice</div>
      </td>
    </tr>
  );
}

export default LogsTableRowForMissingInvoices;
