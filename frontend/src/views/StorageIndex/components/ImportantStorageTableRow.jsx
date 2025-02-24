import React from "react";
import StatusBadge from "../../../shared/components/StatusBadge.jsx";
import TableDataCell from "../../../shared/components/TableComponents/TableDataCell.jsx";
import ImportantStorageInvoiceModal from "./ImportantStorageInvoiceModal.jsx";

function ImportantStorageTableRow({ i, invoice }) {
  return (
    <tr className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600 transition ease-in-out text-center">
      <TableDataCell key={i} data={invoice.id} />
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
