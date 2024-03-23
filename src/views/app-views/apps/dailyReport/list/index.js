import React,{ useState } from 'react'
import { Card, Form, Modal, Row, Col, Select, Button } from 'antd';
import Flex from 'components/shared-components/Flex'
import { Typography } from "antd";
import CashIn from './cashin';
import CashOut from './cashout';
import Expenses from './expenses';
import Sales from './sales';
import Purchases from './purchases';
import moment from 'moment';
import { DatePicker } from 'antd';
import { CloudDownloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Option } = Select;
let stockTotal = 0;
let salesTotal = 0;
let purchTotal = 0;
let expenTotal = 0;
let cashInTotal = 0;
let cashOutTotal = 0;
let totalCash = 0;
let totalMomo = 0;
let totalCheque = 0;
let totalBank = 0;
let totalBalance = 0;
let amountCash = 0;
let amountMomo = 0;
let amountCheque = 0;
let amountBank = 0;
let amountBalance = 0;
let expCash = 0;
let expMomo = 0;
let expCheque = 0;
let expBank = 0;
let expBalance = 0;
let ciCash = 0;
let ciMomo = 0;
let ciCheque = 0;
let ciBank = 0;
let ciBalance = 0;
let coCash = 0;
let coMomo = 0;
let coCheque = 0;
let coBank = 0;
let coBalance = 0;
let checkedPayments = [];
let clientReport = [{dates: '', customerName: ''}];
let supplierReport = [{dates: '', supplierName: ''}];
let expensesReport = [{dates: ''}];
let salesReport = [{dates: ''}];
let purchasesReport = [{dates: ''}];
let comm = ''; 
const Report = ({systemData}) => {
	const [form] = Form.useForm();
	const [ store, setStore ] = useState('')
	const [visible, setVisible] = useState(false);
	const [loaded, setLoaded] = useState(false);
	let { diff_minutes, payments, paymentsLoading, purchases, purchasesLoading, expenses,expensesLoading, sales, salesLoading, stores, storesLoading, records, singleShop, multiShop, recordsLoading, shortTypes } = systemData;

	let allCustomers = [];
	if(!salesLoading){
	  let allCustomer = [];
	  sales.docs.filter(x=> x.data().amount > x.data().paid).map((doc) => {   
		let balance = parseFloat(doc.data().amount - doc.data().paid);
		let debt = doc.data().debt ? doc.data().debt : 0;
		let tempArr = [...allCustomer];
		let data = tempArr.filter(x => x.number === doc.data().customerNumber);
		if(data.length === 1){
		  let index = allCustomer.indexOf(data[0]);
		  allCustomer[index].debt = debt < allCustomer[index].debt ? debt : allCustomer[index].debt;
		  allCustomer[index].balance = parseFloat(allCustomer[index].balance + balance);
		}
		else{
		  allCustomer = [
			...allCustomer,
			{name: doc.data().customerName, number: doc.data().customerNumber, balance, debt},
		  ]
		}
		return true;
	  })
	  allCustomers = allCustomer;
	}


	let allSuppliers = {};
	if(!purchasesLoading){
	  let allSupplier = {};
	  purchases.docs.map((doc) => {   
		let balance = parseFloat(doc.data().amount - doc.data().paid);
		let debt = doc.data().debt ? doc.data().debt : 0;
		let latest = doc.data().date;
		let id = doc.id;
		let index = doc.data().supplierNumber;
		if(allSupplier[index]){
		  allSupplier[index].id += `,${id}`;
		  allSupplier[index].debt = debt < allSupplier[index].debt ? debt : allSupplier[index].debt;
		  allSupplier[index].balance = parseFloat(allSupplier[index].balance + balance);
		  allSupplier[index].latest = latest > allSupplier[index].latest ? latest : allSupplier[index].latest;
		}
		else{
		  allSupplier = {
			...allSupplier,
			[index] : {name: doc.data().supplierName, number: index, balance, debt, latest,id},
		  }
		}
		return true;
	  })
	  allSuppliers = allSupplier;
	}


	let purchased = recordsLoading ? [] : records.docs.filter(x => x.data().purchaseId && x.data().source === store && x.data().move === true);
	let cashIn = paymentsLoading ? [] : payments.docs.filter(x => x.data().type === 1 && x.data().source === store);
	let cashOut = paymentsLoading ? [] : payments.docs.filter(x => x.data().type === 2 && x.data().source === store);
	records = recordsLoading ? [] : records.docs.filter(x => x.data().refunded === false && x.data().source === store && x.data().sales === true);
	sales = salesLoading ? [] : sales.docs.filter(x => x.data().source === store);
	expenses = expensesLoading ? [] : expenses.docs.filter(x => x.data().source === store);
	purchases = purchasesLoading ? [] : purchases.docs.filter(x => x.data().refunded === false);
	const rangeConfig = {
		rules: [{ type: 'array', required: true, message: 'Please select time!' }],
	  };
	  
	  const setSalesData = (index, subscriber,length,allSales) => {
		salesReport = index === 0 ? [] : salesReport ;  
		salesTotal = index === 0 ? 0 : salesTotal;  
		let {quantity,purchasedType,saleId,sellPrice} = subscriber.data();
		let salesData = allSales.filter(x=> +x.data()._id === +saleId)[0].data();
		let {customerName, customerNumber, payCounter,amount} = salesData;

		let cash = 0;
		let momo = 0;
		let cheque = 0;
		let credits = 0;
		let bankTransfer = 0;

		if(salesReport.length && salesReport[salesReport.length-1].dates !== saleId){
			let newId = salesReport[salesReport.length-1].dates;
			let saleData = allSales.filter(x=> +x.data()._id === +(newId))[0].data();
			let {payCounter,amount} = saleData;
		
			for (let i = 1; i <= payCounter; i++) {
				let method = saleData['method'+i];
				let amounts = saleData['amount'+i];
				let payId = saleData['payID'+i];
				if(diff_minutes(newId, payId) < 60){
					checkedPayments[payId] = checkedPayments[payId] ? parseInt(checkedPayments[payId]) + amounts : amounts;
					cash += method === 'Cash' ? amounts : 0;
					momo += method === 'Mobile Money' ? amounts : 0;
					cheque += method === 'Cheque' ? amounts : 0;
					bankTransfer += method === 'Bank Transfer' ? amounts : 0;
				}
			}

			totalCash += cash;
			totalMomo += momo;
			totalCheque += cheque;
			totalBank += bankTransfer;
			credits = parseInt(amount) - (cash + momo + cheque + bankTransfer);
			salesTotal += parseInt(amount)
			totalBalance +=credits

			salesReport[salesReport.length-1].cash = cash;
			salesReport[salesReport.length-1].momo = momo;
			salesReport[salesReport.length-1].cheque = cheque;
			salesReport[salesReport.length-1].bankTransfer = bankTransfer;
			salesReport[salesReport.length-1].credits = credits;
			salesReport[salesReport.length-1].amount = amount;

			cash = 0;
			momo = 0;
			cheque = 0;
			credits = 0;
			bankTransfer = 0;
		}
		if(parseInt(index+1) === length){
			for (let j = 1; j <= payCounter; j++) {
				let method = salesData['method'+j];
				let amounts = salesData['amount'+j];
				let payId = salesData['payID'+j];
				if(diff_minutes(saleId, payId) < 60){
					checkedPayments[payId] = checkedPayments[payId] ? parseInt(checkedPayments[payId]) + amounts : amounts;
					cash += method === 'Cash' ? amounts : 0;
					momo += method === 'Mobile Money' ? amounts : 0;
					cheque += method === 'Cheque' ? amounts : 0;
					bankTransfer += method === 'Bank Transfer' ? amounts : 0;
				}
			}

			totalCash += cash;
			totalMomo += momo;
			totalCheque += cheque;
			totalBank += bankTransfer;
			credits = parseInt(amount) - (cash + momo + cheque + bankTransfer);
			salesTotal += parseInt(amount)
			totalBalance += credits;
		}
			
		let display = (quantity + ' x ' + (purchasedType === '0' ? ' Pcs' : (purchasedType === '1' ? ' Cts' : ' ' + shortTypes[parseInt(purchasedType)-1])));
		let newRow = {
			dates: saleId,
			client:customerName+'('+customerNumber+')',
			product:subscriber.data().product,
			quantity: display,
			price:sellPrice,
			cash,
			momo,
			cheque,
			bankTransfer,
			total:quantity*sellPrice,
			amount: 0,
			credits,
			solde:salesTotal,
		}
		salesReport.push(newRow);
		if(parseInt(index+1) === length){
			salesReport.push({dates: '',client:'',product:'',quantity: '',price:'[{Total]}',cash: totalCash,momo: totalMomo,cheque: totalCheque,bankTransfer: totalBank, credits:totalBalance, total:salesTotal, amount: salesTotal,solde:salesTotal});
		}
	  };

	  const setPurchaseData = (index, subscriber,length,allPurchases) => {
		purchasesReport = index === 0 ? [] : purchasesReport ;  
		purchTotal = index === 0 ? 0 : purchTotal;  
		let {quantity,purchasedType,purchaseId,costPrice} = subscriber.data();
		let purchasesData = allPurchases.filter(x=> +x.data()._id === +purchaseId)[0].data();
		let {supplierName, supplierNumber, payCounter,amount} = purchasesData;

		let cash = 0;
		let momo = 0;
		let cheque = 0;
		let credits = 0;
		let bankTransfer = 0;

		if(purchasesReport.length && purchasesReport[purchasesReport.length-1].dates !== purchaseId){
			let newId = purchasesReport[purchasesReport.length-1].dates;
			let purchaseData = allPurchases.filter(x=> +x.data()._id === +(newId))[0].data();
			let {payCounter,amount} = purchaseData;
		
			for (let i = 1; i <= payCounter; i++) {
				let method = purchaseData['method'+i];
				let amounts = purchaseData['amount'+i];
				let payId = purchaseData['payID'+i];
				if(diff_minutes(newId, payId) < 60){
					checkedPayments[payId] = checkedPayments[payId] ? parseInt(checkedPayments[payId]) + amounts : amounts;
					cash += method === 'Cash' ? amounts : 0;
					momo += method === 'Mobile Money' ? amounts : 0;
					cheque += method === 'Cheque' ? amounts : 0;
					bankTransfer += method === 'Bank Transfer' ? amounts : 0;
				}
			}

			amountCash += cash;
			amountMomo += momo;
			amountCheque += cheque;
			amountBank += bankTransfer;
			credits = parseInt(amount) - parseInt(cash + momo + cheque + bankTransfer);
			purchTotal += parseInt(amount)
			amountBalance +=credits

			purchasesReport[purchasesReport.length-1].cash = cash;
			purchasesReport[purchasesReport.length-1].momo = momo;
			purchasesReport[purchasesReport.length-1].cheque = cheque;
			purchasesReport[purchasesReport.length-1].bankTransfer = bankTransfer;
			purchasesReport[purchasesReport.length-1].credits = credits;
			purchasesReport[purchasesReport.length-1].amount = amount;

			cash = 0;
			momo = 0;
			cheque = 0;
			credits = 0;
			bankTransfer = 0;
		}
		if(parseInt(index+1) === length){
			for (let j = 1; j <= payCounter; j++) {
				let method = purchasesData['method'+j];
				let amounts = purchasesData['amount'+j];
				let payId = purchasesData['payID'+j];
				if(diff_minutes(purchaseId, payId) < 60){
					checkedPayments[payId] = checkedPayments[payId] ? parseInt(checkedPayments[payId]) + amounts : amounts;
					cash += method === 'Cash' ? amounts : 0;
					momo += method === 'Mobile Money' ? amounts : 0;
					cheque += method === 'Cheque' ? amounts : 0;
					bankTransfer += method === 'Bank Transfer' ? amounts : 0;
				}
			}

			amountCash += cash;
			amountMomo += momo;
			amountCheque += cheque;
			amountBank += bankTransfer;
			credits = parseInt(amount) - (cash + momo + cheque + bankTransfer);
			purchTotal += parseInt(amount)
			amountBalance += credits;
		}
			
		let display = (quantity + ' x ' + (purchasedType === '0' ? ' Pcs' : (purchasedType === '1' ? ' Cts' : ' ' + shortTypes[parseInt(purchasedType)-1])));
		let comms = comm !== purchaseId ? 'X ' : '- ';
		let newRow = {
			dates: purchaseId,
			supplier:supplierName+'('+supplierNumber+')',
			product:subscriber.data().product,
			quantity: display,
			price:costPrice,
			cash,
			momo,
			cheque,
			bankTransfer,
			total:quantity*costPrice,
			amount: 0,
			credits,
			solde:purchTotal,
		}
		comm = purchaseId;
		purchasesReport.push(newRow);
		if(parseInt(index+1) === length){
			purchasesReport.push({dates: '',supplier:'',product:'',quantity: '', price:'[{Total]}',cash: amountCash,momo: amountMomo,cheque: amountCheque,bankTransfer: amountBank, credits:amountBalance, total:purchTotal, amount: purchTotal,solde:purchTotal});
		}
	  };

	  const setExpensesData = (index, subscriber,length) => {
		expensesReport = index === 0 ? [] : expensesReport ;  
		expenTotal = index === 0 ? 0 : expenTotal;  
		let expensesData = subscriber.data();
		let {date,amount,title,supplierName, supplierNumber,payCounter} = expensesData;


		let cash = 0;
		let momo = 0;
		let cheque = 0;
		let credits = 0;
		let bankTransfer = 0;
		
		for (let i = 1; i <= payCounter; i++) {
			let method = expensesData['method'+i];
			let amounts = expensesData['amount'+i];
			let payId = expensesData['payID'+i];
			if(diff_minutes(date, payId) < 60){
				checkedPayments[payId] = checkedPayments[payId] ? parseInt(checkedPayments[payId]) + amounts : amounts;
				cash += method === 'Cash' ? amounts : 0;
				momo += method === 'Mobile Money' ? amounts : 0;
				cheque += method === 'Cheque' ? amounts : 0;
				bankTransfer += method === 'Bank Transfer' ? amounts : 0;
			}
		}

		expCash += cash;
		expMomo += momo;
		expCheque += cheque;
		expBank += bankTransfer;
		credits = parseInt(amount) - parseInt(cash + momo + cheque + bankTransfer);
		expenTotal += parseInt(amount)
		expBalance +=credits
		
		let newRow = {
			dates: date,
			supplier:supplierName+'('+supplierNumber+')',
			title,
			cash,
			momo,
			cheque,
			bankTransfer,
			amount,
			credits,
		}
		expensesReport.push(newRow);
		if(parseInt(index+1) === length){
			expensesReport.push({dates: '',supplier:'',title:'[{Total]}',cash: expCash,momo: expMomo,cheque: expCheque,bankTransfer: expBank, credits:expBalance, amount: expenTotal});
		}
	  };

	  const setCashInData = (index, subscriber,length) => {
		clientReport = index === 0 ? [] : clientReport ;  
		cashInTotal = index === 0 ? 0 : cashInTotal;  
		let cashInData = subscriber.data();
		let {date,amount,customerName, customerNumber,method} = cashInData;
		if(parseInt(checkedPayments[date]) === amount) return;
		amount -= checkedPayments[date] ? parseInt(checkedPayments[date]) : 0;

		let cash = method === 'Cash' ? amount : 0;
		let momo = method === 'Mobile Money' ? amount : 0;
		let cheque = method === 'Cheque' ? amount : 0;
		let bankTransfer = method === 'Bank Transfer' ? amount : 0;
		let credits = 0;

		ciCash += cash;
		ciMomo += momo;
		ciCheque += cheque;
		ciBank += bankTransfer;
		credits = parseInt(amount) - parseInt(cash + momo + cheque + bankTransfer);
		cashInTotal += parseInt(amount)
		ciBalance +=credits
		
		let newRow = {
			dates: date,
			customerName,
			customerNumber,
			cash,
			momo,
			cheque,
			bankTransfer,
			amount,
			credits,
		}
		clientReport.push(newRow);
		if(parseInt(index+1) === length){
			clientReport.push({dates: '',customerName:'',customerNumber:'[{Total]}',cash: ciCash,momo: ciMomo,cheque: ciCheque,bankTransfer: ciBank, credits:ciBalance, amount: cashInTotal});
		}
	  };

	  const setCashOutData = (index, subscriber,length) => {
		supplierReport = index === 0 ? [] : supplierReport ;  
		cashOutTotal = index === 0 ? 0 : cashOutTotal;  
		let cashInData = subscriber.data();
		let {date,amount,supplierName, supplierNumber,method} = cashInData;
		if(parseInt(checkedPayments[date]) === amount) return;
		amount -= checkedPayments[date] ? parseInt(checkedPayments[date]) : 0;

		let cash = method === 'Cash' ? amount : 0;
		let momo = method === 'Mobile Money' ? amount : 0;
		let cheque = method === 'Cheque' ? amount : 0;
		let bankTransfer = method === 'Bank Transfer' ? amount : 0;
		let credits = 0;

		coCash += cash;
		coMomo += momo;
		coCheque += cheque;
		coBank += bankTransfer;
		credits = parseInt(amount) - parseInt(cash + momo + cheque + bankTransfer);
		cashOutTotal += parseInt(amount)
		coBalance +=credits
		
		let newRow = {
			dates: date,
			supplierName,
			supplierNumber,
			cash,
			momo,
			cheque,
			bankTransfer,
			amount,
			credits,
		}
		supplierReport.push(newRow);
		if(parseInt(index+1) === length){
			supplierReport.push({dates: '',supplierName:'',supplierNumber:'[{Total]}',cash: coCash,momo: coMomo,cheque: coCheque,bankTransfer: coBank, credits:coBalance, amount: cashOutTotal});
		}
	  };


	  const handleCancel = () => {
		setVisible(false)
		setLoaded(false);
	};

	const disabledDate = (current) => {
		return current && current > moment().endOf("day");
	}  

	  const handleOk = async () => {
		try {
			totalCash = 0;
			totalMomo = 0;
			totalCheque = 0;
			totalBank = 0;
			totalBalance = 0;
			amountCash = 0;
			amountMomo = 0;
			amountCheque = 0;
			amountBank = 0;
			amountBalance = 0;
			checkedPayments = [];
			const fieldsValue = await form.validateFields();
			let rangeValue = fieldsValue['range-picker'];
			let fdate = new Date(rangeValue[0].format('YYYY-MM-DD')).setHours(0,0,0,0)
			let tdate = new Date(rangeValue[1].format('YYYY-MM-DD')).setHours(23,59,59,999)
			setStore(fieldsValue.shop)
			let expMap = expenses.filter(x => x.data().date >= fdate &&  x.data().date <= tdate);
			let toMap = records.filter(x => x.data().date >= fdate &&  x.data().date <= tdate);
			let purchMap = purchased.filter(x => x.data().date >= fdate &&  x.data().date <= tdate);
			let allSales = sales.filter(x => x.data().date >= fdate &&  x.data().date <= tdate);
			let allPurchases = purchases.filter(x => x.data().date >= fdate &&  x.data().date <= tdate);
			let cashInMap = cashIn.filter(x => x.data().date >= fdate &&  x.data().date <= tdate);
			let cashOutMap = cashOut.filter(x => x.data().date >= fdate &&  x.data().date <= tdate);
			toMap.map((subscriber, index) => setSalesData(index,subscriber,toMap.length, allSales));
			purchMap.map((subscriber, index) => setPurchaseData(index,subscriber,purchMap.length, allPurchases));
			expMap.map((subscriber, index) => setExpensesData(index,subscriber,expMap.length));
			cashInMap.map((subscriber, index) => setCashInData(index,subscriber,cashInMap.length));
			cashOutMap.map((subscriber, index) => setCashOutData(index,subscriber,cashOutMap.length));
			setLoaded(true);
			setVisible(false);
		} catch (errInfo) {}
	  };
	  
	const handleShopChange = (value) => {
		setStore(value);
	};

	if(!multiShop && !store && singleShop){
		setStore(singleShop);
		form.setFieldsValue({'shop': singleShop});
	}
	return (
		<Card>
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3">
						<Title level={4}>Generate Daily Report</Title>
					</div>
				</Flex>
				<div>
					<Button onClick={() => setVisible(true)} size="small" type="primary" icon={<CloudDownloadOutlined />} block>Generate</Button>
				</div>
			</Flex>
			{loaded && (<>
				<Sales customers={salesReport} loading={recordsLoading} setVisible={setVisible}/>
				<div className='mt-4'>
					<Purchases data={purchasesReport} loading={recordsLoading} setVisible={setVisible}/>
				</div>
				<div className='mt-4'>
					<Expenses data={expensesReport} loading={expensesLoading} setVisible={setVisible}/>
				</div>
				<div className='mt-4'>
					<CashIn data={clientReport} loading={paymentsLoading} setVisible={setVisible}/>
				</div>
				<div className='mt-4'>
					<CashOut data={supplierReport} loading={paymentsLoading} setVisible={setVisible}/>
				</div>
			</>)}
			<Modal
              title="New Report"
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
				<Form layout="vertical" form={form}>
					<Row gutter={16}>
						<Col xs={24} sm={24} md={24}>
							<Form.Item name="range-picker" label="Pick Dates" {...rangeConfig}>
								<RangePicker className="w-100" disabledDate={disabledDate}/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={24} className={multiShop ? '' : 'd-none'}>
							<Form.Item
								name="shop"
								label="Store"
								rules={[{ required: true, message: 'Select a store ' }]}
							>
								<Select placeholder=" --Select-- " onChange={handleShopChange}>
								{!storesLoading && stores.docs.map((store, index) => (
									<Option key={index} value={store.data()._id}>
										{store.data().name}
									</Option>
								))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
				</Form>
            </Modal>
		</Card>
	)
}

export default Report
