import React from "react";
import StatusBadge from "../../../shared/components/StatusBadge.jsx";
import TableDataCell from "../../../shared/components/TableComponents/TableDataCell.jsx";
import StorageInvoiceModal from "./StorageInvoiceModal.jsx";

function StorageTableRow({ i, invoice }) {
  return (
    <tr className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600 transition ease-in-out text-center">
      <TableDataCell key={i} data={invoice.invoice_id} />

      <td>
        <StatusBadge badgeName={invoice.status} />
      </td>
      <td>
        <StorageInvoiceModal key={i} invoice={invoice} />
      </td>
    </tr>
  );
}

export default StorageTableRow;
