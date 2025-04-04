import React from "react";
import StatusBadge from "../../../shared/components/StatusBadge.jsx";
import TableDataCell from "../../../shared/components/TableComponents/TableDataCell.jsx";
import InvoiceDetailsModal from "../../../shared/components/InvoiceDetailsModal.jsx";
import ManualSubmitModal from "./ManualSubmitModal.jsx";

function LogsTableRow({ i, invoice, reloadInvoices }) {
  return (
    <tr className="border-b bg-gray-200 border-gray-300 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition ease-in-out text-center">
      <TableDataCell key={i} data={invoice.invoice_id} />

      <td>
        <StatusBadge badgeName={invoice.status} />
      </td>
      <td className="px-6 py-4 text-right">
        {invoice.status === "Pending" && (
          <ManualSubmitModal
            invoiceId={invoice?.invoice_id}
            afterSubmit={reloadInvoices}
          />
        )}
        <InvoiceDetailsModal key={i} invoice={invoice} />
      </td>
    </tr>
  );
}

export default LogsTableRow;
