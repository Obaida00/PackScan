import React, { useEffect, useState } from "react";
import TableDataCell from "../../../shared/components/TableComponents/TableDataCell.jsx";
import ProgressBar from "../../../shared/components/ProgressBar.jsx";
import Decrement from "./Decrement.jsx";

function PackingTableRow({ item, decrementFunc }) {

  const [background, setBackground] = useState({
    backgroundColor: "#1f2937"
  });

  useEffect(() => {
    setBackground({ background: item.colorMain });
  }, [item.current_count]);

  return (
    <tr style={background} className="group border-0 text-center border-b dark:border-gray-700 border-gray-300 hover:bg-gray-100 ">
      <TableDataCell data={item.name} />
      <TableDataCell
        data={
          <ProgressBar
            currentCount={item.current_count}
            totalCount={item.total_count}
            color={item.colorSecond}
          />
        }
      />
      <TableDataCell
        data={<Decrement _key={item.barcode} action={decrementFunc} />}
      />
    </tr>
  );
}

export default PackingTableRow;
