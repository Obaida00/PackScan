import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Input, Button } from "antd";

function SubmitInvoiceButton({ packerId, invoice, action, disabled }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [numberOfPackages, setNumberOfPackages] = useState(null);
  const [packageNumberFieldError, setPackageNumberFieldError] = useState(false);

  const rows = [
    { label: "statement", value: invoice.statement },
    { label: "pharmacist", value: invoice.pharmacist },
    { label: "createdAt", value: invoice.created_at },
    { label: "dateOfDelivery", value: invoice.date },
    { label: "netPrice", value: invoice.net_price },
    { label: "storage", value: invoice.storage_name },
    { label: "currentPackerId", value: packerId },
  ];

  useEffect(() => {
    setNumberOfPackages(invoice.number_of_packages);
  }, [invoice]);

  const submit = (e) => {
    e.preventDefault();
    if (numberOfPackages === null || numberOfPackages <= 0) {
      console.log("invalid number of packages");
      setPackageNumberFieldError(true);
      return;
    }
    handleClose();
    action(numberOfPackages);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="flex justify-center py-4">
        <div className="min-h-[5vh] w-fll flex justify-end">
          <button
            onClick={handleClickOpen}
            className="disabled:bg-slate-600 disabled:text-slate-400 text-slate-100 border border-slate-400 bg-green-700 hover:bg-green-800 focus:ring-2 focus:outline-none focus:ring-slate-300 font-semibold rounded-xl text-sm px-4 py-2 text-center flex items-center transition-all duration-200"
            disabled={disabled}
          >
            <p>{t("invoice.submitInvoice")}</p>
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
        </div>
      </div>
      <Modal
        open={open}
        onCancel={handleClose}
        title={`-${invoice.invoice_id}-`}
        footer={[
          <Button onClick={submit} color="green" variant="solid">
            {t("invoice.submitInvoice")}
          </Button>
        ]}
      >
        <table className="table-auto text-start w-full">
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-gray-400">
                <td className="py-1 w-48 font-medium text-sm dark:text-gray-300 text-gray-600">
                  {t("invoice." + row.label)}
                </td>
                <td className="py-1 w-[300px] font-semibold text-lg dark:text-gray-200 text-slate-900">
                  {row.value}
                </td>
              </tr>
            ))}
            <tr>
              <td className="py-2 w-48 font-medium dark text-gray-500">
                {t("invoice.numberOfPackages")}
              </td>
              <td className="w-64 py-2 text-xl dark:text-gray-300 text-gray-600">
                <Input
                  required
                  autoFocus
                  size="middle"
                  defaultValue={invoice.number_of_packages}
                  placeholder={t("invoice.numberOfPackages")}
                  inputMode="numeric"
                  id="name"
                  name="id"
                  onKeyUp={(e) => e.key === "Enter" && submit(e)}
                  onChange={(e) => setNumberOfPackages(e.target.value)}
                ></Input>
              </td>
            </tr>
          </tbody>
        </table>
      </Modal>
    </>
  );
}

export default SubmitInvoiceButton;
