import React, {FunctionComponent} from 'react';
import s from './sidebar.module.scss'
import {Icons} from '@assets/components/export'

export const Sidebar: FunctionComponent = () => {

  return (
    <div className={s.Sidebar}>
      <div className={s.Top}>
        <h1 className={s.Logo}>Vivera<span className={s.LogoSecondColor}>.space</span></h1>
        <div>
          <div>
            <p>Main</p>
            <button><Icons.Edit/></button>
            <button><Icons.Trash/></button>
          </div>
        </div>
      </div>
      <div className={s.Bottom}>
        <h1 className={s.Logo}>Vivera<span className={s.LogoSecondColor}>.space</span></h1>
      </div>
    </div>
  )
};
