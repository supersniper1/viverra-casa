import React, { FunctionComponent, useState } from "react";
import s from "./sidebar.module.scss";
import { Icons } from "@assets/components/export";
import { useTypedSelector } from "@/hooks/redux.useTypedSelector";
import { useActions } from "@/hooks/redux.useActions";
import cn from "classnames";
import "./ReactToastify.css";
import { socket } from "@/api/ws/socket";
import { IDesktop } from "@/store/slices/desktop/desktop.slice";
import { IWidgetsSlice } from "@/store/slices/widgets/widgets.slice";
import { toast, ToastContainer } from "react-toastify";

export const Sidebar: FunctionComponent = () => {
  const [editName, setEditName] = useState<string | undefined>(undefined);
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const [minimized, setMinimized] = useState<boolean>(true);

  const desktops = useTypedSelector((state) => state.Desktop.all_desktops);
  const activeDesktop = useTypedSelector((state) => state.Desktop.active);
  const queue = useTypedSelector((state) => state.Desktop.remove_queue);

  const {
    SetActive,
    SetDesktops,
    SetColor,
    Logout,
    WidgetsRefreshList,
    SetQueue,
    UndoDeleteDesktop,
    DeleteDesktop,
  } = useActions();

  const getDesktops = () => {
    socket.emit("get_all_desktops", null);
    socket.on("get_all_desktops_answer", (message: any) => {
      SetDesktops(message);
    });
  };

  const addDesktop = (name: string) => {
    socket.emit("post_desktop", { desktop_name: name });
    getDesktops();
  };

  const updateDesktopName = (desktop: IDesktop) => {
    socket.emit("update_desktop", desktop);
    setEditName(undefined);
    getDesktops();
  };

  const deleteDesktop = (desktop: IDesktop) => {
    SetQueue(desktop);
    toast(<Undo onUndo={() => UndoDeleteDesktop(desktop)} />, {
      onClose: () => {
        queue.map((element) => {
          DeleteDesktop(desktop.uuid);
          socket.emit("delete_desktop", { uuid: element.uuid });
          getDesktops();
        });
      },
    });
  };

  if (minimized) {
    return (
      <div onClick={() => setMinimized(false)} className={s.Minimized}>
        <div className={s.Top}>
          <h1 className={cn(s.Logo, s.CenterItem)}>V</h1>
          <div className={s.MinimizedDesktops}>
            {desktops.map((desktop, index) => (
              <div
                key={desktop.uuid}
                className={cn(
                  s.MinimizedDesktop,
                  desktop.uuid === activeDesktop.uuid && s.ActiveDesktop
                )}
              >
                <div className={s.MinimizedDesktop}>
                  <Icons.Desktop index={index} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={s.Bottom}>
          <button className={cn(s.ProfileManageButton, s.CenterItem)}>
            <Icons.User />
          </button>
          <button className={cn(s.ProfileManageButton, s.CenterItem)}>
            <Icons.Theme />
          </button>
          <button className={cn(s.ProfileManageButton, s.CenterItem)}>
            <Icons.Logout />
          </button>
        </div>
        <button
          onClick={() => setMinimized(true)}
          className={s.MinimizeSidebarMinimized}
        >
          <Icons.Arrow />
        </button>
      </div>
    );
  } else {
    return (
      <div className={s.Sidebar}>
        <div className={s.Top}>
          <h1 className={s.Logo}>
            Vivera<span className={s.LogoSecondColor}>.space</span>
          </h1>
          <div>
            {desktops.map((desktop, index) => (
              <div
                key={desktop.uuid}
                className={cn(
                  s.Desktop,
                  desktop.uuid === activeDesktop.uuid && s.ActiveDesktop
                )}
              >
                <div
                  className={s.Desktop}
                  onClick={() => {
                    SetActive(desktop);
                    socket.emit("get_all_widgets", null);
                    socket.on(
                      "get_all_widgets_answer",
                      (message: IWidgetsSlice) => {
                        WidgetsRefreshList(message);
                      }
                    );
                  }}
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
                    <p className={s.OverflowEclipsis}>{desktop.desktop_name}</p>
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
                      deleteDesktop(desktop);
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
              <p className={s.OverflowEclipsis}>Create new desktop</p>
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
            <p className={s.OverflowEclipsis}>Profile</p>
          </button>
          <button className={s.ProfileManageButton}>
            <Icons.Theme />
            <p className={s.OverflowEclipsis}>Dark Theme</p>
          </button>
          <button
            className={s.ProfileManageButton}
            onClick={() => {
              localStorage.clear();
              Logout();
            }}
          >
            <Icons.Logout />
            <p className={s.OverflowEclipsis}>Log out</p>
          </button>
        </div>
        <button
          onClick={() => setMinimized(true)}
          className={s.MinimizeSidebar}
        >
          <Icons.Arrow />
        </button>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          closeButton={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    );
  }
};

const Undo: FunctionComponent<any> = ({ onUndo, closeToast }) => {
  const handleClick = () => {
    onUndo();
    closeToast();
  };

  return (
    <div>
      <h3 className={s.ToastUndo}>
        Space deleted <button className={s.ToastUndoButton} onClick={handleClick}>Undo</button>
      </h3>
    </div>
  );
};
