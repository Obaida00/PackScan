import { Button, Tooltip } from "antd";
import * as React from "react";
import { RedoOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

function ReloadButton({ callback }) {
  const { t } = useTranslation();

  return (
    <Tooltip title={t("common.refresh")}>
      <Button
        shape="circle"
        size="large"
        icon={<RedoOutlined />}
        onClick={async () => await callback()}
      />
    </Tooltip>
  );
}

export default ReloadButton;
