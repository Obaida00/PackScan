import * as React from "react";
import "../../../shared/styles/Modal.css";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function ImportantStorageInvoiceModal({ invoice }) {
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);
  const [packerName, setPackerName] = useState("");
  const [packerFieldError, setPackerFieldError] = useState(false);
  const [packerFieldPermissionError, setPackerFieldPermissionError] =
    useState(false);
  const nav = useNavigate();

  const rows = [
    { label: "statement", value: invoice.statement },
    { label: "pharmacist", value: invoice.pharmacist },
    { label: "createdAt", value: invoice.created_at },
    { label: "dateOfDelivery", value: invoice.date },
    { label: "netPrice", value: invoice.net_price },
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
    if (!packer.id) {
      setPackerName("");
      return;
    }
    setPackerName(packer.name);
    setPackerFieldError(false);
    setPackerFieldPermissionError(!packer.can_submit_important_invoices);
  };

  const submitForm = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const id = formJson.id;
    setPackerById(id);

    ipcRenderer.invoke("fetch-packer", id).then((packer) => {
      if (packerName !== "" && packer.id) {
        if (packer.can_submit_important_invoices) {
          handleClose();
          nav(`/packing/${invoice.id}`, {
            state: { packerId: id },
          });
        }
      } else {
        setPackerFieldError(true);
      }
    });
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
        PaperProps={{
          component: "form",
          onSubmit: submitForm,
        }}
        className="text-center"
        fullWidth
      >
        <DialogTitle className="flex align-middle justify-between p-3 bg-slate-200">
          <div className="text-3xl font-mono font-semibold text-gray-800">
            -{invoice.invoice_id}-
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
                      {t("invoice." + row.label)}
                    </td>
                    <td className="py-1 w-[300px] font-semibold text-lg text-slate-900">
                      {row.value}
                    </td>
                  </tr>
                ))}
                <tr className="border-b-2 border-slate-50">
                  <td className="py-2 w-48 font-medium text-gray-500">
                    {t("packer.title")}
                  </td>
                  <td className="w-64 py-2 text-xl text-slate-900">
                    <div className="flex gap-2 items-center ">
                      <div className="w-[100px]">
                        <TextField
                          autoFocus
                          required
                          error={packerFieldError || packerFieldPermissionError}
                          size="small"
                          margin="none"
                          id="name"
                          name="id"
                          placeholder={t("packer.packerIdPlaceholder")}
                          variant="outlined"
                          onChange={(e) => setPackerById(e.target.value)}
                        />
                      </div>
                      <div
                        className={`w-[200px] overflow-hidden text-ellipsis whitespace-nowrap font-medium ${
                          packerFieldError || packerFieldPermissionError
                            ? "text-red-700 text-xs opacity-80"
                            : "text-slate-800 text-lg"
                        }`}
                      >
                        {packerFieldError
                          ? t("packer.idNotValid")
                          : packerFieldPermissionError
                          ? t("packer.cannotSubmit")
                          : packerName}
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
            <p>{t("invoice.startPacking")}</p>
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

export default ImportantStorageInvoiceModal;
