import React, { useState } from 'react';
import { Menu, Dropdown, Badge, Avatar, List, Button, notification } from 'antd';
import { NotificationSvg } from 'assets/svg/icon';
import { 
  MailOutlined, 
  BellOutlined, 
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import CustomIcon from 'components/util-components/CustomIcon'

const getIcon =  icon => {
  switch (icon) {
    case 'mail':
      return <MailOutlined />;
    case 'alert':
      return <WarningOutlined />;
    case 'check':
      return <CheckCircleOutlined />;
    case 'clock':
      return <ClockCircleOutlined />;
    default:
      return <MailOutlined />;
  }
}

const getNotificationBody = list => {
  return list.length > 0 ?
  <List
    size="small"
    itemLayout="horizontal"
    dataSource={list}
    renderItem={item => (
      <List.Item className="list-clickable">
        <Flex alignItems="center">
          <div className="pr-3">
            {item.img? <Avatar src={`/img/avatars/${item.img}`} /> : <Avatar className={`ant-avatar-${item.type}`} icon={getIcon(item.icon)} />}
          </div>
          <div className="mr-3">
            <span className="font-weight-bold text-dark">{item.name} </span>
            <span className="text-gray-light">{item.desc}</span>
          </div>
          <small className="ml-auto">{item.time}</small>
        </Flex>
      </List.Item>
    )}
  />
  :
  <div className="empty-notification">
    <CustomIcon className="display-3" svg={NotificationSvg}/>
    <p className="mt-3">You have viewed all notifications</p>
  </div>;
}

export const NavNotification = ({systemData}) => {

  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [notified, setNotified] = useState([]);
  const [salesDebt, setSalesDebt] = useState([]);
  const [salesNotif, setSalesNotif] = useState([]);
  const [purchasesDebt, setPurchasesDebt] = useState([]);
  const [purchasesNotif, setPurchasesNotif] = useState([]);
  const [expensesDebt, setExpensesDebt] = useState([]);
  const [expensesNotif, setExpensesNotif] = useState([]);
  const [reset, setReset] = useState(0);
  const [resetId, setResetId] = useState('');
  let {products, productsLoading, records, recordsLoading, sales, salesLoading, purchases, purchasesLoading, expenses, expensesLoading, userData, shortTypes, setting, setsLoading, roundPoints } = systemData;
	records = recordsLoading ? [] : userData.userRole === 'Sales' ? records.docs.filter(x => x.data().refunded === false && x.data().source === userData.userStore) : records.docs.filter(x => x.data().refunded === false) ;
  const handleVisibleChange = (flag) => {
    setVisible(flag);
  }
  const [brandloading, setBrandLoading] = useState(true);   
  const [today] = useState(new Date().setHours(23,59,59,999))
  const handleClear = () =>{
    setData([])
  }
	let productRecords = [];
	let productNotified = [];
	if(!productsLoading && !recordsLoading){
		let allRecords = [];
    let recordsID = [];
		products.docs.filter(x => userData.userRole === 'Sales' ? x.data()[userData.userStore] === true : true).map((doc) => {
			let {pkgUnit,qtyPkg,ctnSqm,productType,safetyType,safetyStock, productName, _id} = doc.data();
			let body = [...records]; 
      let initialStock = 0;
      if(doc.data().usedStore !== undefined){
        doc.data().usedStore.split('**;;@!*.').map(store =>{
          if(userData.userRole === 'Sales' && store !== userData.userStore) {return true}
          let sqmQty = !doc.data()[`${store}sqmStock`] ? 0 : doc.data().productType === '0' ? 0 : ((parseInt(doc.data().productType) > 3 ? parseInt(doc.data()[`${store}sqmStock`] * doc.data().ctnSqm) :(doc.data().pkgUnit === '1' ? parseFloat(doc.data()[`${store}sqmStock`] * (doc.data().qtyPkg/doc.data().ctnSqm)) : parseFloat(doc.data()[`${store}sqmStock`] / doc.data().ctnSqm))));
          return initialStock += sqmQty + doc.data()[`${store}pcsStock`] + (doc.data()[`${store}pkgStock`]*doc.data().qtyPkgBk);
        })
      }
			body = body.filter(x => x.data().productName === doc.data()._id && x.data().purchase === false);
			const stockTotal = body.reduce((accumulator, currentElement) => {
				let quantity = currentElement.data().purchasedType === '0' ? currentElement.data().quantity : (currentElement.data().purchasedType === '1' ? currentElement.data().quantity * currentElement.data().qtyPkg : (parseInt(currentElement.data().purchasedType) > 4 ? parseInt(currentElement.data().quantity * currentElement.data().ctnSqm) :(currentElement.data().pkgUnit === '1' ? parseFloat(currentElement.data().quantity * (currentElement.data().qtyPkg/currentElement.data().ctnSqm)) : parseFloat(currentElement.data().quantity / currentElement.data().ctnSqm))));
				return currentElement.data().move === true ? parseFloat(accumulator) + parseFloat(quantity) : parseFloat(accumulator) - parseFloat(quantity);
			},initialStock)
      let sqMeters = (productType ===  '1' && pkgUnit ===  '1') ? stockTotal*(ctnSqm/qtyPkg): (productType ===  '1' && pkgUnit ===  '0') ? stockTotal*ctnSqm : 0;
      let meters = (productType ===  '2' && pkgUnit ===  '1') ? stockTotal*ctnSqm*qtyPkg: (productType ===  '2' && pkgUnit ===  '0') ? stockTotal*ctnSqm : 0;
      let kilos = (productType ===  '3' && pkgUnit ===  '1') ? stockTotal*ctnSqm*qtyPkg: (productType ===  '3' && pkgUnit ===  '0') ? stockTotal*ctnSqm : 0;
      let cartons = pkgUnit ===  '1' ? parseInt(stockTotal/qtyPkg) : 0;
			let remaining = stockTotal - (cartons * qtyPkg);
			let others = parseInt(productType) > 3 ? parseInt(remaining / ctnSqm) + ' ' + shortTypes[productType] + ' ': '';
			others = (parseInt(productType) > 3 && pkgUnit ===  '1') ? 'and ' + others: others;
			let pieces = parseInt(productType) > 3 ? parseInt(remaining % ctnSqm) : parseInt(remaining);
			let result = pkgUnit ===  '1' ? `${cartons} Cts ${others}and ${pieces} ${shortTypes[0]}` : `${others}${pieces} ${shortTypes[0]}`;
			let meter = productType === '2' ? ' and ' + parseInt(meters % ctnSqm) +' '+ shortTypes[productType] : ''; 
			let sqMeter = (productType === '1' && pkgUnit ===  '0') ? ' and ' + roundPoints(parseFloat(sqMeters % ctnSqm)) +' '+ shortTypes[productType] : ''; 
      let kg = productType === '3' ? ' and ' + parseInt(kilos % ctnSqm) +' '+ shortTypes[productType] : ''; 
    	result +=  meter + sqMeter + kg;
      let alertQuantity = safetyType === '0' ? safetyStock : (safetyType === '1' ? safetyStock * qtyPkg : (parseInt(safetyType) > 4 ? parseInt(safetyStock * ctnSqm) :(pkgUnit === '1' ? parseFloat(safetyStock * (qtyPkg/ctnSqm)) : parseFloat(safetyStock / ctnSqm))));
      if(parseInt(alertQuantity) >= parseInt(stockTotal)){
        allRecords = [
          ...allRecords,
          { _id, name: productName, desc: " have "+result+" remaining", "img": "", "icon": "alert", "time": "", "type": "danger",result},
        ]
        recordsID = {
          ...recordsID,
          [_id] : {'name': doc.data().name, result},
        }
      }
			return true;
			})
			productRecords = allRecords;
      productNotified = recordsID;
      let lastNotify = '';
      let lastResult = '';
      let changes = false;
      productRecords.map((record, index)=>{
        lastNotify = record._id;
        lastResult = record.result;
        if(!notified[lastNotify] || notified[lastNotify].result !== lastResult){
          changes = true;
          return setTimeout(() => {
            notification.open({
              message: record.name,
              description: record.result+' Remaining',
              duration: 180,
              type:'warning',
              key:`stock${lastNotify}`
            });
          }, (index+1)*300);
        }
        return true;
      })
      if(lastNotify && (brandloading || !notified[lastNotify] || changes)){
        setNotified(productNotified);
        setData(productRecords);  
        setBrandLoading(false);
      }
	  }
    
    let allSalesDebt = [];
    if(!salesLoading){
      let allCustomerID = [];
      let lastNotify = '';
      sales.docs.filter(x=> x.data().amount > x.data().paid && x.data().debt <= new Date(today).getTime()).map((doc) => {   
        allCustomerID = [
          ...allCustomerID,
          {id:'sales'+doc.data().customerNumber,'name': doc.data().customerName, 'number':doc.data().customerNumber, desc:"'s payment appointment", icon:"clock", "time": "", "type": "info"},
        ]
        lastNotify = doc.data().customerNumber;
        return true;
      })
      allSalesDebt = allCustomerID;
      if(allSalesDebt.length !== salesDebt.length){
        let tempData = [];
        allSalesDebt.map((record, index)=>{
          lastNotify = record.number;
          tempData.push(record);
          if(!salesDebt[lastNotify]){
            return setTimeout(() => {
              notification.open({
                message: 'Client Payment Deadline',
                description: `${record.name}`,
                duration: 180,
                placement:'topLeft',
                key:`${record.id}`,
                icon: <ClockCircleOutlined style={{ color: '#ff6b72' }} />,
              });
            }, (index+1)*500);
          }
          return true;
        })
        setSalesDebt(allSalesDebt);
        setSalesNotif(tempData);
        setData([...productRecords,...tempData,...purchasesNotif,...expensesNotif])
      }
    }

    let allPurchasesDebt = [];
    if(!purchasesLoading){
      let allCustomerID = [];
      let lastNotify = '';
      purchases.docs.filter(x=> x.data().amount > x.data().paid && x.data().debt <= new Date(today).getTime()).map((doc) => {   
        allCustomerID = [
          ...allCustomerID,
          {id:'purchases'+doc.data().supplierNumber,'name': doc.data().supplierName, 'number':doc.data().supplierNumber, desc:"'s payment appointment", icon:"clock", "time": "", "type": "info"},
        ]
        lastNotify = doc.data().supplierNumber;
        return true;
      })
      allPurchasesDebt = allCustomerID;
      if(allPurchasesDebt.length !== purchasesDebt.length){
        let tempData = [];
        allPurchasesDebt.map((record, index)=>{
          lastNotify = record.number;
          tempData.push(record);
          if(!purchasesDebt[lastNotify]){
            return setTimeout(() => {
              notification.open({
                message: 'Payment Appointment',
                description: `${record.name}`,
                duration: 180,
                placement:'topLeft',
                key:`${record.id}`,
                icon: <ClockCircleOutlined style={{ color: '#ff6b72' }} />,
              });
            }, (index+1)*500);
          }
          return true;
        })
        setPurchasesDebt(allPurchasesDebt);
        setPurchasesNotif(tempData);
        setData([...productRecords,...salesNotif,...tempData,...expensesNotif])
      }
    }

    let allExpensesDebt = [];
    if(!expensesLoading){
      let allCustomerID = [];
      let lastNotify = '';
      expenses.docs.filter(x=> x.data().amount > x.data().paid && x.data().debt <= new Date(today).getTime()).map((doc) => {   
        allCustomerID = [
          ...allCustomerID,
          {id:'expenses'+doc.data().supplierNumber,'name': doc.data().supplierName, 'number':doc.data().supplierNumber, desc:"'s payment appointment", icon:"clock", "time": "", "type": "info"},
        ]
        lastNotify = doc.data().supplierNumber;
        return true;
      })
      allExpensesDebt = allCustomerID;
      if(allExpensesDebt.length !== expensesDebt.length){
        let tempData = [];
        allExpensesDebt.map((record, index)=>{
          lastNotify = record.number;
          tempData.push(record);
          if(!expensesDebt[lastNotify]){
            return setTimeout(() => {
              notification.open({
                message: 'Payment Appointment',
                description: `${record.name}`,
                duration: 180,
                placement:'topLeft',
                key:`${record.id}`,
                icon: <ClockCircleOutlined style={{ color: '#ff6b72' }} />,
              });
            }, (index+1)*500);
          }
          return true;
        })
        setExpensesDebt(allExpensesDebt);
        setExpensesNotif(tempData);
        setData([...productRecords,...salesNotif,...purchasesNotif,...tempData]);
      }
    }

    if(!setsLoading && setting.reminderDuration && setting.reminderDuration.value !== reset){
      setReset(setting.reminderDuration.value);
      if(resetId) clearInterval(resetId);
      if(setting.reminderDuration.value){
        let rstId = setInterval(() => {
          setSalesDebt([]);
          setPurchasesDebt([]);
          setExpensesDebt([]);
        }, setting.reminderDuration.value*1000*60);
        setResetId(rstId);
      }
    } 

  const notificationList = (
    <div className="nav-dropdown nav-notification">
      <div className="nav-notification-header d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Notification</h4>
        {
          data.length > 0 ? <Button type="link" onClick={handleClear} size="small">Clear </Button>
          :
          null
        }
      </div>
      <div className="nav-notification-body">
        {getNotificationBody(data)}
      </div>
      {
        data.length > 0 ? 
        <div className="nav-notification-footer">
          <a className="d-block" href="#/">View all</a>
        </div>
        :
        null
      }
    </div>
  );

  return (
    <Dropdown 
      placement="bottomRight"
      overlay={notificationList}
      onVisibleChange={handleVisibleChange}
      visible={visible}
      trigger={['click']}
    >
      <Menu mode="horizontal">
        <Menu.Item>
          <Badge count={data.length}>
            <BellOutlined className="nav-icon mx-auto" type="bell" />
          </Badge>
        </Menu.Item>
      </Menu>
    </Dropdown>
  ) 
}

export default NavNotification;
