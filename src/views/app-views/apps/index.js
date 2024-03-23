import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';

const Apps = ({ match, systemData }) => {
  const EmployeesComp = lazy(() => import(`./employees`));
  const ExpensesComp = lazy(() => import(`./expenses`));
  const ProductsComp = lazy(() => import(`./products`));
  const SalesComp = lazy(() => import(`./sales`));
  const PurchasesComp = lazy(() => import(`./purchases`));
  const RefillComp = lazy(() => import(`./refill`));
  const ReportComp = lazy(() => import(`./report`));
  const SalesReportComp = lazy(() => import(`./salesReport`));
  const DailyReportComp = lazy(() => import(`./dailyReport`));
  const RefundComp = lazy(() => import(`./refund`));
  const QuantityComp = lazy(() => import(`./quantity`));
  const ShopQuantityComp = lazy(() => import(`./shopQuantity`));
  const ShopComp = lazy(() => import(`./shop`));
  const DamagedComp = lazy(() => import(`./damaged`));
  const CreditsComp = lazy(() => import(`./credits`));
  const OutstandingComp = lazy(() => import(`./outstanding`));
  const OthersComp = lazy(() => import(`./others`));
  const SysSettingsComp = lazy(() => import(`./syssettings`));
  const SettingComp = lazy(() => import(`./setting`));
  const SettingsComp = lazy(() => import(`./settings`));
  const StoresComp = lazy(() => import(`./stores`));
  const SuppliersComp = lazy(() => import(`./suppliers`));
  const FaqComp = lazy(() => import(`./faq`));
  return (
    <Suspense fallback={<Loading cover="content"/>}>
      <Switch>
        <Route path={`${match}/employees`} render={ () => (<EmployeesComp systemData={systemData} match={`${match}/employees`}/>) }/>
        <Route path={`${match}/expenses`} render={ () => (<ExpensesComp systemData={systemData} match={`${match}/expenses`}/>) }/>
        <Route path={`${match}/products`} render={ () => (<ProductsComp systemData={systemData} match={`${match}/products`}/>) }/>
        <Route path={`${match}/profile`} component={lazy(() => import(`./profile`))} />
        <Route path={`${match}/sales`} render={ () => (<SalesComp systemData={systemData} match={`${match}/sales`}/>) }/>
        <Route path={`${match}/purchases`} render={ () => (<PurchasesComp systemData={systemData} match={`${match}/purchases`}/>) }/>
        <Route path={`${match}/refill`} render={ () => (<RefillComp systemData={systemData} match={`${match}/refill`}/>) }/>
        <Route path={`${match}/report`} render={ () => (<ReportComp systemData={systemData} match={`${match}/report`}/>) }/>
        <Route path={`${match}/salesReport`} render={ () => (<SalesReportComp systemData={systemData} match={`${match}/salesReport`}/>) }/>
        <Route path={`${match}/dailyReport`} render={ () => (<DailyReportComp systemData={systemData} match={`${match}/dailyReport`}/>) }/>
        <Route path={`${match}/refunds`} render={ () => (<RefundComp systemData={systemData} match={`${match}/refunds`}/>) }/>
        <Route path={`${match}/damaged`} render={ () => (<DamagedComp systemData={systemData} match={`${match}/damaged`}/>) }/>
        <Route path={`${match}/credits`} render={ () => (<CreditsComp systemData={systemData} match={`${match}/credits`}/>) }/>
        <Route path={`${match}/outStanding`} render={ () => (<OutstandingComp systemData={systemData} match={`${match}/outStanding`}/>) }/>
        <Route path={`${match}/others`} render={ () => (<OthersComp systemData={systemData} match={`${match}/others`}/>) }/>
        <Route path={`${match}/quantity`} render={ () => (<QuantityComp systemData={systemData} match={`${match}/quantity`}/>) }/>
        <Route path={`${match}/shopQuantity`} render={ () => (<ShopQuantityComp systemData={systemData} match={`${match}/shopQuantity`}/>) }/>
        <Route path={`${match}/shop`} render={ () => (<ShopComp systemData={systemData} match={`${match}/shop`}/>) }/>
        <Route path={`${match}/extra`} render={ () => (<SettingsComp systemData={systemData} match={`${match}/extra`}/>) }/>
        <Route path={`${match}/systemSettings`} render={ () => (<SysSettingsComp systemData={systemData} match={`${match}/systemSettings`}/>) }/>
        <Route path={`${match}/setting`} render={ () => (<SettingComp systemData={systemData} match={`${match}/setting`}/>) }/>
        <Route path={`${match}/stores`} render={ () => (<StoresComp systemData={systemData} match={`${match}/stores`}/>) }/>
        <Route path={`${match}/suppliers`} render={ () => (<SuppliersComp systemData={systemData} match={`${match}/suppliers`}/>) }/>
        <Route path={`${match}/faq`} render={ () => (<FaqComp systemData={systemData} match={`${match}/faq`}/>) }/>
        <Redirect from={`${match}`} to={`${match}/employees`} />
      </Switch>
    </Suspense>
  );
}
export default Apps;