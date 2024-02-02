import _ from "lodash";
import Header from "../components/common/Header";
import React, { useEffect, useState } from "react";
import { IonContent, IonPage } from "@ionic/react";
import { errorToast, getRendersCount } from "../apis";
import { RenderResponse_ShowCountRenders } from "@com.xcodeclazz/address-table-server";

const Home: React.FC<{}> = (props) => {
  const [renders, setRenders] = useState<RenderResponse_ShowCountRenders>();
  useEffect(() => getRendersCount((response) => setRenders({ state: response.data.state }), errorToast), []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      return event.returnValue = 'Are you sure you want to leave?';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <IonPage>
      <Header themeBtn logoutIcon dashboardIcon />
      <IonContent fullscreen className="ion-padding">
        <h1>Compilers List</h1>
        <ul>
          {_.map(renders?.state, (el, idx) => (
            <li key={idx}>
              {el?._id} - {el.count}
            </li>
          ))}
        </ul>
      </IonContent>
    </IonPage>
  );
};

export default Home;
