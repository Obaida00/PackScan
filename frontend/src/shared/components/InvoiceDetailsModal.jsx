import * as React from "react";
import "../../shared/styles/Modal.css";
import { Modal, Button } from "antd";
import { useState } from "react";
import PrintInvoiceButton from "../../shared/components/PrintInvoiceButton.jsx";
import { useTranslation } from "react-i18next";

function InvoiceDetailsModal({ invoice }) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const rows = [
    { label: t("invoice.statement"), value: invoice.statement },
    { label: t("invoice.pharmacist"), value: invoice.pharmacist },
    { label: t("invoice.createdAt"), value: invoice.created_at },
    { label: t("invoice.dateOfDelivery"), value: invoice.date },
    { label: t("invoice.netPrice"), value: invoice.net_price },
    { label: t("storage.title"), value: t("storage." + invoice.storage_name) },
    { label: t("invoice.status.title"), value: invoice.status },
    { label: t("packer.title"), value: invoice.packer_name ?? "-----------" },
    {
      label: t("invoice.numberOfPackages"),
      value: invoice.number_of_packages ?? "-----------",
    },
    { label: t("invoice.doneAt"), value: invoice.done_at ?? "-----------" },
    { label: t("invoice.sentAt"), value: invoice.sent_at ?? "-----------" },
    {
      label: t("invoice.submittionMode"),
      value: invoice.submittion_mode ?? "-----------",
    },
  ];

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
        title={`-${invoice.invoice_id}-${invoice.storage_code.toUpperCase()}-`}
        open={open}
        onOk={handleClose}
        onCancel={handleClose}
        footer={<PrintInvoiceButton invoiceId={invoice.id} />}
      >
        <table className="table-auto text-start w-full">
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b-1 border-slate-50">
                <td className="py-1 font-normal dark:text-gray-300 text-gray-500">
                  {row.label}
                </td>
                <td className="py-1 font-medium text-xl text-slate-800 dark:text-slate-100">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </>
  );
}

export default InvoiceDetailsModal;
