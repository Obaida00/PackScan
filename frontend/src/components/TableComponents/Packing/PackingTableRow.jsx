import React, { useEffect, useState } from "react";
import TableDataCell from "../TableDataCell.jsx";
import ProgressBar from "/src/components/ProgressBar.jsx";
import Decrement from "./Decrement.jsx";

function PackingTableRow({ itemObj, decrementFunc }) {
    const [background, setBackground] = useState({
        backgroundColor: "#1f2937",
    });

    useEffect(() => {
        setBackground({ background: itemObj.colorMain });
    }, [itemObj.current_count]);

    return (
        <tr
            style={background}
            className="group border-0 text-center"
        >
            <TableDataCell data={itemObj.name} />
            <TableDataCell
                data={
                    <ProgressBar
                        currentCount={itemObj.current_count}
                        totalCount={itemObj.total_count}
                        color={itemObj.colorSecond}
                    />
                }
            />
            <TableDataCell
                data={<Decrement data={itemObj} action={decrementFunc} />}
            />
        </tr>
    );
}

export default PackingTableRow;
