import React, {FunctionComponent} from 'react';
import s from './login-modal.module.scss';
import {Links} from "@assets/links/links";
import { Icons } from '@/assets/components/export';
import {useTypedSelector} from "@hooks/redux.useTypedSelector";

export const LoginModal: FunctionComponent = () => {
  const login = useTypedSelector((state) => state.Modal.login)

  return (
    <div className={login ? `${s.Hidden} ${s.Background}` : s.Background}>
      <div className={s.ModalWindow}>
        <h3 className={s.Logo}>Vivera<span className={s.LogoSecondColor}>.space</span></h3>
        <p className={s.Description}>Welcome to our space. To start using, go through authorization</p>
        <button onClick={() => window.location.replace(Links.DiscordAuth)} className={s.Button}>
          <Icons.DiscordLogo/>
          <p className={s.ButtonText}>Continue with Discord</p>
        </button>
      </div>
    </div>
  );
};
