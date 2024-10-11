import { useEffect, useState } from "react";

function StatusBadge({ badgeName}) {
  const [badgeStyle, setbadgeStyle] = useState();

  
  useEffect(() => {
    if (badgeName == "Done") {
      setbadgeStyle({ color: "#166534", backgroundColor: "#86efac" });
    } else if (badgeName == "Pending") {
      setbadgeStyle({ color: "#fef9c3", backgroundColor: "#ca8a04" });
    } else if (badgeName == "In Progress") {
      setbadgeStyle({ color: "#dbeafe", backgroundColor: "#1e40af" });
    } else {
      throw TypeError("badgeName not matching!!!" + badgeName);
    }

  }, [badgeName]);

  return (
    <div className="inline-flex justify-center align-middle">
      <span
        className="align-middle text-xs font-medium me-2 px-4 py-1 rounded-full"
        style={badgeStyle}
      >
        {badgeName}
      </span>
    </div>
  );
}

export default StatusBadge;
