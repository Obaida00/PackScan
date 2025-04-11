import * as React from "react";
import "../../../shared/styles/Modal.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Button, Form, Input } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

function StorageInvoiceModal({ invoice, modalIcon, validator }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const inputRef = useRef(null);

  const rows = [
    { label: "statement", value: invoice.statement },
    { label: "pharmacist", value: invoice.pharmacist },
    { label: "createdAt", value: invoice.created_at },
    { label: "dateOfDelivery", value: invoice.date },
    { label: "netPrice", value: invoice.net_price },
  ];

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const packerIdValidationRules = [
    { required: true, message: t("packer.emptyPackerIdField") },
    { pattern: "^\\d+$", message: t("packer.idMustBeAnInteger") },
  ];
  if (validator) packerIdValidationRules.push({ validator });

  const submitForm = (event) => {
    const id = event.id;
    handleClose();
    nav(`/packing/${invoice.id}`, {
      state: { packerId: id },
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        type="link"
        className="hover:bg-transparent w-fit h-full"
        onClick={handleClickOpen}
      >
        {modalIcon}
      </Button>
      <Modal
        title={`-${invoice.invoice_id}-`}
        open={open}
        onCancel={handleClose}
        footer={
          <Form onFinish={submitForm}>
            <Form.Item
              label={t("packer.title")}
              name="id"
              rules={packerIdValidationRules}
            >
              <Input
                placeholder={t("packer.packerIdPlaceholder")}
                id="name"
                ref={inputRef}
              />
            </Form.Item>
            <Button
              htmlType="submit"
              variant="solid"
              color="green"
              iconPosition="end"
              icon={
                <ArrowRightOutlined rotate={i18n.language === "ar" ? 180 : 0} />
              }
            >
              {t("invoice.startPacking")}
            </Button>
          </Form>
        }
      >
        <table className="table-auto text-start w-full">
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b-1 border-slate-50">
                <td className="py-1 font-normal dark:text-gray-300 text-gray-500">
                  {t("invoice." + row.label)}
                </td>
                <td className="py-1 font-medium text-xl text-slate-800 dark:text-slate-100">
                  {row.value}
                </td>
              </tr>
            ))}
            <tr className="border-b dark:border-slate-50 border-slate-400">
              <td className="py-2 w-48 font-medium text-gray-500"></td>
              <td className="w-64 py-2 text-xl text-slate-900">
                <div className="flex gap-2 items-center "></div>
              </td>
            </tr>
          </tbody>
        </table>
      </Modal>
    </>
  );
}

export default StorageInvoiceModal;
