import React, { useEffect, useState } from "react";
import TableDataCell from "../TableDataCell";
import ProgressBar from "/src/components/ProgressBar.jsx";

function PackingTableRow({ itemObj }) {
    const [background, setBackground] = useState({
        backgroundColor: "#1f2937",
    });

    useEffect(() => {
            setBackground({ background: itemObj.colorMain });
    }, [itemObj.count]);
    
    return (
        <tr
            style={background}
            className="border-b border-gray-700 hover:bg-gray-600 transition ease-in-out text-center"
        >
            <TableDataCell data={itemObj.name} />
            <TableDataCell data={""} />
            <TableDataCell
                data={
                    <ProgressBar
                        currentCount={itemObj.count}
                        totalCount={itemObj.totalCount}
                        color={itemObj.colorSecond}
                    />
                }
            />
        </tr>
    );
}

export default PackingTableRow;
