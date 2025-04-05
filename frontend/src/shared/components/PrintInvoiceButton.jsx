import React from "react";
import { IconButton } from "@mui/material";
import { PrinterOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { t } from "i18next";

function PrintInvoiceButton({ invoiceId }) {
  const printInvoice = () => {
    ipcRenderer.invoke("print-invoice", invoiceId);
  };

  return (
    <Button
      aria-label="print"
      icon={<PrinterOutlined />}
      onClick={printInvoice}
    >
      {t("common.print")}
    </Button>
  );
}

export default PrintInvoiceButton;
