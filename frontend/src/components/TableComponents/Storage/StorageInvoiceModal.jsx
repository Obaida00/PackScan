import * as React from "react";
import "/src/assets/css/modal.css";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";

function StorageInvoiceModal({ invoice }) {
  const [open, setOpen] = useState(false);
  const [packerName, setPackerName] = useState("");
  const [packerFieldError, setPackerFieldError] = useState(false);
  const nav = useNavigate();

  const rows = [
    { label: "Statement", value: invoice.statement },
    { label: "Pharmacist", value: invoice.pharmacist },
    { label: "Manager", value: invoice.manager },
    { label: "Created At", value: invoice.created_at },
    { label: "Date Of Delivery", value: invoice.date },
    { label: "Net Price", value: invoice.net_price },
  ];

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
    if (packer.length === 0) {
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

    if (packerName !== "") {
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
                    <td className="py-1 w-48 font-medium text-sm text-gray-500">
                      {row.label}
                    </td>
                    <td className="py-1 w-[300px] font-semibold text-lg text-slate-900">
                      {row.value}
                    </td>
                  </tr>
                ))}
                <tr className="border-b-2 border-slate-50">
                  <td className="py-2 w-48 font-medium text-gray-500">
                    Packer
                  </td>
                  <td className="w-64 py-2 text-xl text-slate-900">
                    <div className="flex gap-2 items-center ">
                      <div className="w-[100px]">
                        <TextField
                          autoFocus
                          required
                          error={packerFieldError}
                          size="small"
                          margin="none"
                          id="name"
                          name="id"
                          placeholder="Your ID"
                          variant="outlined"
                          onChange={(e) => setPackerById(e.target.value)}
                        />
                      </div>
                      <div
                        className={`w-[200px] overflow-hidden text-ellipsis whitespace-nowrap font-medium ${
                          packerFieldError
                            ? "text-red-700 text-xs opacity-80"
                            : "text-slate-800 text-lg"
                        }`}
                      >
                        {packerFieldError ? "ID is not valid" : packerName}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="text-slate-100 border border-slate-400 bg-green-600 hover:bg-green-700 focus:ring-2 focus:outline-none focus:ring-slate-300  font-semibold rounded-xl text-sm px-4 py-2 text-center flex items-center transition-all duration-200"
            type="submit"
          >
            <p>Start Packing</p>
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

export default StorageInvoiceModal;
