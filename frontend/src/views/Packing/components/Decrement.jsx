import * as React from "react";
import { Button } from "antd";
import { MinusOutlined } from "@ant-design/icons";
function Decrement({ _key, action }) {
  return (
    <Button
      icon={<MinusOutlined />}
      type="primary"
      shape="circle"
      danger
      onClick={() => action(_key)}
      className="opacity-0 group-hover:opacity-100"
    />
  );
}

export default Decrement;
