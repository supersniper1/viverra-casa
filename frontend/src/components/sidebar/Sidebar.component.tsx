import React, { FunctionComponent, useState } from "react";
import s from "./sidebar.module.scss";
import { Icons } from "@assets/components/export";
import { useTypedSelector } from "@/hooks/redux.useTypedSelector";
import { useActions } from "@/hooks/redux.useActions";
import { addDesktop } from "@/api/fetch/post";
import { getDesktops } from "@/api/fetch/get";
import { deleteDesktop } from "@/api/fetch/delete";
import { updateDesktopName } from "@/api/fetch/patch";

export const Sidebar: FunctionComponent = () => {
  const [editName, setEditName] = useState<string | undefined>(undefined);
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);

  const desktops = useTypedSelector((state) => state.Desktop.all_desktops);

  const { SetActive, SetDesktops } = useActions();

  return (
    <div className={s.Sidebar}>
      <div className={s.Top}>
        <h1 className={s.Logo}>
          Vivera<span className={s.LogoSecondColor}>.space</span>
        </h1>
        <div>
          {desktops.map((desktop, index) => (
            <div key={desktop.uuid} className={s.Desktop}>
              <div onClick={() => SetActive(desktop.uuid)}>
                <Icons.Desktop index={index} />
                {desktop.uuid === editName ? (
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={(e) => {
                      updateDesktopName(desktop.uuid, e.target.value)
                      getDesktops().then((res) => {
                        SetDesktops(res.desktops);
                      });
                      setEditName(undefined)
                    }}
                  />
                ) : (
                  <p>{desktop.desktop_name}</p>
                )}
              </div>
              <button
                onClick={() => {
                  setEditName(desktop.uuid);
                  setInputValue(desktop.desktop_name);
                }}
              >
                <Icons.Edit />
              </button>
              <button
                onClick={() => {
                  deleteDesktop(desktop.uuid);
                  getDesktops().then((res) => {
                    SetDesktops(res.desktops);
                  });
                }}
              >
                <Icons.Trash />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              addDesktop();
              getDesktops().then((res) => {
                SetDesktops(res.desktops);
              });
            }}
          >
            <Icons.CreateDesktop />
            <p>Create new desktop</p>
          </button>
        </div>
      </div>
      <div className={s.Bottom}>
        <div className={s.Colors}>
          <button className={s.ColorWhite}></button>
          <button className={s.ColorLightPink}></button>
          <button className={s.ColorPink}></button>
        </div>
        <button className={s.ProfileManage}>
          <Icons.User />
          <p>Profile</p>
        </button>
        <button className={s.ProfileManage}>
          <Icons.Theme />
          <p>Dark Theme</p>
        </button>
        <button className={s.ProfileManage}>
          <Icons.Logout />
          <p>Log out</p>
        </button>
      </div>
    </div>
  );
};
