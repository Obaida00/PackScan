import React from "react";
import StatusBadge from "../../../shared/components/StatusBadge.jsx";
import TableDataCell from "../../../shared/components/TableComponents/TableDataCell.jsx";
import InvoiceDetailsModal from "../../../shared/components/InvoiceDetailsModal.jsx";
import ImportantInvoiceModal from "./ImportantInvoiceModal.jsx";

function IndexTableRow({ i, invoice, reloadInvoices }) {
  return (
    <tr className="border-b dark:bg-gray-800 bg-gray-200 dark:border-gray-700 hover:bg-gray-600 border-gray-300 transition ease-in-out text-center">
      <TableDataCell key={i} data={invoice.invoice_id} />

      <td>
        <StatusBadge badgeName={invoice.status} />
      </td>
      <td className="px-6 py-4 flex justify-end items-center">
        {!!invoice.is_important && (
          <div>
            <ImportantInvoiceModal
              key={i}
              invoice={invoice}
              callback={reloadInvoices}
            ></ImportantInvoiceModal>
          </div>
        )}
        <div>
          <InvoiceDetailsModal key={i} invoice={invoice} />
        </div>
      </td>
    </tr>
  );
}

export default IndexTableRow;
