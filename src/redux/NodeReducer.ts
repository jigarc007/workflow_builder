import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface nodesState {
  data: any;
}

const initialState: nodesState = {
  data: [],
};

const nodeSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    storeNodesData: (state, action: PayloadAction<any>) => {
        console.log('storeNodesData:>',action.payload)
      state.data = action.payload;
    },
  },
});

export const { storeNodesData } = nodeSlice.actions;
export default nodeSlice.reducer;
