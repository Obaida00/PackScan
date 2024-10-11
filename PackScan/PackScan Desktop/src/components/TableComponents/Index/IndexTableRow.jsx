import React from "react";
import StatusBadge from "/src/components/StatusBadge";
import TableDataCell from "../TableDataCell";
import InvoiceModal from "./IndexInvoiceModal";

function IndexTableRow({ i, invoice }) {
  return (
    <tr className=" border-b bg-gray-800 border-gray-700 hover:bg-gray-600 transition ease-in-out text-center">
      <TableDataCell key={i} data={invoice.id} />

      <td>
        <StatusBadge badgeName={invoice.status} />
      </td>
      <td className="px-6 py-4 text-right">
        <InvoiceModal key={i} invoice={invoice} />
      </td>
    </tr>
  );
}

export default IndexTableRow;
