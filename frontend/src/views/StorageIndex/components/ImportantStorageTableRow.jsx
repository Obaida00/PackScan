import React from "react";
import StatusBadge from "../../../shared/components/StatusBadge.jsx";
import TableDataCell from "../../../shared/components/TableComponents/TableDataCell.jsx";
import ImportantStorageInvoiceModal from "./ImportantStorageInvoiceModal.jsx";

function ImportantStorageTableRow({ i, invoice }) {
  return (
    <tr className="border-b dark:bg-gray-800 bg-gray-200 dark:border-gray-700 hover:bg-gray-600 border-gray-300 transition ease-in-out text-center">
      <TableDataCell key={i} data={invoice.invoice_id} />
      <td>
        <StatusBadge badgeName={invoice.status} />
      </td>
      <td>
        <ImportantStorageInvoiceModal
          key={i}
          invoice={invoice}
        ></ImportantStorageInvoiceModal>
      </td>
    </tr>
  );
}

export default ImportantStorageTableRow;
