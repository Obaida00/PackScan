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
