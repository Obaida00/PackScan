import * as React from "react";
import "../../../shared/styles/Modal.css";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Input } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function StorageInvoiceModal({ invoice }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  
  const nav = useNavigate();

  const rows = [
    { label: "statement", value: invoice.statement },
    { label: "pharmacist", value: invoice.pharmacist },
    { label: "createdAt", value: invoice.created_at },
    { label: "dateOfDelivery", value: invoice.date },
    { label: "netPrice", value: invoice.net_price },
  ];

  useEffect(() => {
  }, [open]);

  const submitForm = (event) => {
    const id = event.id;

    ipcRenderer.invoke("fetch-packer", id).then((packer) => {
      if (packer.id) {
        handleClose();
        nav(`/packing/${invoice.id}`, {
          state: { packerId: id },
        });
      }
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
        type="text"
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
      <Modal
        title={`-${invoice.invoice_id}-`}
        open={open}
        onCancel={handleClose}
        footer={[
          <Form onFinish={submitForm}>
            <Form.Item
              label={t("packer.title")}
              name="id"
              rules={[{ required: true, message: "Please enter ID" }]}
            >
              <Input placeholder={t("packer.packerIdPlaceholder")} id="name" />
            </Form.Item>
            <Button
              htmlType="submit"
              variant="solid"
              color="green"
              icon={<ArrowRightOutlined />}
            >
              {t("invoice.startPacking")}
            </Button>
          </Form>,
        ]}
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
