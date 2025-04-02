import React from "react";
import { IconButton } from "@mui/material";
import { PrinterOutlined } from "@ant-design/icons";
import { Button } from "antd";

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
      Print
    </Button>
  );
}

export default PrintInvoiceButton;
