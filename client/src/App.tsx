import _ from "lodash";
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PrivateRoute from "./components/PrivateRoute";
import NonPrivateRoute from "./components/NonPrivateRoute";
import { IonReactRouter } from '@ionic/react-router';

import { useSelector } from "react-redux";
import { homeOutline, settingsOutline } from 'ionicons/icons';
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonSpinner, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";

import ApplicationContextProvider from './data/ApplicationContextProvider';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import "./theme/theme.css";

setupIonicReact();

export const currentPath = () => {
  const match = window.location.pathname.match(/^\/[^?#]*/);
  return match ? match[0] : '';
}
export const components = {
  home: {
    path: "/",
    Component: Home,
  },
  login: {
    path: '/login',
    Component: Login
  },
  register: {
    path: '/register',
    Component: Register
  },
  dashboard: {
    path: '/dashboard',
    Component: Dashboard
  },
  settings: {
    path: "/settings",
    Component: Settings,
  },
};
const App: React.FC = () => {
  const tabBarVisible = useSelector((state: any) => state.uiState.tabBarVisible);

  const getRoutes = () => {
    return (
      <IonRouterOutlet id="main-drawer" animated={false}>
        <NonPrivateRoute path={components.login.path} component={components.login.Component} redirect={components.dashboard.path} exact />
        {/* <NonPrivateRoute path={components.register.path} component={components.register.Component} redirect={components.dashboard.path} exact /> */}
        <PrivateRoute path={components.dashboard.path} component={components.dashboard.Component} redirect={components.login.path} exact />

        {/* Open in both case i.e auth, not-auth */}
        <Route path={components.settings.path} component={Settings} exact />
        <Route path={components.home.path} component={Home} exact />
        <Redirect to={components.home.path} />
      </IonRouterOutlet>
    );
  };

  return (
    <IonApp>
      <ApplicationContextProvider>
        <IonReactRouter>
          {getRoutes()}
          <React.Suspense fallback={<IonSpinner />}>
            {tabBarVisible && <IonTabs>
              {getRoutes()}
              <IonTabBar slot="bottom" hidden={!tabBarVisible}>
                <IonTabButton tab="settings" href={components.settings.path}>
                  <IonIcon icon={settingsOutline} />
                  <IonLabel>Settings</IonLabel>
                </IonTabButton>
                {/* make sure that the home or / should be at the bottom always */}
                <IonTabButton tab="home" href={components.home.path}>
                  <IonIcon icon={homeOutline} />
                  <IonLabel>Home</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>}
          </React.Suspense>
        </IonReactRouter>
      </ApplicationContextProvider>
    </IonApp>
  )
};

export default App;
