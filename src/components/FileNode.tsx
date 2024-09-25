import React, { useState } from "react";
import { Handle, Position, Edge, Node } from "react-flow-renderer";
import Papa from "papaparse";
import { useSelector, useDispatch } from "react-redux";
import { CloseIcon, DragHandleIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";
import { loadCsv } from "../redux/csvSlice";
import { RootState } from "../redux/store";
import { storeEdgesData } from "../redux/EdgesReducer";
import { storeNodesData } from "../redux/NodeReducer";

interface FilterNodeProps {
  data: {
    label: string;
    column: string;
    value: string;
  };
}

const FileNode: React.FC<FilterNodeProps> = (props: any) => {
  const dispatch = useDispatch();
  const { data: edgesData } = useSelector((state: RootState) => state.edges);
  const { data: nodeData } = useSelector((state: RootState) => state.nodes);
  const { data: csvData } = useSelector((state: RootState) => state.csv);

  const upoloadedFile: any = JSON.parse(
    localStorage.getItem("uploadedFile") || "{}"
  );
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("uploaded file :>", file);
    if (file) {
      Papa.parse(file, {
        complete: (result: any) => {
          console.log("uploaded file data==================:>", result);
          localStorage.setItem(
            "uploadedFile",
            JSON.stringify({ data: result?.data, fileName: file.name })
          );
          if (result?.data?.length > 0) {
            const columns: any = result?.data?.[0]?.map((item: any) => {
              return { field: item };
            });
            const rows: any[] = [];
            result?.data?.forEach((itemArr: any, index: number) => {
              if (index === 0) return;
              const row = {};
              itemArr?.forEach((item: any, inneriIndex: number) => {
                Object.assign(row, { [columns[inneriIndex]?.field]: item });
              });
              rows.push(row);
            });
            props?.setCsvData({ rows, columns });
            dispatch(loadCsv({ rows, columns }));
          }
        },
        header: false,
      });
    }
  };
  const handleCloseClick = () => {
    const filterNodeData: Node[] = nodeData?.filter(
      (node: Node) => node?.id !== props?.id
    );
    const filterEdgeData: Edge[] = edgesData?.filter(
      (edge: Edge) => edge?.source !== props?.id || edge?.target !== props?.id
    );
    dispatch(storeEdgesData(filterEdgeData));
    dispatch(storeNodesData(filterNodeData));
    dispatch(loadCsv({rows: [], columns: []}))
  };
  return (
    <Box
      className="relative bg-[#1A1A2E] text-white shadow-lg border-r-none"
      style={{
        width: "250px",
        borderTop: "1px solid #7371b5",
        borderBottom: "1px solid #7371b5",
        borderLeft: "1px solid #7371b5",
        borderRight: "none)",
      }} // Tailwind Indigo-600 color equivalent
    >
      <div className="flex justify-between items-center p-[6px] border-b-[1px] border-[#7371b5]">
        {/* Node Label */}
        <Text className="text-[10px]  mb-2 flex items-center">
          <DragHandleIcon
            width={7.5}
            height={7.5}
            className="cursor-move mr-[5px]"
          />
          File
        </Text>
        <CloseIcon
          onClick={handleCloseClick}
          color={"rgb(156, 168, 179)"}
          width={"6px"}
          height={"6px"}
        />
      </div>
      <div className="p-[6px] flex flex-col">
        {csvData?.rows?.length === 0 ? (
          <>
            <div className="flex items-center justify-between">
              Drop file here or
              <input type="file" accept=".csv" onChange={handleCsvUpload} />
            </div>
            <p> Allowed file types: .csv</p>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <h2 className="text-[#F8F8F2] text-[12px]">
              {upoloadedFile?.fileName}
            </h2>
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        onConnect={(params) => {
          console.log("connect the filter node", params);
        }}
        style={{
          height: "calc(100% + 2px) ",
          border: "none",
          width: "25px",
          background: "rgb(64, 63, 105)",
          borderRadius: "0px 10px 10px 0px",
          top: "-1px",
          right: "-26px",
          transform: "translateY(0px)",
          position: "absolute",
        }}
        className=""
      />
    </Box>
  );
};

export default FileNode;
