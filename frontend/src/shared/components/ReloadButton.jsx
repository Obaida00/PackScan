import { Button, ConfigProvider, theme, Tooltip } from "antd";
import * as React from "react";
import {RedoOutlined} from "@ant-design/icons";
import { useTheme } from "../contexts/ThemeContext.jsx";

function ReloadButton({ callback }) {
  return (
    <Tooltip title="refresh">
      <Button shape="circle" size="large" icon={<RedoOutlined/>} onClick={async () => await callback()} />
    </Tooltip>
  );
}

export default ReloadButton;
