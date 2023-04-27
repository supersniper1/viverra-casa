import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { TestActions } from "@store/slices/test/test.slice";
import {WidgetsActions} from "@store/slices/widgets/widgets.slice";
import {LoginModalActions} from "@store/slices/login-modal/loginModal";

const AllActions = {
  ...TestActions,
  ...WidgetsActions,
  ...LoginModalActions,
};

export const useActions = () => bindActionCreators(AllActions, useDispatch());
