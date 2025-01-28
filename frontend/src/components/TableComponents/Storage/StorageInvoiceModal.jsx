import * as React from "react";
import "/src/assets/css/modal.css";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useEffect } from "react";

function StorageInvoiceModal({ invoice }) {
  const [open, setOpen] = useState(false);
  const [packerName, setPackerName] = useState("");
  const [packerFieldError, setPackerFieldError] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    setPackerById("");
    setPackerFieldError(false);
  }, [open]);

  const setPackerById = async (id) => {
    if (
      id === null ||
      id === undefined ||
      id.toString().trim() === "" ||
      !/^-?\d{4,}$/.test(id)
    ) {
      setPackerName("");
      return;
    }

    let packer = await ipcRenderer.invoke("fetch-packer", id);
    if (packer.length == 0) {
      setPackerName("");
      return;
    }
    setPackerName(packer.name);
    setPackerFieldError(false);
  };

  const submitForm = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const id = formJson.id;
    setPackerById(id);

    if (packerName != "") {
      handleClose();
      nav(`/storage/almousoaa/${invoice.id}`, {
        state: { packerId: id },
      });
    } else {
      setPackerFieldError(true);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setPackerById(0);
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
          className=""
        >
          <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
        </svg>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: submitForm,
        }}
        className="text-center"
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
        <DialogContent
          sx={{
            paddingBottom: "0px",
          }}
        >
          <div className="p-2">
            <table className="table-auto text-start w-full">
              <tbody>
                <tr className="border-b-2 border-slate-50">
                  <td className="py-2 pr-20 font-medium text-gray-500">
                    Manager
                  </td>
                  <td className="py-2 pr-20 font-semibold text-xl text-slate-900">
                    {invoice.manager}
                  </td>
                </tr>
                <tr className="border-b-2 border-slate-50">
                  <td className="py-2 pr-20 font-medium text-gray-500">
                    Pharmacist
                  </td>
                  <td className="py-2 pr-20 font-semibold text-xl text-slate-900">
                    {invoice.pharmacist}
                  </td>
                </tr>
                <tr className="border-b-2 border-slate-50">
                  <td className="py-2 pr-20 font-medium text-gray-500">
                    Status
                  </td>
                  <td className="py-2 pr-20 font-semibold text-xl text-slate-900">
                    {invoice.status}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex min-h-24">
            <TextField
              autoFocus
              required
              error={packerFieldError}
              helperText={packerFieldError ? "This ID is not valid" : ""}
              size="small"
              margin="dense"
              id="name"
              name="id"
              label="Your Packer ID"
              variant="standard"
              onChange={(e) => setPackerById(e.target.value)}
            />
            <div className="self-center py-3 ps-14">{packerName}</div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button type="submit">start Packing</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default StorageInvoiceModal;
