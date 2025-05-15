import { configureStore } from '@reduxjs/toolkit';
import contextReducer from '../features/context/contextSlice';

export const store = configureStore({
  reducer: {
    context: contextReducer,
  },
});

// Export RootState and AppDispatch for use in your app
export const RootState = store.getState;
export const AppDispatch = store.dispatch;