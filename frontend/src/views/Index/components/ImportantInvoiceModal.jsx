import * as React from "react";
import "../../../shared/styles/Modal.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Button } from "antd";

function ImportantInvoiceModal({ invoice, callback }) {
  const [modal, contextHolder] = Modal.useModal();

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    warningModal();
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

  const warningModal = () => {
    modal.warning({
      open: { open },
      title: `-${invoice.invoice_id}-${invoice.storage_code.toUpperCase()}`,
      content: t("extra.doYouWantToRemoveImportantFlag"),
      okCancel: { handleClose },
      closable: true,
      okButtonProps: {
        color: "danger",
        danger: true,
      },
      okText: t("common.remove"),
      onCancel: handleClose,
      onClose: handleClose,
      onOk: submitForm,
    });
  };

  return (
    <>
      <Button
        type="link"
        title={t("invoice.details")}
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
      {contextHolder}
    </>
  );
}

export default ImportantInvoiceModal;
