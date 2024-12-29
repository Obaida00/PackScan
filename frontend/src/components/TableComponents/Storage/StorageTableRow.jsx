import React from "react";
import StatusBadge from "/src/components/StatusBadge.jsx";
import TableDataCell from "../TableDataCell.jsx";
import InvoiceModal from "./StorageInvoiceModal.jsx";

function StorageTableRow({ i, invoice, openModal }) {
  return (
    <tr className=" border-b bg-gray-800 border-gray-700 hover:bg-gray-600 transition ease-in-out text-center">
      <TableDataCell key={i} data={invoice.id} />

      <td>
        <StatusBadge badgeName={invoice.status} />
      </td>
      <td className="px-6 py-4 text-right">
        <InvoiceModal key={i} invoice={invoice} openModal={openModal}/>
      </td>
    </tr>
  );
}

export default StorageTableRow;
