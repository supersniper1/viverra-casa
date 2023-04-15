import React, {FunctionComponent} from 'react';
import {useTypedSelector} from "@hooks/redux.useTypedSelector";
import {Component} from "@components/export.components";

export const Workspace: FunctionComponent = () => {
  const widgets = useTypedSelector((state) => state.Widgets.all_widgets)

  console.log(widgets)

  return (
    <div>
      {widgets.map((widget) => (
        <div>
          <div>aaaa</div>
          {widget.widget_tag === 'note' && (
            <Component.Notes widget={widget}/>
          )}
        </div>
      ))}
    </div>
  )
}