import { configureStore } from '@reduxjs/toolkit';
import csvReducer from './csvSlice';
import nodeReducer from './NodeReducer';
import edgeReducer from './EdgesReducer';
import transactionReducer from './TransactionReducer';
export const store = configureStore({
  reducer: {
    csv: csvReducer,
    nodes: nodeReducer,
    edges: edgeReducer,
    transaction: transactionReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
