import React, { FunctionComponent, useState } from "react";
import s from "./sidebar.module.scss";
import { Icons } from "@assets/components/export";
import { useTypedSelector } from "@/hooks/redux.useTypedSelector";
import { useActions } from "@/hooks/redux.useActions";
import cn from "classnames"
import { socket } from "@/api/ws/socket";
import { IDesktop } from "@/store/slices/desktop/desktop.slice";

export const Sidebar: FunctionComponent = () => {
  const [editName, setEditName] = useState<string | undefined>(undefined);
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);

  const desktops = useTypedSelector((state) => state.Desktop.all_desktops);
  const activeDesktop = useTypedSelector((state) => state.Desktop.active);

  const { SetActive, SetDesktops, SetColor, Logout } = useActions();

  console.log(desktops)

  const getDesktops = () => {
    socket.emit("get_all_desktops", null);
    socket.on("get_all_desktops_answer", (message: any) => {
      SetDesktops(message);
    });
  }

  const addDesktop = (name: string) => {
    socket.emit("post_desktop", {"desktop_name": name})
    getDesktops()
  }

  const deleteDesktop = (id: string) => {
    socket.emit("delete_desktop", {"uuid": id})
    getDesktops()
  }

  const updateDesktopName = (desktop: IDesktop) => {
    socket.emit("update_desktop", desktop)
    setEditName(undefined);
    getDesktops()
  }

  return (
    <div className={s.Sidebar}>
      <div className={s.Top}>
        <h1 className={s.Logo}>
          Vivera<span className={s.LogoSecondColor}>.space</span>
        </h1>
        <div>
          {desktops.map((desktop, index) => (
            <div key={desktop.uuid} className={cn(s.Desktop, desktop.uuid === activeDesktop && s.ActiveDesktop)}>
              <div
                className={s.Desktop}
                onClick={() => SetActive(desktop.uuid)}
              >
                <Icons.Desktop index={index} />
                {desktop.uuid === editName ? (
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={(e) => {
                      updateDesktopName({
                        ...desktop,
                        desktop_name: e.target.value,
                      });
                
                    }}
                  />
                ) : (
                  <p>{desktop.desktop_name}</p>
                )}
              </div>
              <div className={s.DesktopButtons}>
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
                  }}
                >
                  <Icons.Trash />
                </button>
              </div>
            </div>
          ))}
          <button
            className={s.Desktop}
            onClick={() => {
              addDesktop(`desktop ${desktops.length + 1}`);
            }}
          >
            <Icons.CreateDesktop />
            <p>Create new desktop</p>
          </button>
        </div>
      </div>
      <div className={s.Bottom}>
        <div className={s.Colors}>
          <button
            className={s.ColorWhite}
            onClick={() => SetColor("white")}
          ></button>
          <button
            className={s.ColorLightPink}
            onClick={() => SetColor("light-pink")}
          ></button>
          <button
            className={s.ColorPink}
            onClick={() => SetColor("pink")}
          ></button>
        </div>
        <button className={s.ProfileManageButton}>
          <Icons.User />
          <p>Profile</p>
        </button>
        <button className={s.ProfileManageButton}>
          <Icons.Theme />
          <p>Dark Theme</p>
        </button>
        <button
          className={s.ProfileManageButton}
          onClick={() => {
            localStorage.clear();
            Logout();
          }}
        >
          <Icons.Logout />
          <p>Log out</p>
        </button>
      </div>
    </div>
  );
};
