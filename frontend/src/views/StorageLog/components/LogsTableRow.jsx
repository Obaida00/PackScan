import React from "react";
import StatusBadge from "../../../shared/components/StatusBadge.jsx";
import TableDataCell from "../../../shared/components/TableComponents/TableDataCell.jsx";
import InvoiceDetailsModal from "../../../shared/components/InvoiceDetailsModal.jsx";
import ManualSubmitModal from "./ManualSubmitModal.jsx";

function LogsTableRow({ invoice, reloadInvoices }) {
  return (
    <tr className="border-b bg-gray-200 border-gray-300 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition ease-in-out text-center">
      <TableDataCell key={invoice.invoice_id} data={invoice.invoice_id} />
      <TableDataCell key={invoice.pharmacist} data={invoice.pharmacist} />

      <td>
        <StatusBadge badgeName={invoice.status} />
      </td>
      <td className="px-6 py-4 flex justify-end items-center">
        {invoice.status === "Pending" && (
          <ManualSubmitModal
            invoiceId={invoice?.invoice_id}
            invoiceGuid={invoice?.id}
            afterSubmit={reloadInvoices}
          />
        )}
        {!!invoice.is_important && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#db5d5b"
          >
            <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm280-590q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z" />
          </svg>
        )}
        <InvoiceDetailsModal key={invoice.invoice_id} invoice={invoice} />
      </td>
    </tr>
  );
}

export default LogsTableRow;
