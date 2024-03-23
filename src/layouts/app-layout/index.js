import React from 'react';
import { connect } from 'react-redux';
import SideNav from 'components/layout-components/SideNav';
import TopNav from 'components/layout-components/TopNav';
import Loading from 'components/shared-components/Loading';
import MobileNav from 'components/layout-components/MobileNav'
import HeaderNav from 'components/layout-components/HeaderNav';
import PageHeader from 'components/layout-components/PageHeader';
import Footer from 'components/layout-components/Footer';
import AppViews from 'views/app-views';
import { useCollection } from "react-firebase-hooks/firestore";
import { DataService as BrandService } from "services/brands.service";
import { DataService as CategoryService } from "services/category.service";
import { DataService as CustomersService } from "services/customers.service";
import { DataService as EmployeesService } from "services/employees.service";
import { DataService as MembersService } from "services/members.service";
import { DataService as MoveService } from "services/move.service";
import { DataService as PurchaseService } from "services/purchases.service";
import { DataService as ProductService } from "services/products.service";
import { DataService as SalesService } from "services/sales.service";
import { DataService as StoreService} from "services/stores.service";
import { DataService as SourceService} from "services/source.service";
import { DataService as PenaltyService} from "services/penalty.service";
import { DataService as PenaltiesService} from "services/penalties.service";
import { DataService as PaymentsService} from "services/payments.services";
import { DataService as SettingsService} from "services/settings.service";
import { DataService as ExpensesService} from "services/expenses.service";
import { DataService as SuppliersService} from "services/suppliers.service";
import { DataService as RecordsService } from "services/records.service";

import { DataService as BordersService } from "services/borders.service";
import { DataService as DestinationsService } from "services/destinations.service";

import {
  Layout,
  Grid,
  Tag
} from "antd";

import navigationConfig from "configs/NavigationConfig";
import { 
  SIDE_NAV_WIDTH, 
  SIDE_NAV_COLLAPSED_WIDTH,
  NAV_TYPE_SIDE,
  NAV_TYPE_TOP,
  DIR_RTL,
  DIR_LTR
} from 'constants/ThemeConstant';
import utils from 'utils';
import { useThemeSwitcher } from "react-css-theme-switcher";

