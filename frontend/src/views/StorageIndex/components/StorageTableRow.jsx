import React from "react";
import StatusBadge from "../../../shared/components/StatusBadge.jsx";
import TableDataCell from "../../../shared/components/TableComponents/TableDataCell.jsx";
import StorageInvoiceModal from "./StorageInvoiceModal.jsx";

function StorageTableRow({ invoice, modalIcon, packerValidator }) {
  return (
    <tr className="border-b bg-gray-200 border-gray-300 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition ease-in-out text-center">
      <TableDataCell key={invoice.invoice_id} data={invoice.invoice_id} />
      <TableDataCell key={invoice.pharmacist} data={invoice.pharmacist} />
      <td>
        <StatusBadge badgeName={invoice.status} />
      </td>
      <td>
        <StorageInvoiceModal invoice={invoice} modalIcon={modalIcon} validator={packerValidator} />
      </td>
    </tr>
  );
}

export default StorageTableRow;
