import _ from "lodash";
import { useHistory } from 'react-router';
import { socket } from '../utils/SocketIO';
import { Haptics } from '@capacitor/haptics';
import { useDispatch, useSelector } from 'react-redux';
import React, { useContext, useEffect, useState } from 'react';
import { IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

// import { getPostById } from "../apis";
import { Resizer } from "../components/Resizer";
import { toggleDark, isDark } from "../utils/common/helper";
import { setPreference, PREFERENCE_KEYS } from '../utils/common/cache';

import config from "../release/config";
import Capacitor from '../utils/Capacitor';
import AuthState from '../utils/common/auth-state';
import ApplicationContext from '../data/application-context';

import Sound from '../sfxs';
import WinFx from '../sfxs/mixkit-win-game';
import LooseFx from '../sfxs/mixkit-lose-game';

import './Home.css';

const screen = { width: 0, name: 'sm' };
const Home: React.FC<{
  onShowTabs: () => void;
  onHideTabs: () => void;
  rendering: boolean;
}> = props => {
  const history = useHistory();
  const dispatch = useDispatch();
  const authState = new AuthState();
  const applicationCtx = useContext(ApplicationContext);
  const user: {} = useSelector((state: any) => state.userState.user);
  const [post, setPost] = useState<any>({});

  useEffect(() => { if (props.rendering) { props.onShowTabs(); } });
  useEffect(() => {
    socket.connect();

    function onConnect() {
      console.log('connected');
    }

    function onDisconnect() {}

    socket.emit("message", "working");

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const breakPointTrigger = (width: number | undefined, name: string | undefined) => {
    screen.width = width as number;
    screen.name = name as string;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
          <IonButtons slot="end">
            <IonButton disabled>
              v{config.latest_release_version}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <Resizer onChange={breakPointTrigger} />
      <IonContent fullscreen>
        <div className="flex flex-col space-y-5">
          <IonButton routerLink="/settings">Settings</IonButton>
          <IonButton onClick={() => { Haptics.vibrate({ duration: 1000 }); }}>Vibrate</IonButton>
          <IonButton onClick={() => { Sound(WinFx); }}>Win</IonButton>
          <IonButton onClick={() => { Sound(LooseFx); }}>Lose</IonButton>
          <IonButton onClick={() => { toggleDark(); setPreference(PREFERENCE_KEYS.DARK_MODE, `${isDark()}`); }}>Change Theme</IonButton>
          <IonButton onClick={() => { Capacitor.toast('Toast'); }}>Toast</IonButton>
          {/* <IonButton onClick={() => { getPostById(1, setPost, console.error); }}>Fetch Post</IonButton> */}
          <div>{JSON.stringify(post?.data)}</div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
