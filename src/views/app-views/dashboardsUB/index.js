import React, { Suspense } from "react";
import { Route, Switch } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';
import SalesDash from './sales';
import UserDash from './sale';
const Dashboards = ({ match, systemData }) => {
  return(
  <Suspense fallback={<Loading cover="content"/>}>
    <Switch>
      <Route path={`${match}`} render={() => (systemData.userData.role === "Admin" || systemData.userData.role === "System Admin") ? <SalesDash systemData={systemData}/> : <UserDash systemData={systemData}/>} />
      {/* <Route path={`${match.url}/sales`} component={lazy(() => import(`./sales`))} />
      <Route path={`${match}`} render={ () => (systemData.userData.role === "Admin" || systemData.userData.role === "System Admin") ? (<SalesComp systemData={systemData}/>) : (<UserComp systemData={systemData}/>) } /> */}
    </Switch>
  </Suspense>
)};

export default Dashboards;