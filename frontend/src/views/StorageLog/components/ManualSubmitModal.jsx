import React, { useState } from "react";
import { useSFX } from "../../../shared/hooks/useSFX.jsx";
import "../../../shared/styles/Loader.css";
import { useTranslation } from "react-i18next";
import { Button, Modal, Form, Input } from "antd";

function ManualSubmitModal({ invoiceId, invoiceGuid, afterSubmit }) {
  const { t } = useTranslation();
  const [packerIdFieldValidationStatus, setPackerIdFieldValidationStatus] =
    useState("");
  const [open, setOpen] = useState(false);
  const { playCanSubmitSound } = useSFX();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submit = (values) => {
    const packerId = values.packerId;
    const numberOfPackages = values.numberOfPackages;

    ipcRenderer
      .invoke("submit-order", {
        id: invoiceGuid,
        packerId: packerId,
        numberOfPackages: numberOfPackages,
        manually: true,
      })
      .then(async () => {
        console.log("submitted successfully------");

        playCanSubmitSound();
        afterSubmit();
      });
  };

  const packerPermissionValidator = async (_, value) => {
    setPackerIdFieldValidationStatus("validating");
    if (isNaN(value) || !value) {
      setPackerIdFieldValidationStatus("error");
      return Promise.reject();
    }
    const packer = await ipcRenderer.invoke("fetch-packer", value);
    if (!packer.id) {
      setPackerIdFieldValidationStatus("error");
      return Promise.reject(new Error(t("packer.idNotValid")));
    }

    if (!packer.can_manually_submit) {
      setPackerIdFieldValidationStatus("error");
      return Promise.reject(new Error(t("packer.cannotSubmit")));
    }
    setPackerIdFieldValidationStatus("success");
    return Promise.resolve();
  };

  const numberOfPackagesValidationRules = [
    { required: true, message: t("extra.emptyNumberOfPackagesField") },
    { pattern: "^\\d+$", message: t("extra.numberOfPackagesMustBeAnInteger") },
  ];

  const packerIdValidationRules = [
    { required: true, message: t("packer.emptyPackerIdField") },
    { pattern: "^\\d+$", message: t("packer.idMustBeAnInteger") },
    { validator: packerPermissionValidator },
  ];

  return (
    <>
      <Button
        type="link"
        className="hover:bg-transparent w-fit h-full"
        onClick={handleClickOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-1 -1 16 16"
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
            <path
              d="M7 14A7 7 0 1 1 7 0a7 7 0 0 1 0 14z"
              fill="none"
              stroke="gray"
              strokeWidth="1"
            ></path>
            <path
              d="M6.415 7.04L4.579 5.203a.295.295 0 0 1 .004-.416l.349-.349a.29.29 0 0 1 .416-.004l2.214 2.214a.289.289 0 0 1 .019.021l.132.133c.11.11.108.291 0 .398L5.341 9.573a.282.282 0 0 1-.398 0l-.331-.331a.285.285 0 0 1 0-.399L6.415 7.04zm2.54 0L7.119 5.203a.295.295 0 0 1 .004-.416l.349-.349a.29.29 0 0 1 .416-.004l2.214 2.214a.289.289 0 0 1 .019.021l.132.133c.11.11.108.291 0 .398L7.881 9.573a.282.282 0 0 1-.398 0l-.331-.331a.285.285 0 0 1 0-.399L8.955 7.04z"
              fill="gray"
            ></path>
          </g>
        </svg>
      </Button>
      <Modal
        title={`${t("invoice.submitInvoice")} -${invoiceId}-`}
        open={open}
        onClose={handleClose}
        onCancel={handleClose}
        okButtonProps={null}
        cancelText={t("common.cancel")}
        footer={
          <Form
            name="basic"
            labelAlign="left"
            labelCol={{ span: 8 }}
            style={{ maxWidth: 600 }}
            onFinish={submit}
            autoComplete="off"
          >
            <Form.Item
              label={t("invoice.numberOfPackages")}
              name="numberOfPackages"
              rules={numberOfPackagesValidationRules}
            >
              <Input placeholder={t("invoice.numberOfPackages")} />
            </Form.Item>

            <Form.Item
              label={t("packer.title")}
              name="packerId"
              hasFeedback
              validateStatus={packerIdFieldValidationStatus}
              rules={packerIdValidationRules}
            >
              <Input placeholder={t("packer.packerIdPlaceholder")} />
            </Form.Item>

            <Button color="green" variant="solid" htmlType="submit">
              {t("common.submit")}
            </Button>
          </Form>
        }
      ></Modal>
    </>
  );
}

export default ManualSubmitModal;
