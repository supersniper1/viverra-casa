import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { TestActions } from "@store/slices/test/test.slice";
import { WidgetsActions } from "@store/slices/widgets/widgets.slice";
import { ModalActions } from "@store/slices/modal/modal.slice";
import { DesktopActions } from "@/store/slices/desktop/desktop.slice";
import { FoldersActions } from "@/store/slices/folders/folders.slice";

const AllActions = {
  ...TestActions,
  ...WidgetsActions,
  ...ModalActions,
  ...DesktopActions,
  ...FoldersActions,
};

export const useActions = () => bindActionCreators(AllActions, useDispatch());
