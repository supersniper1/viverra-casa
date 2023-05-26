import React, { FunctionComponent, useMemo } from "react";
import { Component } from "@components/export.components";
import { socket } from "@/api/ws/socket";
import { useActions } from "@hooks/redux.useActions";
import s from "./main.module.scss";
import { IWidgetsSlice } from "@/store/slices/widgets/widgets.slice";
import { IFolders } from "@/store/slices/folders/folders.slice";

export const Main: FunctionComponent = () => {
  const {
    WidgetsRefreshList,
    Logout,
    Login,
    SetDesktops,
    SetActive,
    SetFolders,
  } = useActions();

  useMemo(() => {
    if (localStorage.getItem("access-token")) {
      socket.connect();
      socket.on("connect", () => {
        console.log("connect");
        Login();
      });
      socket.emit("get_all_widgets", null);
      socket.emit("get_all_folders", null);
      socket.emit("get_all_desktops", null);
      socket.on("message", (message: any) => {
        console.log(message);
      });
      socket.on("error", (error: any) => {
        console.log(error);
        localStorage.clear();
        Logout();
      });
      socket.on("get_all_widgets_answer", (message: IWidgetsSlice) => {
        WidgetsRefreshList(message);
      });
      socket.on("get_all_folders_answer", (message: IFolders) => {
        SetFolders(message);
      });
      socket.on("get_all_desktops_answer", (message: any) => {
        SetDesktops(message);
        SetActive(message[0].uuid);
      });
    }
  }, []);

  return (
    <div className={s.Main}>
      <Component.Sidebar />
      <Component.Workspace />
    </div>
  );
};
