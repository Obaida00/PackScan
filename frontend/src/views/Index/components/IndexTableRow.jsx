import React from "react";
import StatusBadge from "../../../shared/components/StatusBadge.jsx";
import TableDataCell from "../../../shared/components/TableComponents/TableDataCell.jsx";
import InvoiceDetailsModal from "../../../shared/components/InvoiceDetailsModal.jsx";
import ImportantInvoiceModal from "./ImportantInvoiceModal.jsx";

function IndexTableRow({ invoice, reloadInvoices }) {
  return (
    <tr className="border-b bg-gray-200 border-gray-300 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition ease-in-out text-center">
      <TableDataCell
        key={invoice.invoice_id}
        data={`${invoice.invoice_id}-${invoice.storage_code.toUpperCase()}`}
      />

      <TableDataCell key={invoice.pharmacist} data={invoice.pharmacist} />

      <td>
        <StatusBadge badgeName={invoice.status} />
      </td>
      <td className="px-6 py-4 flex justify-end items-center">
        {!!invoice.is_important && (
          <ImportantInvoiceModal
            key={invoice.invoice_id}
            invoice={invoice}
            callback={reloadInvoices}
          ></ImportantInvoiceModal>
        )}

        <div className="h-full flex items-center">
          <InvoiceDetailsModal key={invoice.invoice_id} invoice={invoice} />
        </div>
      </td>
    </tr>
  );
}

export default IndexTableRow;
