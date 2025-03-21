import * as React from "react";
import "../../shared/styles/Modal.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import PrintInvoiceButton from "../../shared/components/PrintInvoiceButton.jsx";

function InvoiceDetailsModal({ invoice }) {
  const [open, setOpen] = useState(false);

  const rows = [
    { label: "Statement", value: invoice.statement },
    { label: "Pharmacist", value: invoice.pharmacist },
    { label: "Created At", value: invoice.created_at },
    { label: "Date Of Delivery", value: invoice.date },
    { label: "Net Price", value: invoice.net_price },
    { label: "Storage", value: invoice.storage_name },
    { label: "Status", value: invoice.status },
    { label: "Packer", value: invoice.packer_name ?? "-----------" },
    {
      label: "Number Of Packages",
      value: invoice.number_of_packages ?? "-----------",
    },
    { label: "Done At", value: invoice.done_at ?? "-----------" },
    { label: "Sent At", value: invoice.sent_at ?? "-----------" },
    {
      label: "Submittion Mode",
      value: invoice.submittion_mode ?? "-----------",
    },
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        disableRipple
        className="hover:bg-transparent w-fit h-full"
        onClick={handleClickOpen}
      >
        <svg
          xmlns="http://wwz.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="gray"
        >
          <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
        </svg>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        className="text-center"
        fullWidth
      >
        <DialogTitle className="flex align-middle justify-between p-3 bg-slate-200">
          <div className="text-3xl font-mono font-semibold text-gray-800">
            -{invoice.invoice_id}-{invoice.storage_code.toUpperCase()}-
            <PrintInvoiceButton invoiceId={invoice.id} />
          </div>
          <button
            onClick={handleClose}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm inline-flex justify-center items-center transition-colors duration-300 w-[24px]"
          >
            <svg
              className="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </DialogTitle>
        <DialogContent>
          <div className="p-2">
            <table className="table-auto text-start w-full">
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="border-b-2 border-slate-50">
                    <td className="py-1 font-medium text-gray-500">
                      {row.label}
                    </td>
                    <td className="py-1 font-semibold text-xl text-slate-900">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default InvoiceDetailsModal;
