import React from "react";
import StatusBadge from "/src/components/StatusBadge.jsx";
import TableDataCell from "../TableDataCell.jsx";
import InvoiceDetailsModal from "../../InvoiceDetailsModal.jsx";

function LogsTableRow({ i, invoice }) {
  return (
    <tr className=" border-b bg-gray-800 border-gray-700 hover:bg-gray-600 transition ease-in-out text-center">
      <TableDataCell key={i} data={invoice.id} />

      <td>
        <StatusBadge badgeName={invoice.status} />
      </td>
      <td className="px-6 py-4 text-right">
        <InvoiceDetailsModal key={i} invoice={invoice} />
      </td>
    </tr>
  );
}

export default LogsTableRow;
