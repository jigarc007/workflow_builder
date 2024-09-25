import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CsvState {
  data: any;
}

const initialState: CsvState = {
  data: {},
};

const TransactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    storeFilterData: (state, action: PayloadAction<any>) => {
      state.data.filter = {...state.data,...action.payload};
    },
    storeMapData: (state, action: PayloadAction<any>) => {
      state.data.map = {...state.data,...action.payload};
    },
    storeFindData: (state, action: PayloadAction<any>) => {
      state.data.find = {...state.data,...action.payload};
    },
    storeReduceData: (state, action: PayloadAction<any>) => {
      state.data.reduce = {...state.data,...action.payload};

    },
    storeSortData: (state, action: PayloadAction<any>) => {
      state.data.sort = {...state.data,...action.payload};

    },
  },
});

export const { storeFilterData,storeFindData,storeMapData,storeReduceData,storeSortData } = TransactionSlice.actions;
export default TransactionSlice.reducer;
