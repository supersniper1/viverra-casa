import { createSlice } from "@reduxjs/toolkit";

export interface IFolders {
  all_folders: IFolder[];
}

export interface IFolder {
  uuid: string;
  folder_name: string;
  desktop: string;
}

const initialState: IFolders = {
  all_folders: [],
};

export const FoldersSlice = createSlice({
  name: "Folders",
  initialState,
  reducers: {
    SetFolders: (state, action) => {
      state.all_folders = action.payload;
    },
  },
});

export const FoldersReducer = FoldersSlice.reducer;
export const FoldersActions = FoldersSlice.actions;
