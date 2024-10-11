import TableHeader from "../TableHeader";
import TableRow from "./PackingTableRow";
import TableEmptyRow from "../TableEmptyRow";

function PackingTable({ data }) {
  return (
    <table className="w-full text-md text-gray-300 tracking-wide ">
      <thead className="text-mg bg-gray-700 text-gray-400">
        <tr>
          <TableHeader columnName="Item Name" />
          <TableHeader columnName="" />
          <TableHeader columnName="Item Count" />
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((obj, key) => <TableRow key={key} i={key} itemObj={obj} />)
        ) : (
          <TableEmptyRow />
        )}
      </tbody>
    </table>
  );
}
export default PackingTable;
