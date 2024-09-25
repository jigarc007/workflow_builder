import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import WorkflowBuilder from "./components/WorkflowBuilder";
import Output from "./components/Output";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Card,
  CardBody,
  Select,
} from "@chakra-ui/react";
import Papa from "papaparse";
import { useDispatch } from "react-redux";
import FilterNode from "./components/FilterNode";
import type { filterDataType } from "./components/FilterNode";
import FileNode from "./components/FileNode";
import { Edge, Node } from "react-flow-renderer";
import { loadCsv } from "./redux/csvSlice";
import { ReactComponent as Logo } from "./assets/images/logo.svg";
import FindNode from "./components/FindNode";
import MapNode from "./components/MapNode";
import { storeNodesData } from "./redux/NodeReducer";
import { storeEdgesData } from "./redux/EdgesReducer";
import {
  storeFilterData,
  storeFindData,
  storeMapData,
} from "./redux/TransactionReducer";
import ReduceNode from "./components/ReduceNode";
import SortNode from "./components/SortNode";
import ErrorBoundary from "./components/ErrorBoundary";

interface CsvDataType {
  rows: any[];
  columns: any[];
}
const inputData = {
  Input: [
    {
      title: "File",
      description: "Handle CSV file",
      input: "",
      output: "Dataset",
      node: {
        id: "node-1",
        type: "fileNode",
        position: { x: 0, y: 0 },
        data: { value: 123 },
      },
    },
  ],
  transform: [
    {
      title: "Filter",
      description: "Groups a data set based on a given column name.",
      input: "Dataset",
      output: "Dataset",
      node: {
        id: "node-2",
        type: "filterNode",
        position: { x: 100, y: 100 },
        data: { value: 123 },
      },
    },
    {
      title: "Sort",
      description: "Slices a data set based on a given column name.",
      input: "Dataset",
      output: "Dataset",
      node: {
        id: "node-2",
        type: "sortNode",
        position: { x: 100, y: 100 },
        data: { value: 123 },
      },
    },
    {
      title: "Find",
      description: "Find a data set based on a given column name.",
      input: "Dataset",
      output: "Dataset",
      node: {
        id: "node-3",
        type: "findNode",
        position: { x: 100, y: 100 },
        data: { value: 123 },
      },
    },
    {
      title: "Reduce",
      description: "Reduce a data set based on a given column name.",
      input: "Dataset",
      output: "Dataset",
      node: {
        id: "node-4",
        type: "reduceNode",
        position: { x: 100, y: 100 },
        data: { value: 123 },
      },
    },
    {
      title: "Map",
      description: "Map a data set based on a given column name.",
      input: "Dataset",
      output: "Dataset",
      node: {
        id: "node5",
        type: "mapNode",
        position: { x: 100, y: 100 },
        data: { value: 123 },
      },
    },
  ],
};

