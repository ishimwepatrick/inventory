import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AppLayout from "layouts/app-layout";
import AuthLayout from 'layouts/auth-layout';
import AppLocale from "lang";
import { IntlProvider } from "react-intl";
import { ConfigProvider } from 'antd';
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from 'configs/AppConfig'
import useBodyClass from 'hooks/useBodyClass';

function RouteInterceptor({ children, isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: AUTH_PREFIX_PATH,
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export const Views = (props) => {
  const { locale, token, location, direction, userData } = props;
  const currentAppLocale = AppLocale[locale];
  useBodyClass(`dir-${direction}`);
  return (
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}>
      <ConfigProvider locale={currentAppLocale.antd} direction={direction}>
        <Switch>
          <Route exact path="/">
            <Redirect to={APP_PREFIX_PATH} />
          </Route>
          <Route path={AUTH_PREFIX_PATH}>
            <AuthLayout direction={direction} />
          </Route>
          <RouteInterceptor path={APP_PREFIX_PATH} isAuthenticated={token}>
            <AppLayout direction={direction} location={location} userData={userData}/>
          </RouteInterceptor>
        </Switch>
      </ConfigProvider>
    </IntlProvider>
  )
}


const mapStateToProps = ({ theme, auth }) => {
  const { locale, direction } =  theme;
  const { token, userData } = auth;
  return { locale, direction, token, userData }
};

export default withRouter(connect(mapStateToProps)(Views));