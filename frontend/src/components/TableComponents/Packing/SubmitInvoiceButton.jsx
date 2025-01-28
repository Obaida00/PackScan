import * as React from "react";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

function SubmitInvoiceButton({ packerId, invoice, action, disabled }) {
  const [open, setOpen] = useState(false);

  const rows = [
    { label: "Statement", value: invoice.statement },
    { label: "Pharmacist", value: invoice.pharmacist },
    { label: "Manager", value: invoice.manager },
    { label: "Created At", value: invoice.created_at },
    { label: "Date Of Delivery", value: invoice.date },
    { label: "Net Price", value: invoice.net_price },
    { label: "Storage", value: invoice.storage_name },
    { label: "Current Packer Id", value: packerId },
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="flex justify-center py-4">
        <div className="min-h-[5vh] w-fll flex justify-end">
          <button
            onClick={handleClickOpen}
            className="disabled:bg-slate-600 disabled:text-slate-400 text-slate-100 border border-slate-400 bg-green-700 hover:bg-green-800 focus:ring-2 focus:outline-none focus:ring-slate-300 font-semibold rounded-xl text-sm px-4 py-2 text-center flex items-center transition-all duration-200"
            disabled={disabled}
          >
            <p>Submit</p>
            &nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              className="fill-slate-200"
            >
              <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
            </svg>
          </button>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        className="text-center"
        fullWidth
      >
        <DialogTitle className="flex align-middle justify-between p-3 bg-slate-200">
          <div className="text-3xl font-mono font-semibold text-gray-800">
            -{invoice.id}-
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
                    <td className="py-2 font-medium text-gray-500 ">
                      {row.label}
                    </td>
                    <td className="py-2 font-semibold text-xl text-slate-900">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="text-slate-100 border border-slate-400 bg-green-600 hover:bg-green-700 focus:ring-2 focus:outline-none focus:ring-slate-300 font-semibold rounded-xl text-sm px-4 py-2 text-center flex items-center transition-all duration-200"
            onClick={action}
          >
            <p>Submit Invoice</p>
            &nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              className="fill-slate-200"
            >
              <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
            </svg>
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SubmitInvoiceButton;
