import * as React from "react";
import "../../../shared/styles/Modal.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Button, Form, Input } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

function ImportantStorageInvoiceModal({ invoice }) {
  const { t } = useTranslation();
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

    const id = document.getElementById("name").value;
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
        type="link"
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
                <div className="flex gap-2 items-center ">
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </Modal>
    </>
  );
}

export default ImportantStorageInvoiceModal;
