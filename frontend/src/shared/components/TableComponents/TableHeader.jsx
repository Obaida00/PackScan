import React from "react";

function TableHeader({ columnName, width }) {
    return (
        <th
            scope="col"
            className="px-6 py-3"
            style={width ? { width: width + "%" } : null}
        >
            {columnName}
        </th>
    );
}

export default TableHeader;
