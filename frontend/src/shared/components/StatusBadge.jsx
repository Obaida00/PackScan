import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function StatusBadge({ badgeName }) {
  const { t } = useTranslation();
  const [badgeStyle, setbadgeStyle] = useState();

  useEffect(() => {
    if (badgeName == "Pending") {
      setbadgeStyle({ color: "#fff", backgroundColor: "#747474" });
    } else if (badgeName == "InProgress") {
      setbadgeStyle({ color: "#fffde7", backgroundColor: "#cc8b00" });
    } else if (badgeName == "Done") {
      setbadgeStyle({ color: "#dbeafe", backgroundColor: "#1e40af" });
    } else if (badgeName == "Sent") {
      setbadgeStyle({ color: "#166534", backgroundColor: "#86efac" });
    } else {
      throw TypeError("badgeName not matching!!!" + badgeName);
    }
  }, [badgeName]);

  return (
    <div className="inline-flex justify-center align-middle">
      <span
        className="align-middle text-xs font-medium px-4 py-1 rounded-full"
        style={badgeStyle}
      >
        {t(`invoice.status.${badgeName}`)}
      </span>
    </div>
  );
}

export default StatusBadge;