const { Content } = Layout;
const { useBreakpoint } = Grid;
export const AppLayout = ({ navCollapsed, navType, location, direction, userData }) => {
  const currentRouteInfo = utils.getRouteInfo(navigationConfig[userData.role], location.pathname)
  const [employees, employeesLoading] = useCollection(EmployeesService.getAll());	
  const [members, membersLoading] = useCollection(MembersService.getAll());	
  const [brands, brandsLoading] = useCollection(BrandService.getAll());	
  const [category, categoryLoading] = useCollection(CategoryService.getAll());	
  const [customers, customersLoading] = useCollection(CustomersService.getAll());	
  const [products, productsLoading] = useCollection(ProductService.getAll());	
  const [sales, salesLoading] = useCollection(SalesService.getAll());	
  const [purchases, purchasesLoading] = useCollection(PurchaseService.getAll());	
  const [move, moveLoading] = useCollection(MoveService.getAll());	
  const [stores, storesLoading] = useCollection(StoreService.getAll());	
  const [records, recordsLoading] = useCollection(SourceService.getAll());	
  const [penalty, penaltyLoading] = useCollection(PenaltyService.getAll());	
  const [penalties, penaltiesLoading] = useCollection(PenaltiesService.getAll());	
  const [payments, paymentsLoading] = useCollection(RecordsService.getAll());	
  const [settings, settingsLoading] = useCollection(SettingsService.getAll());	
  const [expenses, expensesLoading] = useCollection(ExpensesService.getAll());	
  const [suppliers, suppliersLoading] = useCollection(SuppliersService.getAll());	
  const [borders, bordersLoading] = useCollection(BordersService.getAll());	
  const [destinations, destinationsLoading] = useCollection(BordersService.getAll());	
  const [allSales, setAllSales] = React.useState([]);
  const [brand, setBrand] = React.useState([]);
	const [categoriess, setCategories] = React.useState([]);
	const [showSales, setShowSales] = React.useState(true);
	const [showBrand, setShowBrand] = React.useState(true);
	const [showCategory, setShowCategory] = React.useState(true);
  const [setting, setSetting] = React.useState([]);
  const [setsLoading, setSetsLoading] = React.useState(true);
  const screens = utils.getBreakPoint(useBreakpoint());
  const [userLoading, setUserLoading] = React.useState(true);
  const [users, setUsers] = React.useState([]);
  const [shops, setShops] = React.useState([]);
  const [multiShop, setMultiShop] = React.useState(false);
  const [shopsLoading, setShopsLoading] = React.useState(true);
  const isMobile = !screens.includes('lg')
  const isNavSide = navType === NAV_TYPE_SIDE
  const isNavTop = navType === NAV_TYPE_TOP

  const getLayoutGutter = () => {
    if(isNavTop || isMobile) {
      return 0
    }
    return navCollapsed ? SIDE_NAV_COLLAPSED_WIDTH : SIDE_NAV_WIDTH
  }
  
  let brandObserver = BrandService.getAll()
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      BrandService.save(change);
    });
  });

  let categoryObserver = CategoryService.getAll()
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      CategoryService.save(change);
    });
  });

  let customersObserver = CustomersService.getAll()
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      CustomersService.save(change);
    });
  });

  
  let employeesObserver = EmployeesService.getAll()
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      EmployeesService.save(change);
    });
  });

  let productsObserver = ProductService.getAll()
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      ProductService.save(change);
    });
  });
  
  let salesObserver = SalesService.getAll()
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      SalesService.save(change);
    });
  });
  
  let purchaseObserver = PurchaseService.getAll()
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      PurchaseService.save(change);
    });
  });
  
  let moveObserver = MoveService.getAll()
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      MoveService.save(change);
    });
  });
  
  let storeObserver = StoreService.getAll()
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      StoreService.save(change);
    });
  });

  let sourceObserver = SourceService.getAll()
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      SourceService.save(change);
    });
  });

  let suppliersObserver = SuppliersService.getAll()
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      SuppliersService.save(change);
    });
  });

  let settingsObserver = SettingsService.getAll()
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      SettingsService.save(change);
    });
  });

  let expensesObserver = ExpensesService.getAll()
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      ExpensesService.save(change);
    });
  });


  if(!storesLoading && stores.docs.length > 1 && !multiShop){
    setMultiShop(true);
  }
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const today = new Date();
  let todayS = today.getDay();
  todayS = todayS === 0 ? 7 : todayS;
  const mdiff = todayS - 1;
  const sdiff = 7 - todayS;
  const mondy = new Date().setDate(today.getDate()-mdiff);
  const lmondy = new Date().setDate(today.getDate()-(mdiff+7));
  const sundy = new Date().setDate(today.getDate()+sdiff);
  const lsundy = new Date().setDate(today.getDate()+(sdiff-7));
  const categories = [];
  const startDays = [];
  const endsDays = [];
  for(let i = 0; i<7; i++){
    let days = new Date(new Date().setDate(new Date(mondy).getDate()+i));
    let day = days.getDate();
    day = day < 10 ? '0' + day : day ;
    let month = new Date(new Date().setDate(new Date(mondy).getDate()+i)).getMonth();
    startDays.push(days.setHours(0,0,0,0));
    endsDays.push(days.setHours(23,59,59,999));
    categories.push(day + ' ' + monthNames[month]);
  }
  const findSeries = (data) => {
    let result = [];
    for(let i = 0; i < 7; i++){
      let dayTotal = data.filter(x=> x.id >= startDays[i] && x.id <= endsDays[i]).reduce((accumulator, currentElement) => {
        return parseFloat(accumulator) + parseFloat(currentElement.data().amount);
      },0)
      result.push(dayTotal);
    }
    return [{name: 'Weekly Income',data: result}];
  }
  const findMonths = (data) => {
    let lMonth = new Date(data).getMonth();
    let lYear = new Date(data).getFullYear();
    let dates = new Date().getDate();
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    let counter = 0;
    for(let j = lYear; j <= year; j++){
      let limiter = (lYear === year || j === year) ? month : 11;
      let starter = (lYear === year || j === lYear) ? lMonth : 0;
      for(let i = starter; i<= limiter; i++){
        counter += (j === year && i === month && dates < 5) ? 0 : 1;
      }
    }
    return counter;
  }
  let weekly = categories[0].split(" ")[1] === categories[6].split(" ")[1] ? categories[0].split(" ")[0] + ' - ' + categories[6] : categories[0] + ' - ' + categories[6];
	weekly += ', ' + new Date().getFullYear();

  if(!employeesLoading){
	  let allRecords = [];
    let lastUser = '';
    let changes = false;
	  employees.docs.map((doc) => {
      let data = {'name': doc.data().name, 'role': doc.data().userRole, 'profile':doc.data().profile}
		allRecords = {
		  ...allRecords,
		  [doc.data()._id] : {'name': doc.data().name, 'role': doc.data().userRole, 'profile':doc.data().profile},
		}
    lastUser = doc.data()._id;
    changes = !users[lastUser] || users[lastUser].name !== data.name || users[lastUser].role !== data.role || users[lastUser].profile !== data.profile
      ? true : changes;
		return true;
	  })
	  if(changes || (lastUser && (userLoading || !users[lastUser]))){
      setUsers(allRecords)
	  	setUserLoading(false);
	  }
	}

	if(!storesLoading){
	  let allRecords = [];
    let lastStore = '';
    let changes = false;
	  stores.docs.map((doc) => {
      let data = {'name': doc.data().name, 'location': doc.data().location};
      allRecords = {
        ...allRecords,
        [doc.data()._id] : {'name': doc.data().name, 'location': doc.data().location},
      }
      lastStore = doc.data()._id;
      changes = !shops[lastStore] || shops[lastStore].name !== data.name || shops[lastStore].location !== data.location
      ? true : changes;
      return true;
	  })
    if(changes || (lastStore && (shopsLoading || !shops[lastStore]))){
      setShops(allRecords)
	  	setShopsLoading(false);
	  }
	}

  if(!brandsLoading && brands){
		let allRecords = [];
	  let lastBrand = '';
    let changes = false;
		brands.docs.map((doc) => {
		allRecords = {
		  ...allRecords,
		  [doc.data()._id] : {'name': doc.data().name},
		}
		lastBrand = doc.data()._id;
    changes = !brand[lastBrand] || brand[lastBrand].name !== doc.data().name
		? true : changes; 
		return true;
		})
		if(changes || (lastBrand && (showBrand || !brand[lastBrand]))){
			setBrand(allRecords)
			setShowBrand(false);
		}
	}

	if(!categoryLoading){
		let allRecords = [];
	  let lastCategory = '';
    let changes = false;
		category.docs.map((doc) => {
		allRecords = {
		  ...allRecords,
		  [doc.data()._id] : {'name': doc.data().name},
		}
		lastCategory = doc.data()._id;
    changes = !categoriess[lastCategory] || categoriess[lastCategory].name !== doc.data().name
		? true : changes; 
		return true;
		})
		if(changes || (lastCategory && (showCategory || !categoriess[lastCategory]))){
			setCategories(allRecords)
			setShowCategory(false);
		}
	}

  if(!salesLoading){
		let allRecords = [];
	  let lastSale = '';
		sales.docs.map((doc, index) => {
		allRecords = {
		  ...allRecords,
		  [doc.data()._id] : {index},
		}
		lastSale = doc.data()._id;
		return true;
		})
		if(lastSale && (showSales || !allSales[lastSale])){
			setAllSales(allRecords)
			setShowSales(false);
		}
	}

  if(!settingsLoading){
		let allRecords = [];
	  let lastSetting = '';
		let changes = false;
		settings.docs.map((doc) => {
		allRecords = {
		  ...allRecords,
		  [doc.data()._id] : {'value': doc.data().value},
		}
		lastSetting = doc.data()._id;
		changes = !setting[lastSetting] || setting[lastSetting].value !== doc.data().value
		? true : changes; 
		return true;
		})
		if(changes || (lastSetting && (setsLoading || !setting[lastSetting]))){
			setSetting(allRecords)
			setSetsLoading(false);
		}
	}

  const rounder = (testvar) => {
    let holder = testvar + '';
    let result = holder.split('.').length === 1 ? testvar : (parseInt(holder.split('.')[1].slice(0,1)) + Math.round(parseFloat('0.'+holder.split('.')[1].slice(1)))) === 10 ? parseInt(holder.split('.')[0]) + 1 : 
    parseInt(holder.split('.')[0]) + ((parseInt(holder.split('.')[1].slice(0,1)) + Math.round(parseFloat('0.'+holder.split('.')[1].slice(1))))/10);
    return result;        
  }

  const roundPoints = (testvar) => {
    let holder = testvar + '';
    let result = holder.split('.').length === 1 ? testvar : (parseInt(holder.split('.')[1].slice(0,2)) + Math.round(parseFloat('0.'+holder.split('.')[1].slice(2)))) === 100 ? parseInt(holder.split('.')[0]) + 1 : 
    parseInt(holder.split('.')[0]) + ((parseInt(holder.split('.')[1].slice(0,2)) + Math.round(parseFloat('0.'+holder.split('.')[1].slice(2))))/100);
    return result;        
  }

  const getId = (id) => {
    let saleIndex = !showSales ? (allSales[id] ? allSales[id].index : (!salesLoading ? sales.docs.length : 0)) : (!salesLoading ? sales.docs.length : 0);
    let index = parseInt(saleIndex+1)
    index += '';
    let result = '';
    if(index.length < 3){
      for(let i=3; i>index.length; i--){
        result += '0';
      }
    }
    result += index;
    return result;        
  }

  const methodColors = (data) => {
    let colors = {
      'Cash':'cyan',
      'Cheque':'blue',
      'Mobile Money':'gold',
      'Bank Transfer':'magenta',
      'Not Paid':'volcano'
    }
    if(data.payCounter === 0){
      return (
        <Tag color='volcano' key={data._id}>
          Not Paid
        </Tag>
      )
    }
    else{
      for(let i=1; i<=data.payCounter; i++){
        return (<Tag color={colors[data[`method${i}`]]}>
          {data[`method${i}`]}
        </Tag>)
      }
    } 
  }

  const statusColors = (data) => {
    return (
      <Tag color={data.status ? 'green' : 'red'}>
        {data.status ? 'Ready' : 'Not Ready'}
      </Tag>
    )
  }

  const getColor = (total, paid) => {
    if(paid === 0) return 'volcano'
    else if(paid === total) return 'cyan'
    else return 'gold'
  }

  const diff_minutes = (dt2, dt1) =>  
  {
    dt1 = new Date(dt1);
    dt2 = new Date(dt2);
    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
    
  }

  let avatarColors = ['#04d182','#fa8c16','#1890ff','#ffc542','#ff6b72','#f50','#2db7f5','#87d068','#108ee9'];
  let types = ['Pieces', 'Sq Meter', 'Meter', 'Kilogram', 'Packet', 'Dozen'];
  let shortTypes = ['Pcs', 'Sqm', 'M', 'Kg', 'Pkt', 'Dzn'];
  const systemData = {
    users,
    userLoading,
    shops,
    shopsLoading,
    brands,
    brandsLoading,
    brand,
    showBrand,
    category,
    categoryLoading,
    categoriess,
    showCategory,
    customers,
    customersLoading,
    employees,
    employeesLoading,
    members,
    membersLoading,
    products,
    productsLoading,
    sales,
    salesLoading,
    allSales,
    showSales,
    purchases,
    purchasesLoading,
    move,
    moveLoading,
    stores,
    storesLoading,
    records,
    recordsLoading,
    penalty,
    penaltyLoading,
    penalties,
    penaltiesLoading,
    payments,
    paymentsLoading,
    settings,
    settingsLoading,
    setting,
    setsLoading,
    expenses,
    expensesLoading,
    suppliers,
    suppliersLoading,
    userData,
    mondy: new Date(mondy).setHours(0,0,0,0),
    lmondy: new Date(lmondy).setHours(0,0,0,0),
    sundy: new Date(sundy).setHours(23,59,59,999),
    lsundy: new Date(lsundy).setHours(23,59,59,999),
    categories,
    weekly,
    types,
    shortTypes,
    avatarColors,
    borders,
    bordersLoading,
    destinations,
    destinationsLoading,
    diff_minutes,
    methodColors,
    statusColors,
    singleShop: storesLoading ? '' : (stores.docs.length > 0 ? stores.docs[0].id : ''),
    multiShop,
    rounder,
    roundPoints,
    findSeries,
    findMonths,
    getColor,
    getId
  }
  const { status } = useThemeSwitcher();

  if (status === 'loading') {
    return <Loading cover="page" />;
  }

  const getLayoutDirectionGutter = () => {
    if(direction === DIR_LTR) {
      return {paddingLeft: getLayoutGutter()}
    }  
    if(direction === DIR_RTL) {
      return {paddingRight: getLayoutGutter()}
    }
    return {paddingLeft: getLayoutGutter()}
  }
  return (
    <Layout>
      <HeaderNav isMobile={isMobile} userData={userData} systemData={systemData}/>
      {(isNavTop && !isMobile) ? <TopNav routeInfo={currentRouteInfo}/> : null}
      <Layout className="app-container">
        {(isNavSide && !isMobile) ? <SideNav userData={userData} routeInfo={currentRouteInfo}/> : null }
        <Layout className="app-layout" style={getLayoutDirectionGutter()}>
          <div className={`app-content ${isNavTop ? 'layout-top-nav' : ''}`}>
            <PageHeader display={currentRouteInfo?.breadcrumb} title={currentRouteInfo?.title} />
            <Content>
              <AppViews systemData={systemData}/>
            </Content>
          </div>
          <Footer />
        </Layout>
      </Layout>
      {isMobile && <MobileNav userData={userData}/>}
    </Layout>
  )
}

const mapStateToProps = ({ theme }) => {
  const { navCollapsed, navType, locale } =  theme;
  return { navCollapsed, navType, locale }
};

export default connect(mapStateToProps)(React.memo(AppLayout));