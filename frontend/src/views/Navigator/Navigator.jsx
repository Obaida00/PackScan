import * as React from "react";
import MenuItem from "../../shared/components/MenuItem.jsx";
import { useTranslation } from "react-i18next";

function Navigator() {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex justify-center align-middle pe-[20vw] pb-[20vh] w-screen h-screen">
        <div className="flex place-items-center">
          <div>
            <MenuItem url="monitor" item={t("navigation.invoiceManager")} />
            <MenuItem url="storage" item={t("navigation.packagingManager")} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Navigator;
