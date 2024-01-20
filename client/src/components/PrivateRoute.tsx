import React from "react";
import AuthState from "../utils/common/auth-state";
import { Route, Redirect, RouteProps } from "react-router-dom";

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  shouldAuthenticated: boolean;
  redirect: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  shouldAuthenticated,
  component: Component,
  redirect,
  ...rest
}) => {
  const authState = new AuthState();

  return (
    <Route
      {...rest}
      render={(props) =>
        authState.validateUser() === shouldAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={redirect} />
        )
      }
    />
  );
};

export default PrivateRoute;
