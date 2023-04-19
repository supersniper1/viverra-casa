import React, {FunctionComponent} from 'react';
import {useTypedSelector} from "@hooks/redux.useTypedSelector";
import {Component} from "@components/export.components";
import s from "./workspace.module.scss"

export const Workspace: FunctionComponent = () => {
  const widgets = useTypedSelector((state) => state.Widgets.all_widgets)

  console.log(widgets)

  return (
    <div className={s.workspace}>
      {widgets.map((widget) => (
        <div>
          {widget.widget_tag === 'note' && (
            <Component.Notes key={widget.widget_uuid} widget={widget}/>
          )}
        </div>
      ))}
    </div>
  )
}