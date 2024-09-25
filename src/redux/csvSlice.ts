import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CsvState {
  data: CsvDataType;
}
interface CsvDataType {
  rows: any[];
  columns: any[];
}
const initialState: CsvState = {
  data: {
    rows: [],
    columns: [],
  },
};

const csvSlice = createSlice({
  name: 'csv',
  initialState,
  reducers: {
    loadCsv: (state, action: PayloadAction<CsvDataType>) => {
      state.data = action.payload;
    },
  },
});

export const { loadCsv } = csvSlice.actions;
export default csvSlice.reducer;
