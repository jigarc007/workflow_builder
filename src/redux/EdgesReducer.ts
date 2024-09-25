import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EdgesState {
  data: any;
}

const initialState: EdgesState = {
  data: [],
};

const edgeSlice = createSlice({
  name: 'edges',
  initialState,
  reducers: {
    storeEdgesData: (state, action: PayloadAction<any>) => {
      console.log('storeEdgesData:>',action.payload)
      state.data = action.payload;
    },
  },
});

export const { storeEdgesData } = edgeSlice.actions;
export default edgeSlice.reducer;
