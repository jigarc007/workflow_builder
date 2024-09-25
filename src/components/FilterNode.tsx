import React, { memo, useEffect, useState, useMemo } from "react";
import { Box, Text, Select, Input, Button } from "@chakra-ui/react";
import { Handle, Position, Node, Edge } from "react-flow-renderer";
import { CloseIcon, DragHandleIcon } from "@chakra-ui/icons";
import { storeFilterData } from "../redux/TransactionReducer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { storeEdgesData } from "../redux/EdgesReducer";
import { storeNodesData } from "../redux/NodeReducer";

export interface filterDataType {
  column: string;
  condition: string;
  value: string;
}
type OptionValuesType = {
  column: string[];
  condition: string[];
};
const FilterNode = (props: any) => {
  const { data: transactionData } = useSelector(
    (state: RootState) => state.transaction
  );
  const { data: edgesData } = useSelector((state: RootState) => state.edges);
  const { data: nodeData } = useSelector((state: RootState) => state.nodes);

  const dispatch = useDispatch();
  const [filterData, setFilterData] = useState<filterDataType>({
    column: "",
    condition: "",
    value: "",
  });
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [optionValues, setOptionValues] = useState<OptionValuesType>({
    column: props?.columns || [],
    condition: ["Is Equal", "Is Not Equal", "Include", "Not Include"],
  });
  useEffect(() => {
    if (transactionData?.filter?.[props?.id]) {
      const { column, condition, value } = transactionData?.filter[props?.id];
      setFilterData({
        column,
        value,
        condition,
      });
    }
  }, [props?.id, transactionData]);
  useEffect(() => {
    console.log("edges===========>", edgesData);
    if (edgesData.length > 0) {
      const edgeIndex = edgesData?.findIndex(
        (edge: Edge) => edge?.source === props.id || edge?.target === props.id
      );
      console.log({ edgeIndex });
      if (edgeIndex > -1) {
        setIsConnected(true);
      }
    }
  }, [edgesData, props.id]);
  useMemo(() => {
    if (optionValues?.column?.length === 0) {
      console.log("useEffect csvdata filter node===========>", props?.columns);
      setOptionValues({
        column: props?.columns || [],
        condition: ["Is Equal", "Is Not Equal", "Include", "Not Include"],
      });
    }
  }, [JSON.stringify(props?.columns)]);
  const handleChange = (
    key: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilterData({ ...filterData, [key]: e.target.value });
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
  };
  return (
    <Box
      className="relative bg-[#1A1A2E] text-white shadow-lg border-r-none flex-col"
      style={{
        width: "250px",
        borderTop: "1px solid #7371b5",
        borderBottom: "1px solid #7371b5",
        borderLeft: "1px solid #7371b5",
        borderRight: "none",
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
          Filter
        </Text>
        <CloseIcon
          onClick={handleCloseClick}
          color={"rgb(156, 168, 179)"}
          width={"6px"}
          height={"6px"}
        />
      </div>
      {/* Column Name Label */}
      <div className="p-[6px] flex flex-col">
        <Text className="text-sm mb-1 text-gray-300">Column name:</Text>

        {/* Column Select Dropdown */}
        <Select
          placeholder="← connect dataset..."
          size="sm"
          backgroundColor="#2C2C47"
          color="white"
          style={{
            borderRadius: "4px",
            border: "1px solid #7371b5",
            width: "100%",
            color: "white",
          }}
          value={filterData.column}
          onChange={(e) => handleChange("column", e)}
          borderColor="#3C3C55"
          className="mb-3 text-[12px] p-[5px]"
          _hover={{ borderColor: "#5A5A75" }}
          _focus={{
            paddingRight: "2rem",
            borderColor: "#6B46C1",
            boxShadow: "0 0 0 1px #6B46C1",
          }}
        >
          {(isConnected || transactionData?.filter?.[props?.id]) &&
            props?.columns?.length > 0 &&
            optionValues?.column?.map((value: any, index: number) => (
              <option
                style={{ color: "white", backgroundColor: "#2C2C47" }}
                key={`${index}_${value?.field}`}
                value={value.field}
              >
                {value?.field}
              </option>
            ))}
        </Select>
        {/* Column Select Dropdown */}
        {props?.columns?.length > 0 && (
          <>
            <Text className="text-sm mb-1 text-gray-300">Condition:</Text>
            <Select
              placeholder="condition"
              size="sm"
              backgroundColor="#2C2C47"
              color="white"
              value={filterData.condition}
              style={{
                borderRadius: "4px",
                border: "1px solid #7371b5",
                width: "100%",
              }}
              onChange={(e) => handleChange("condition", e)}
              borderColor="#3C3C55"
              className="mb-3 text-[12px] p-[5px]"
              _hover={{ borderColor: "#5A5A75" }}
              _focus={{
                paddingRight: "2rem",
                borderColor: "#6B46C1",
                boxShadow: "0 0 0 1px #6B46C1",
              }}
            >
              {optionValues?.condition?.map((value, index) => (
                <option
                  style={{ color: "white", backgroundColor: "#2C2C47" }}
                  key={`${index}_${value}`}
                  value={value}
                >
                  {value}
                </option>
              ))}
            </Select>
          </>
        )}
        {(isConnected || transactionData?.filter?.[props?.id]) &&
          props?.columns?.length > 0 && (
            <Input
              backgroundColor="#2C2C47"
              color="white"
              value={filterData?.value}
              placeholder="Enter value"
              onChange={(e) => handleChange("value", e)}
              style={{
                borderRadius: "4px",
                border: "1px solid #7371b5",
                width: "100%",
              }}
            />
          )}
      </div>
      {filterData.column && filterData.condition && filterData.value && (
        <Button
          type="button"
          backgroundColor="#2C2C47"
          style={{
            marginTop: "10px",
            border: "1px solid #7371b5",
            width: "100%",
            color:'white'
          }}
          _hover={{background: '#2C2C47'}}
          onClick={(e) => {
            e.preventDefault();
            if (
              !transactionData?.filter?.[props?.id] ||
              transactionData?.filter?.[props?.id]?.condition !==
                filterData.condition ||
              transactionData?.filter?.[props?.id]?.column !==
                filterData.column ||
              filterData.value !== transactionData?.filter?.[props?.id]?.value
            ) {
              dispatch(storeFilterData({ [props?.id]: filterData }));
              props?.handleClickRun?.(props?.id, "filter", filterData);
            }
          }}
        >
          Run
        </Button>
      )}
      {/* Input and Output Handles */}
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => {
          console.log("connect the filter node");
        }}
        style={{
          background: "rgb(64, 63, 105)",
          left: "-19px",
          border: "none",
          height: "18px",
          width: "15px",
          borderRadius: "8px 0px 0px 8px",
          position: "absolute",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
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

export default memo(FilterNode);
