import * as React from "react";
import "../../../shared/styles/Modal.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

function ImportantInvoiceModal({ invoice, callback }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitForm = async (e) => {
    await ipcRenderer.invoke("unmark-invoice-important", invoice.id);
    callback();
    handleClose();
  };

  return (
    <>
      <Button
        disableRipple
        className="hover:bg-transparent w-fit h-full"
        onClick={handleClickOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#db5d5b"
        >
          <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm280-590q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z" />
        </svg>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: submitForm,
          },
        }}
        className="text-center"
        fullWidth
      >
        <DialogTitle className="flex align-middle justify-between p-3 bg-slate-200">
          <div className="text-3xl font-mono font-semibold text-gray-800">
            -{invoice.invoice_id}-{invoice.storage_code.toUpperCase()}
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
            Do You want to remove the important flag for this invoice ?
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="text-red-200 border border-slate-400 bg-red-700 hover:bg-red-800 focus:ring-2 focus:outline-none focus:ring-slate-300  font-semibold rounded-xl text-sm px-4 py-2 text-center flex items-center transition-all duration-200"
            type="submit"
          >
            Remove
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ImportantInvoiceModal;
