import React from 'react';
import {
  Redirect, Route,
  Switch,
  useLocation,
  BrowserRouter
} from 'react-router-dom';
import Admin from './components/Admin';
import Auth from './components/Auth';
import Main from './components/Main';
import constants from './utils/constants';

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path={constants.ROUTES.DASHBOARD}
          component={Main}
        />
        <Route
          path={constants.ROUTES.AUTH}
          component={Auth}
        />
        <Route
          path={constants.ROUTES.ADMIN}
          component={Admin}
        />
      </Switch>
      <Redirect path='/' to={constants.ROUTES.DASHBOARD} />
    </BrowserRouter>
  );
}

export default Router;
