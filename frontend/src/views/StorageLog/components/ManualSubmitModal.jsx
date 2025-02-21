import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useSFX } from "../../../shared/hooks/useSFX.jsx";
import { useLoadingContext } from "../../../shared/contexts/LoadingContext.jsx";
import "../../../shared/styles/Loader.css";

function ManualSubmitModal({ invoiceId, afterSubmit }) {
  const [metaData, setMetaData] = useState({
    packerId: null,
    numberOfPackages: null,
  });
  const [open, setOpen] = useState(false);
  const [packerName, setPackerName] = useState("");
  const [packerHasPermission, setPackerHasPermission] = useState(true);
  const [packerFieldError, setPackerFieldError] = useState(false);
  const [packageNumberFieldError, setPackageNumberFieldError] = useState(false);
  const { playCanSubmitSound } = useSFX();

  const { setProgressLoading } = useLoadingContext();

  const onInputChange = (e) => {
    setMetaData({ ...metaData, [e.target.name]: e.target.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setPackerById("");
    setPackerFieldError(false);
  }, [open]);

  useEffect(() => {
    setPackerById(metaData.packerId);
  }, [metaData.packerId]);

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
    setPackerHasPermission(packer.can_manually_submit);
    setPackerFieldError(false);
  };

  const submit = (e) => {
    e.preventDefault();
    let err = false;
    if (metaData.numberOfPackages === null || metaData.numberOfPackages <= 0) {
      console.log("invalid number of packages");
      setPackageNumberFieldError(true);
      err = true;
    } else {
      setPackageNumberFieldError(false);
    }

    if (packerName === "") {
      console.log("invalid packer name");
      setPackerFieldError(true);
      err = true;
    } else {
      setPackerFieldError(false);
    }

    if (!packerHasPermission) {
      console.log("invalid packer permission");
      err = true;
    }

    if (err) {
      return;
    }

    handleClose();
    setProgressLoading(true);
    ipcRenderer
      .invoke("submit-order", {
        invoiceId: invoiceId,
        packerId: metaData.packerId,
        numberOfPackages: metaData.numberOfPackages,
      })
      .then(async () => {
        playCanSubmitSound();
        setProgressLoading(false);
        afterSubmit();
      });
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
          viewBox="0 0 14 14"
          width="24px"
          fill="gray"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M7 14A7 7 0 1 1 7 0a7 7 0 0 1 0 14z"></path>
            <path
              d="M7 13A6 6 0 1 0 7 1a6 6 0 0 0 0 12z"
              fill="#FFF"
              fillRule="nonzero"
              style={{fill: "var(--svg-status-bg, #1f2937)"}}
            ></path>
            <path d="M6.415 7.04L4.579 5.203a.295.295 0 0 1 .004-.416l.349-.349a.29.29 0 0 1 .416-.004l2.214 2.214a.289.289 0 0 1 .019.021l.132.133c.11.11.108.291 0 .398L5.341 9.573a.282.282 0 0 1-.398 0l-.331-.331a.285.285 0 0 1 0-.399L6.415 7.04zm2.54 0L7.119 5.203a.295.295 0 0 1 .004-.416l.349-.349a.29.29 0 0 1 .416-.004l2.214 2.214a.289.289 0 0 1 .019.021l.132.133c.11.11.108.291 0 .398L7.881 9.573a.282.282 0 0 1-.398 0l-.331-.331a.285.285 0 0 1 0-.399L8.955 7.04z"></path>
          </g>
        </svg>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: submit,
        }}
        onKeyUp={(e) => e.key === "Enter" && submit(e)}
      >
        <DialogTitle>Submit Package</DialogTitle>
        <DialogContent>
          <table className="table-auto text-start w-full">
            <tbody>
              <tr>
                <td className="py-2 w-48 font-medium text-gray-500">
                  Number of packages
                </td>
                <td className="w-64 py-2 text-xl text-slate-900">
                  <TextField
                    autoFocus
                    required
                    size="small"
                    margin="none"
                    placeholder="Number of Packages"
                    error={packageNumberFieldError}
                    name="numberOfPackages"
                    variant="outlined"
                    type="number"
                    onChange={onInputChange}
                  />
                </td>
              </tr>
              <tr className="border-b-2 border-slate-50">
                <td className="py-2 w-48 font-medium text-gray-500">Packer</td>
                <td className="w-64 py-2 text-xl text-slate-900">
                  <div className="flex gap-2 items-center">
                    <div className="w-[100px]">
                      <TextField
                        autoFocus
                        required
                        error={packerFieldError || !packerHasPermission}
                        size="small"
                        margin="none"
                        name="packerId"
                        placeholder="Your ID"
                        variant="outlined"
                        onChange={onInputChange}
                      />
                    </div>
                    <div
                      className={`w-[200px] overflow-hidden text-ellipsis whitespace-nowrap font-medium ${
                        packerFieldError || !packerHasPermission
                          ? "text-red-700 text-xs opacity-80"
                          : "text-slate-800 text-lg"
                      }`}
                    >
                      {packerFieldError
                        ? "ID is not valid"
                        : !packerHasPermission
                        ? "Packer cannot submit"
                        : packerName}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={submit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ManualSubmitModal;