const App: React.FC = () => {
  const dispatch = useDispatch();
  const workFlowData: any[] =
    JSON.parse(localStorage.getItem("workFlowdata") || "[]") || [];
  console.log({ workFlowData });

  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("workflows");
  const allStateData = useSelector((state: RootState) => state);
  console.log("allStateData---------------->", allStateData);
  const [initialNodes, setInitialNodes] = useState<Node[]>([]);
  const [initialEdges, setInitialEdges] = useState<Edge[]>([]);
  const [csvData, setCsvData] = useState<CsvDataType>({
    rows: [],
    columns: [],
  });
  useEffect(() => {
    setInitialNodes((allStateData.nodes?.data as any) || []);
    setInitialEdges((allStateData.edges?.data as any) || []);
  }, [allStateData?.nodes, allStateData?.edges]);
  useEffect(() => {
    setCsvData(allStateData?.csv?.data);
  }, [allStateData?.csv]);

  const handleClickRun = (
    nodeId: string,
    transactionType: string,
    filterData: filterDataType
  ) => {
    const csvDataValues: any = JSON.parse(JSON.stringify(csvData));
    if (transactionType === "filter" && filterData) {
      const { column, condition, value } = filterData;
      if (condition === "Is Equal") {
        csvDataValues.rows = csvDataValues.rows?.filter?.(
          (row: any) => row[column] === value
        );
      } else if (condition === "Is Not Equal") {
        csvDataValues.rows = csvDataValues.rows?.filter?.(
          (row: any) => row[column] !== value
        );
      } else if (condition === "Include") {
        csvDataValues.rows = csvDataValues.rows?.filter?.((row: any) =>
          row[column].includes(value)
        );
      } else if (condition === "Not Include") {
        csvDataValues.rows = csvDataValues.rows?.filter?.(
          (row: any) => !row[column].includes(value)
        );
      }
    } else if (transactionType === "find" && filterData) {
      const { column, condition, value } = filterData;
      if (condition === "Is Equal") {
        csvDataValues.rows =
          [csvDataValues.rows?.find?.((row: any) => row[column] === value)] ||
          [];
      } else if (condition === "Is Not Equal") {
        csvDataValues.rows =
          [csvDataValues.rows?.find?.((row: any) => row[column] !== value)] ||
          [];
      } else if (condition === "Include") {
        csvDataValues.rows =
          [
            csvDataValues.rows?.find?.((row: any) =>
              row[column].includes(value)
            ),
          ] || [];
      } else if (condition === "Not Include") {
        csvDataValues.rows =
          [
            csvDataValues.rows?.find?.(
              (row: any) => !row[column].includes(value)
            ),
          ] || [];
      }
    } else if (transactionType === "map" && filterData) {
      const { column } = filterData;
      csvDataValues.rows = csvDataValues.rows?.map?.((row: any) => {
        return { [column]: row[column] };
      });
      csvDataValues.columns = [{ field: column }];
    } else if (transactionType === "reduce" && filterData) {
      const { column, condition } = filterData;
      if (condition === "Sum") {
        csvDataValues.rows = [
          {
            [`sum of the ${column}`]: csvDataValues.rows?.reduce?.(
              (acc: number, row: any) => acc + row[column],
              0
            ),
          },
        ];
        csvDataValues.columns = [{ field: `sum of the ${column}` }];
      } else if (condition === "Average") {
        const sum = csvDataValues.rows?.reduce?.(
          (acc: number, row: any) => acc + row[column],
          0
        );
        const count = csvDataValues.rows?.length || 1;
        csvDataValues.rows = [{ [`Average of the ${column}`]: sum / count }];
        csvDataValues.columns = [{ field: `Average of the ${column}` }];
      } else if (condition === "Min") {
        csvDataValues.rows = [
          {
            [`Maximum of the ${column}`]: Math.min(
              ...csvDataValues.rows.map((row: any) => row[column])
            ),
          },
        ];
        csvDataValues.columns = [{ field: `Maximum of the ${column}` }];
      } else if (condition === "Max") {
        csvDataValues.rows = [
          {
            [`Minimum of the ${column}`]: Math.max(
              ...csvDataValues.rows.map((row: any) => row[column])
            ),
          },
        ];
        csvDataValues.columns = [{ field: `Minimum of the ${column}` }];
      }
    } else if (transactionType === "sort" && filterData) {
      const { column, condition } = filterData;
      if (condition === "Ascending") {
        sortByColumn(csvDataValues.rows, column);
      } else if (condition === "Descending") {
        sortByColumn(csvDataValues.rows, column, false);
      }
    }
    console.log("filter data===============>", csvDataValues);
    setCsvData(csvDataValues);
    dispatch(loadCsv(csvDataValues));
  };
  const nodeTypes = {
    filterNode: (props: any) => (
      <FilterNode
        {...props}
        columns={csvData?.columns}
        handleClickRun={handleClickRun}
      />
    ),
    fileNode: (props: any) => (
      <FileNode {...props} setCsvData={setCsvData} csvData={csvData} />
    ),
    findNode: (props: any) => (
      <FindNode
        {...props}
        columns={csvData?.columns}
        handleClickRun={handleClickRun}
      />
    ),
    mapNode: (props: any) => (
      <MapNode
        {...props}
        columns={csvData?.columns}
        handleClickRun={handleClickRun}
      />
    ),
    reduceNode: (props: any) => (
      <ReduceNode
        {...props}
        columns={csvData?.columns}
        handleClickRun={handleClickRun}
      />
    ),
    sortNode: (props: any) => (
      <SortNode
        {...props}
        columns={csvData?.columns}
        handleClickRun={handleClickRun}
      />
    ),
  };

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const handleCardClick = (node: any) => {
    const newNode: Node[] = [...initialNodes];
    newNode.push({ ...node, id: `node-${Date.now()}` });
    setInitialNodes(newNode);
  };
  const exportToJsonFile = (data: any, fileName: string = "data") => {
    const jsonString = JSON.stringify(data, null, 2); // Pretty print JSON with 2 spaces
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.json`; // Set the downloaded file's name

    // Programmatically trigger the download
    document.body.appendChild(link); // Append to the DOM to make it work in Firefox
    link.click();
    document.body.removeChild(link); // Clean up
  };
  const exportToCSV = (data: any, fileName: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName + ".csv";
    link.click();
  };

  const handleExportChange = (value: string) => {
    const fileData: any = JSON.parse(
      localStorage.getItem("uploadedFile") || "[]"
    );
    console.log({ fileData });
    if (value === "CSV") {
      exportToCSV(fileData, fileData?.fileName);
    } else {
      exportToJsonFile(fileData?.data, fileData?.fileName);
    }
  };
  const renderCards = (item: any, index: number) => {
    return (
      <Card
        maxW="sm"
        key={index}
        onClick={() => {
          handleCardClick(item.node);
          onClose();
        }}
        style={{ maxWidth: "200px", background: "#333154", cursor: "pointer" }}
      >
        <CardBody>
          <div className="flex flex-col justify-between gap-2" key={index}>
            <h2 className="text-[#F8F8F2] text-[15px] font-bold uppercase">
              {item.title}
            </h2>
            <p className="text-[#C5CBD2] text-[11px]">{item.description}</p>
            <div className="flex flex-col gap-2">
              <span className="flex items-center text-[#C5CBD2] text-[11px]">
                Input:{" "}
                <p className="ml-2 text-[#C5CBD2] text-[11px]">{item.input}</p>
              </span>
              <span className="flex items-center text-[#C5CBD2] text-[11px]">
                Output:{" "}
                <p className="ml-2 text-[#C5CBD2] text-[11px]">{item.output}</p>
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  };
  const renderWorkflowCards = (item: any, index: number) => {
    console.log({ item });
    return (
      <Card
        maxW="sm"
        key={index}
        onClick={() => {
          const finalWorkFlowdata: any = item?.[Object.keys(item)[0]];
          dispatch(loadCsv(finalWorkFlowdata.csv.data));
          dispatch(storeEdgesData(finalWorkFlowdata.edges.data));
          dispatch(storeNodesData(finalWorkFlowdata.nodes.data));
          finalWorkFlowdata.transaction?.data?.filter &&
            dispatch(
              storeFilterData(finalWorkFlowdata.transaction.data.filter)
            );
          finalWorkFlowdata.transaction?.data?.find &&
            dispatch(storeFindData(finalWorkFlowdata.transaction.data.find));
          finalWorkFlowdata.transaction?.data?.map &&
            dispatch(storeMapData(finalWorkFlowdata.transaction.data.map));
          setInitialNodes(finalWorkFlowdata.nodes.data || []);
          setInitialEdges(finalWorkFlowdata?.edges.data || []);
          setCsvData(finalWorkFlowdata.csv.data);

          onClose();
        }}
        style={{ maxWidth: "200px", background: "#333154", cursor: "pointer" }}
      >
        <CardBody>
          <div className="flex flex-col justify-between gap-2" key={index}>
            <h2 className="text-[#F8F8F2] text-[15px] font-bold uppercase">
              {Object.keys(item)[0]}
            </h2>
          </div>
        </CardBody>
      </Card>
    );
  };
  const handleWorkflowSave = () => {
    if (initialNodes?.length > 0) {
      console.log({ allStateData });
      const workFlowData: any[] =
        JSON.parse(localStorage.getItem("workFlowData") || "[]") || [];
      console.log({ workFlowData });

      localStorage.setItem(
        "workFlowdata",
        JSON.stringify([
          ...workFlowData,
          { [`workflow-${new Date().getTime()}`]: allStateData },
        ])
      );
    }
  };
  function sortByColumn<T>(
    array: T[],
    column: keyof T,
    ascending: boolean = true
  ): T[] {
    return array.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];

      // Handle string comparison safely
      if (typeof valA === "string" && typeof valB === "string") {
        const result = (valA || "").localeCompare(valB || "");
        return ascending ? result : -result;
      }

      // Handle numeric comparison safely
      if (typeof valA === "number" && typeof valB === "number") {
        const result = (valA || 0) - (valB || 0);
        return ascending ? result : -result;
      }

      // Handle cases where the values are undefined or of other types
      return 0;
    });
  }
  return (
    <ErrorBoundary>
      <div className="flex relative overflow-hidden h-screen w-[100%]">
        <Modal
          isCentered
          onClose={onClose}
          isOpen={isOpen}
          size={"2xl"}
          motionPreset="slideInBottom"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              style={{
                background: "#222138",
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#F8F8F2",
              }}
            >
              Block Library
            </ModalHeader>
            <ModalCloseButton color={"#F8F8F2"} />
            <ModalBody style={{ background: "#222138" }}>
              <div className="flex">
                <div className="w-[20%] h-full">
                  <ul className="list-none flex-col">
                    <li
                      onClick={() => setCurrentTab("workflows")}
                      style={{
                        background:
                          currentTab === "workflows"
                            ? "#333154"
                            : "transparent",
                      }}
                      className="p-[5px] text-[#FFF] uppercase text-[12px] mb-2 cursor-pointer hover:bg-[#333154] w-[100px] flex items-center justify-center"
                    >
                      Workflows
                    </li>
                    <li
                      onClick={() => setCurrentTab("transform")}
                      style={{
                        background:
                          currentTab === "transform"
                            ? "#333154"
                            : "transparent",
                      }}
                      className=" p-[5px] text-[#FFF] uppercase text-[12px] cursor-pointer hover:bg-[#333154] w-[100px] flex items-center justify-center"
                    >
                      Transform
                    </li>
                  </ul>
                </div>
                <div className="w-[80%] h-full flex flex-col gap-5">
                  {currentTab === "transform" && (
                    <>
                      <span className="text-[#F8F8F2] text-[11px] font-bold uppercase">
                        Input
                      </span>
                      <div className="flex flex-wrap gap-5">
                        {inputData.Input.map((item, index) =>
                          renderCards(item, index)
                        )}
                      </div>
                      <span className="text-[#F8F8F2] text-[11px] font-bold uppercase">
                        Transform
                      </span>
                      <div className="flex flex-wrap gap-5">
                        {inputData.transform.map((item, index) =>
                          renderCards(item, index)
                        )}
                      </div>
                    </>
                  )}
                  {currentTab === "workflows" && (
                    <>
                      <span className="text-[#F8F8F2] text-[11px] font-bold uppercase">
                        Workflows
                      </span>

                      <div className="flex flex-wrap gap-5">
                        {workFlowData?.map((item, index) =>
                          renderWorkflowCards(item, index)
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>

        <div className="flex-col flex-grow-1 h-[100%] w-[100%]">
          {/* <div className='w-[20%]'>
        <Sidebar onNodeDragStart={handleNodeDragStart} />
        </div> */}
          <header className="w-[100%] p-[12px] h-[10%] relative overflow-auto flex justify-between items-center min-h-[90px]">
            <div>
              <Logo />
            </div>
            <h2 className="text-[14px] text-[#FFF]">Demo Flow</h2>
            <Button
              onClick={handleWorkflowSave}
              style={{ height: "30px" }}
            >
              Save
            </Button>
          </header>
          <div className="w-[100%] h-[60%] relative overflow-hidden flex-shrink-0 min-h-[150px]">
            <Button
              style={{
                position: "absolute",
                zIndex: 100,
                padding: "0.5rem",
                top: "10px",
                left: "10px",
                fontSize: "12px",
                borderRadius: "20px",
                border: "1px solid rgb(76, 73, 126)",
                background: "rgb(26, 25, 43)",
                color: "rgb(214, 213, 230)",
              }}
              onClick={onOpen}
            >
              + Add block
            </Button>
            <WorkflowBuilder
              initialNodes={initialNodes}
              nodeTypes={nodeTypes}
              initialEdges={initialEdges}
            />
          </div>
          <div className="w-[100%] h-[30%] relative bottom-0 flex flex-row">
            <div className="w-[70%] border-r-[1px] border-r-[#7371b5]">
              <div className="flex items-center relative p-[0.5rem] h-[40px] w-[100%] overflow-hidden border-[1px] border-[#7371b5]">
                <p className="text-[11px] font-bold text-[#FFF] uppercase">
                  Output
                </p>
                <div className="flex mt-3 ml-2">
                  <Select
                    placeholder="Export"
                    size="sm"
                    backgroundColor="#2C2C47"
                    color="white"
                    style={{
                      borderRadius: "4px",
                      border: "1px solid #7371b5",
                      width: "150px",
                      height: "30px",
                      padding: "5px",
                    }}
                    onChange={(e) => handleExportChange(e.target.value)}
                    borderColor="#3C3C55"
                    className="mb-3 text-[12px] p-[5px]"
                    _hover={{
                      borderColor: "#5A5A75",
                      backgroundColor: "#2C2C47",
                    }}
                    _focus={{
                      paddingRight: "2rem",
                      borderColor: "#6B46C1",
                      boxShadow: "0 0 0 1px #6B46C1",
                      backgroundColor: "#2C2C47",
                    }}
                  >
                    <option
                      style={{ color: "white", backgroundColor: "#2C2C47" }}
                      value={"json"}
                    >
                      json
                    </option>
                    <option
                      style={{ color: "white", backgroundColor: "#2C2C47" }}
                      value={"CSV"}
                    >
                      CSV
                    </option>
                  </Select>
                </div>
              </div>
              {csvData.rows?.length > 0 ? (
                <Output rows={csvData.rows} columns={csvData.columns} />
              ) : (
                <></>
              )}
            </div>
            <div className="w-[30%] h-[100%]">
              <div className="flex relative p-[0.5rem] h-[30px] w-[100%] overflow-hidden border-[1px] border-[#7371b5]">
                <p className="text-[11px] font-bold text-[#FFF] uppercase">
                  Logs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
