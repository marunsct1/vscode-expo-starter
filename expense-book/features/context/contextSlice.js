import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
  friends : [],
  expenses :[],
  expense_id: [],
  groups:[],
  group_images: [],
  totalExpenses: {},
}

export const fetchContext = createSlice({
  name: 'context',
  initialState,
  reducers: {
    setUser: (state, action) => {
        state.user = action.payload;
        console.log("user in slice", state.user.userId);
    },
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
    setTotalExpenses: (state, action) => {
      state.totalExpenses = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const {setExpenses, setFriends, setTotalExpenses, setUser } = fetchContext.actions

export default fetchContext.reducer