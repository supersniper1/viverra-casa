import React, { FunctionComponent } from "react";
import s from "./add-widget-modal.module.scss";
import { Icons } from "@/assets/components/export";
import { useTypedSelector } from "@hooks/redux.useTypedSelector";
import { useActions } from "@hooks/redux.useActions";
import { socket } from "@api/ws/socket";

export const AddWidgetModal: FunctionComponent = () => {
  const modalState = useTypedSelector((state) => state.Modal.add_widget);
  const activeDesktop = useTypedSelector((state) => state.Desktop.active);

  const { AddWidgetClose, WidgetsRefreshList } = useActions();

  const notesObj = {
    widget_tag: "note",
    widget_x: 9,
    widget_y: 8,
    widget_size_x: 200,
    widget_size_y: 200,
    z_index: 1,
    is_collapsed: false,
    text: "test text",
    resourcetype: "WidgetsNoteModel",
    desktop: activeDesktop.uuid,
  };

  const postWidget = () => {
    socket.emit("post_widget", notesObj);
    socket.emit("get_all_widgets", null);
    socket.on("get_all_widgets_answer", (message: []) => {
      WidgetsRefreshList(message);
    });
  };

  return (
    <div
      className={modalState ? s.Background : `${s.Hidden} ${s.Background}`}
      onClick={() => AddWidgetClose()}
    >
      <div className={s.ModalWindow} onClick={(e) => e.stopPropagation()}>
        <h3 className={s.Tittle}>Add a new widget</h3>
        <div className={s.WidgetSelection}>
          <div>
            <div className={s.WidgetCell}>
              <Icons.NotesWidget />
              <div className={s.TittleAndDescription}>
                <h5 className={s.WidgetCellTittle}>Notes</h5>
                <p className={s.WidgetCellDescription}>
                  Widget for creating simple and clear notes.
                </p>
              </div>
              <button className={s.Button} onClick={postWidget}>
                <span className={s.ButtonText}>Try it out</span>
              </button>
            </div>
          </div>
          <div className={s.Line}></div>
          <div>
            <div className={s.WidgetCell}>
              <Icons.DiscordWidget />
              <div className={s.TittleAndDescription}>
                <h5 className={s.WidgetCellTittle}>Discord Reader</h5>
                <p className={s.WidgetCellDescription}>
                  Read the chats and have fun.
                </p>
              </div>
              <button className={s.Button}>
                <span className={s.ButtonText}>Try it out</span>
              </button>
            </div>
          </div>
          <div className={s.Line}></div>
          <div>
            <div className={s.WidgetCell}>
              <Icons.TwitterWidget />
              <div className={s.TittleAndDescription}>
                <h5 className={s.WidgetCellTittle}>Twitter Reader</h5>
                <p className={s.WidgetCellDescription}>
                  Track users and get the news first.
                </p>
              </div>
              <button className={s.Button}>
                <span className={s.ButtonText}>Try it out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
