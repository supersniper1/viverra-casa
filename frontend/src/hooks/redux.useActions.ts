import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { TestActions } from "@store/slices/test/test.slice";

const AllActions = {
  ...TestActions,
};

export const useActions = () => bindActionCreators(AllActions, useDispatch());
