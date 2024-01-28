import _ from 'lodash';
import React from "react";
import { useHistory } from "react-router";
import { Dialog } from "@capacitor/dialog";
import { errorToast, postLogout } from "../../apis";
import AuthState from "../../utils/common/auth-state";
import { isDark, toggleDark } from '../../utils/common/helper';
import { PREFERENCE_KEYS, setPreference } from '../../utils/common/cache';
import { compassOutline, logOutOutline, moonOutline, settingsOutline } from "ionicons/icons";
import {
  IonIcon,
  IonTitle,
  IonButton,
  IonHeader,
  IonButtons,
  IonToolbar,
  IonBackButton,
} from "@ionic/react";

const Header: React.FC<{
  dashboardIcon?: boolean;
  settingIcon?: boolean;
  logoutIcon?: boolean;
  themeBtn?: boolean;
  backBtn?: string;
}> = (props) => {
  const history = useHistory();
  const authState = new AuthState();

  const cleanup = () => {
    authState.saveUser(null);
    authState.saveToken("");
    history.replace("/login");
  };

  const onLogoutHandler = async () => {
    const { value: yes } = await Dialog.confirm({
      title: "Logout",
      message: "Do you really want to logout from the application?",
    });
    if (yes) {
      postLogout((__) => cleanup(), (error) => {
        errorToast(error);
        cleanup();
      });
    }
  };

  return (
    <IonHeader>
      <IonToolbar>
        {props.backBtn && <IonButtons slot="start" className='md:hidden'>
          <IonBackButton defaultHref={props.backBtn}></IonBackButton>
        </IonButtons>}
        <IonTitle className="cursor-pointer" onClick={e => history.push("/")}>
          <strong className="text-yellow-500">x</strong><strong>CodeClazz</strong>
        </IonTitle>
        <IonButtons slot="end">
          {authState.validateUser() ? 
            (
              <>
                {props.logoutIcon && <IonButton routerDirection="none" onClick={onLogoutHandler}>
                  <IonIcon slot="icon-only" icon={logOutOutline} />
                </IonButton>}
                {props.dashboardIcon && <IonButton routerDirection="none" routerLink="/dashboard">
                  <IonIcon slot="icon-only" icon={compassOutline} />
                </IonButton>}
              </>
            ) : (
              <>
                <IonButton routerDirection="none" routerLink="/login">Login</IonButton>
                <IonButton routerDirection="none" routerLink="/register">Register</IonButton>
              </>
            )}
          {props.themeBtn && (<IonButton title="theme" onClick={e => { toggleDark(); setPreference(PREFERENCE_KEYS.DARK_MODE, `${isDark()}`); }}>
            <IonIcon slot="icon-only" icon={moonOutline} />
          </IonButton>)}
          {props.settingIcon && <IonButton routerDirection="none" routerLink="/settings">
            <IonIcon slot="icon-only" icon={settingsOutline} />
          </IonButton>}
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
