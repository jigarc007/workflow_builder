import React from "react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optio
interface ColumnRowType {
  [key: string]: string
}
interface OutputProps {
  rows: ColumnRowType[];
  columns: ColumnRowType[];
}
export default function Output({ rows, columns }: OutputProps) {
  return (
    <div
      style={{ height: "calc(100% - 40px)" }}
      className="ag-theme-quartz" // applying the Data Grid theme // the Data Grid will fill the size of the parent container
    >
      <AgGridReact rowData={rows} columnDefs={columns} />
    </div>
  );
}
