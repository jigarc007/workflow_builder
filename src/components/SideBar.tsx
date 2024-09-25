import React from 'react';
import { useDispatch } from 'react-redux';
import Papa from 'papaparse';
import { loadCsv } from '../redux/csvSlice';

interface SidebarProps {
  onNodeDragStart: (event: React.DragEvent, nodeType: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNodeDragStart }) => {
  const dispatch = useDispatch();

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (result: any) => {
          dispatch(loadCsv(result.data));
        },
        header: false,
      });
    }
  };

  return (
    <div className="sidebar">
      <h3>Select a CSV</h3>
      <input type="file" accept=".csv" onChange={handleCsvUpload} />
      <div className="nodes">
        <div onDragStart={(event) => onNodeDragStart(event, 'filter')} draggable>
          Filter
        </div>
        <div onDragStart={(event) => onNodeDragStart(event, 'map')} draggable>
          Map
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
