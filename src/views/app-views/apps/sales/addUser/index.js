import React, { useState } from 'react'
import { SaveOutlined, MinusCircleOutlined, PlusOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Form, Card, Col, Row, Select, Button, DatePicker, Input, InputNumber, message } from 'antd';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import { useHistory } from "react-router-dom";
import { DataService } from "services/sales.service";
import { DataService as SourceService } from "services/source.service";
import { DataService as CustomerService } from "services/customers.service";
import { DataService as RecordsService } from "services/records.service";
import Invoice from '../invoice';

const { TextArea } = Input;
const dateFormat = 'DD/MM/YYYY';
const { Option } = Select;
let offGrid = {
	visible: false,
	receiptTotal: 0,
	receiptId: '',
	salesInfo: {},
	shopName: {},
	orderDetails: [
		{ product: '', productName: '', pkgUnit:'', productType:'', purchasedType:'', quantity: '0', costPrice: '0', sellPrice: '0', total:'0', stock:'0' }
	  ]
};
const Sales = ({systemData}) => { 	
	const [form] = Form.useForm();
	const [key] = useState('sales');
	const [loading, setLoading] = useState(true);
	const [dates, setDates] = useState(new Date());
	const [deptDate, setDeptDate] = useState(0);
	const [customerName, setCustomerName] = useState('');
	const [customerNumber, setCustomerNumber] = useState('');
	const [selected, setSelected] = useState([]);
	const [grandTotal, setGrandTotal] = useState(0);
	const [paidAmount, setPaidAmount] = useState('');
	const [paymentMethod, setPaymentMethod] = useState('');
	const [receiptTotal, setReceiptTotal] = useState(offGrid.receiptTotal);
	const [receiptId, setReceiptId] = useState(offGrid.receiptId);
	const [visible, setVisible] = useState(offGrid.visible);
	const [salesInfo, setSalesInfo] = useState(offGrid.salesInfo);
	const [buttonLoading, setButtonLoading] = useState(false);
	let {products, productsLoading, records, recordsLoading, stores, storesLoading, shops, shopsLoading, userData, shortTypes, getId } = systemData;
	records = recordsLoading ? [] : records.docs.filter(x => x.data().refunded === false);
	const [shopName, setShopName] = useState(offGrid.shopName);
	const [inputFields, setInputFields] = useState([
	  { product: '',  productName: '', pkgUnit:'', productType:'', purchasedType:'', quantity: '0', costPrice: '0', sellPrice: '0', total:'0', stock:'0' }
	]);
	const [orderDetails, setOrderDetails] = useState(offGrid.orderDetails);

	let history = useHistory();	
	const RedirectBack = () => {
		history.push(`/app/apps/sales/list`)
	}
	const handleSubmit = async () => {
		setButtonLoading(true)
		try {
			const row = await form.validateFields();
			let values = [...inputFields];
			let recId = new Date();
			let comment = row.comment ? row.comment : '';
			let newStore = !shopsLoading ? shops[userData.userStore] : {'name':'','location':''};
			let shopName = newStore.name;
			let shopLocation = newStore.location;
			setReceiptId(recId);
			offGrid.receiptId = recId;
			let recordId = +(recId.getTime());
			let payCounter = paidAmount > 0 ? 1 :0;
			let records ={
				date: recordId,
				amount: paidAmount,
				method: paymentMethod,
				type: 1,
				customerName,
				customerNumber,
				userId : userData.userId,
				backupUser:userData.displayName,
				source:userData.userStore,
				backupSource:shopName,
				backupLocation:shopLocation,
			}
			let record={
				[`payID${payCounter}`]: payCounter ? recordId : '',
				[`amount${payCounter}`]: paidAmount,
				[`method${payCounter}`]: payCounter ? paymentMethod : '',
			}
			let saleId = +(recId.getTime());
			let data = {
				date: dates.getTime(),
				debt: deptDate,
				comment,
				products: values.length,
				amount: grandTotal,
				paid: paidAmount,
				customerName,
				customerNumber,
				userId : userData.userId,
				refunded: false,
				status:false,
				payCounter,
				source:userData.userStore,
				backupSource:shopName,
				backupLocation:shopLocation,
				backupUser:userData.displayName,
				...record
			}
			let customer = {
			customerName,
			customerNumber,
			}
		
			values.map(function(record){
			let purchases = {
				date:+(dates.getTime()),
				product : record.product,
				costPrice : record.costPrice,
				sellPrice  : record.sellPrice,
				total : record.total,
				quantity : record.quantity,
				pkgUnit : record.pkgUnit,
				ctnSqm : record.ctnSqm,
				qtyPkg : record.qtyPkg,
				productType : record.productType,
				purchasedType : record.purchasedType,
				productName : record.productName,
				userId : userData.userId,
				saleId,
				purchase:false,
				sales:true,
				move:false,
				damaged:false,
				refunded:false,
				source:userData.userStore,
				backupSource:shopName,
				backupLocation:shopLocation,
				backupUser:userData.displayName,
			};
			return SourceService.create(purchases);
			});
			setTimeout(() => {
				offGrid = {
					visible: false,
					receiptTotal: 0,
					receiptId: '',
					salesInfo: {},
					shopName: {},
					orderDetails: [
						{ product: '', productName: '', pkgUnit:'', productType:'', purchasedType:'', quantity: '0', costPrice: '0', sellPrice: '0', total:'0', stock:'0' }
					  ]
				};
			  }, 3000);
			DataService.create(data,saleId);
			if(paidAmount > 0) RecordsService.create(records,recordId);
			CustomerService.create(customer,customerNumber);
			offGrid.receiptTotal = grandTotal;
			offGrid.orderDetails = values;
			offGrid.salesInfo = data;
			setReceiptTotal(grandTotal)
			setOrderDetails(values);
			setSalesInfo(data);
			let shopDetails = storesLoading ? [] : stores.docs.filter(x=> x.id === userData.userStore);
			let ShopName = (shopDetails.length === 1) ? {'name':shopDetails[0].data().name,'location':shopDetails[0].data().location} : {'name':userData.userStore,'location':userData.userStore}
			setShopName(ShopName);
			offGrid.shopName = ShopName;
			setInputFields([{ product: '', productName: '', pkgUnit:'', productType:'', purchasedType: '',  quantity: '0', costPrice: '0', sellPrice: '0', total:'0', stock:'0' }]);
			setGrandTotal(0);
			setCustomerName('');
			setCustomerNumber('');
			setPaidAmount('');
			setPaymentMethod('');
			setButtonLoading(false)
			//RedirectBack();
			offGrid.visible = true;
			setVisible(offGrid.visible);
			message.success("New sale recorded!")
		} catch (errInfo) {setButtonLoading(false)}	
	};
	  let allPrices = [];
	  let allItems = [];
	  if(!productsLoading && !recordsLoading){
		let allRecords = [];
		let allItem = [];
		products.docs.filter(x => x.data()[userData.userStore] === true).map((doc, index) => {    
		  allRecords = {
			...allRecords,
			[doc.data()._id] : {...doc.data(), name:doc.data().productName},
		  }
		  allItem = [
			...allItem,
			{label: doc.data().productName, value: doc.id, index:index},
		  ]
		  return selected;
		})
		allPrices = allRecords;
		allItems = allItem;
		if(loading){
		setLoading(false);
		}
	  }
	  function getQuantity(product,index) {     
		const values = [...inputFields]; 
		let body = [...records]; 
		let initialStock = values[index].initSqm + values[index].initPcs + values[index].initPkg;
		body = body.filter(x => x.data().productName === product && x.data().refunded === false && x.data().purchase === false && x.data().source === userData.userStore  && x.data().date < +(dates.getTime()));
		const stockTotal = body.reduce((accumulator, currentElement) => {
			let quantity = currentElement.data().purchasedType === '0' ? currentElement.data().quantity : (currentElement.data().purchasedType === '1' ? currentElement.data().quantity * currentElement.data().qtyPkg : (parseInt(currentElement.data().purchasedType) > 4 ? parseFloat(currentElement.data().quantity * currentElement.data().ctnSqm) :(currentElement.data().pkgUnit === '1' ? parseFloat(currentElement.data().quantity * (currentElement.data().qtyPkg/currentElement.data().ctnSqm)) : parseFloat(currentElement.data().quantity / currentElement.data().ctnSqm))));
		  return currentElement.data().move === true ? parseFloat(accumulator) + parseFloat(quantity) : parseFloat(accumulator) - parseFloat(quantity);
		},initialStock)
		values[index].stock = stockTotal;
		setInputFields(values);
	  }
	  const handleproductNameChange = (index, value) => {
		const values = [...inputFields];
		values[index].product = allPrices[value].name;
		values[index].costPrice = allPrices[value].pkgUnit === '0' ? allPrices[value].pcsPurchasePrice : 0;
		values[index].sellPrice = allPrices[value].pkgUnit === '0' ? allPrices[value].pcsSalePrice : 0;
		values[index].total = 0;
		values[index].quantity = 0;
		values[index].pkgUnit = allPrices[value].pkgUnit;
		values[index].ctnSqm = allPrices[value].ctnSqm;
		values[index].qtyPkg = allPrices[value].qtyPkg;
		values[index].productType = allPrices[value].productType;
		values[index].productType = allPrices[value].productType;
		values[index].purchasedType = (allPrices[value].pkgUnit === '0' && allPrices[value].productType === '0') ? '0' : '';
		values[index].productName = value;
		values[index].initSqm = allPrices[value][`${userData.userStore}sqmStock`] ? allPrices[value][`${userData.userStore}sqmStock`] : 0;
		values[index].initPcs = allPrices[value][`${userData.userStore}pcsStock`] ? allPrices[value][`${userData.userStore}pcsStock`] : 0;
		values[index].initPkg = allPrices[value][`${userData.userStore}pkgStock`] ? allPrices[value][`${userData.userStore}pkgStock`] : 0;
		values[index].initPkg = values[index].initPkg * allPrices[value].qtyPkgBk;
		values[index].initSqm = !values[index].initSqm ? 0 : allPrices[value].productType === '0' ? 0 : ((parseInt(allPrices[value].productType) > 3 ? parseInt(values[index].initSqm * allPrices[value].ctnSqm) :(allPrices[value].pkgUnit === '1' ? parseInt(values[index].initSqm * (allPrices[value].qtyPkg/allPrices[value].ctnSqm)) : parseFloat(values[index].initSqm / allPrices[value].ctnSqm))));
		getQuantity(value, index); 
		form.setFieldsValue({[`purchasedType${index}`]:values[index].purchasedType, [`total${index}`]:0, [`quantity${index}`]: 0,[`sellPrice${index}`]:values[index].sellPrice});
	 }

	const handlePurchasedTypeChange = (index, value) => {
		const values = [...inputFields];
		if(!values[index]) return;
		values[index].costPrice = value === '0' ? allPrices[values[index].productName].pcsPurchasePrice : (value === '1' ? allPrices[values[index].productName].pkgPurchasePrice : (allPrices[values[index].productName].qtyPkg/allPrices[values[index].productName].ctnSqm) * allPrices[values[index].productName].pcsSalePrice);
		values[index].sellPrice = value === '0' ? allPrices[values[index].productName].pcsSalePrice : (value === '1' ? allPrices[values[index].productName].pkgSalePrice : allPrices[values[index].productName].sqmPrice);
		values[index].purchasedType = value;
		values[index].quantity = 0;
		form.setFieldsValue({[`quantity${index}`]: 0,[`sellPrice${index}`]:values[index].sellPrice,[`total${index}`]: 0});
		setInputFields(values);
	}

	const handleQuantityChange = (index, value) => {	
		const values = [...inputFields];
		if(!values[index]) return;
		let newValue = value === '' ? '' : parseFloat(value);
		let stock = values[index].purchasedType === '0' ? values[index].stock : (values[index].purchasedType === '1' ? parseFloat(values[index].stock / values[index].qtyPkg) : (parseFloat(values[index].purchasedType) > 4 ? parseFloat(values[index].stock / values[index].ctnSqm) : (values[index].pkgUnit === '1' ? parseFloat(values[index].stock / (values[index].qtyPkg/values[index].ctnSqm)) : parseFloat(values[index].stock * values[index].ctnSqm))));
		if(newValue && newValue > stock){
			newValue = stock;
			form.setFieldsValue({[`quantity${index}`]: newValue});
			message.destroy();
			message.error({content:"Unsufficient Shop Quantity!", key});
		}
		if(newValue || newValue === ''){
			let newTotal = grandTotal - values[index].total;
			values[index].quantity = newValue;
			values[index].total = (newValue) ? values[index].sellPrice * newValue : 0 ;  
			setGrandTotal(newTotal + values[index].total);  
			setPaidAmount('');
			setPaymentMethod('');
		}
		setInputFields(values);
	}

	const handleSellPriceChange = (index, value) => {
		const values = [...inputFields];
		if(!values[index]) return;
		let newValue = value === '' ? '' : parseInt(value);
		let newTotal = grandTotal - values[index].total;
		values[index].sellPrice = newValue;
		values[index].total = (newValue && values[index].quantity) ? values[index].quantity * newValue : 0;  
		setGrandTotal(newTotal + values[index].total);
		setPaidAmount('');
		setPaymentMethod('');
		form.setFieldsValue({'PaidAmount': null, paymentMethod: null, debtDate:null});
		setInputFields(values);
	} 
	
	const handlePriceChange = (index, event) => {
		const values = [...inputFields];
		if(!values[index]) return;
		let value = event.target.value.split(',').join('');
		let salePrice = values[index].purchasedType === '0' ? allPrices[values[index].productName].pcsSalePrice : (values[index].purchasedType === '1' ? allPrices[values[index].productName].pkgSalePrice : allPrices[values[index].productName].sqmPrice);
		let sellPrice = (values[index].productName) ? salePrice : 0;
		let newValue = value === '' ? '' : parseInt(value);
		if(newValue && values[index].productName && newValue < sellPrice){
			newValue = sellPrice;
			form.setFieldsValue({[`sellPrice${index}`]: newValue});
			message.destroy();
			message.error({content:"Verify product price!", key});
		}
		let newTotal = grandTotal - values[index].total;
		values[index].sellPrice = newValue;
		values[index].total = (newValue && values[index].quantity) ? values[index].quantity * newValue : 0;  
		setGrandTotal(newTotal + values[index].total);  
		setPaidAmount('');
		setPaymentMethod('');
		setInputFields(values);
		form.setFieldsValue({'PaidAmount': null, paymentMethod: null, debtDate:null});
	};
	
	const handleAddFields = () => {
		const values = [...inputFields];
		values.push({ product: '', productName: '', pkgUnit: '', purchasedType: '', quantity: '0', costPrice: '0', sellPrice: '0', total: '0', stock:'0' });
		setInputFields(values);
	};
	
	const handleDateChange = date => {
		setDates(new Date(date.format('YYYY-MM-DD HH:mm:ss')));
		setInputFields([
			{ product: '', productName: '', pkgUnit:'', productType:'', purchasedType:'', quantity: '0', costPrice: '0', sellPrice: '0', total:'0', stock:'0' }
		  ]);
		setGrandTotal(0);
		setPaidAmount('');
		setPaymentMethod('');  
		form.setFieldsValue({'PaidAmount': null, paymentMethod: null, debtDate:null});
	};
			
	const handleDeptDateChange = date => {
		setDeptDate(new Date(date.format('YYYY-MM-DD HH:mm:ss')).getTime());
	};

	const handleNameChange = event => {
		setCustomerName(event.target.value);
	};
	
	const handleNumberChange = value => {
		let newValue = ((!value && value !== 0 )|| value === '') ? '' : ((value+'').length > 9 ? (value+'').slice(0,9) : parseInt(value));
		let newTin = ((!value && value !== 0 )|| value === '') ? '' : parseInt(value);
		let check = (value+'').slice(0,2);

		if(newValue){
			newValue = check === ('78' || '79' || '73' || '72') ? ('0' + newValue) : newTin;
		}
		setCustomerNumber(newValue);
		form.setFieldsValue({'customerNumber': newValue});
	};
	
	const handlePaidChange = value => {
		let newValue = ((!value && value !== 0 )|| value === '') ? '' : parseInt(value);
		newValue = newValue > grandTotal ? grandTotal : newValue;
		setPaidAmount(newValue);
		setPaymentMethod('');	
		form.setFieldsValue({'PaidAmount': newValue, paymentMethod: ''});
	};
	
	const handleMethodChange = value => {
		setPaymentMethod(value);
	};
	
	const handleRemoveFields = index => {
		const values = [...inputFields];
		if(!values[index]) return;
		setSelected(ev => ({
			...ev,
			//[values[index].productName] : {'selected': false},
		}))
		let newTotal = grandTotal - values[index].total;
		setGrandTotal(newTotal);
		values.splice(index, 1);
		setInputFields(values);
		setPaidAmount('');
		setPaymentMethod('');
	};  
	const disabledDate = (current) => {
		return current && current > moment().endOf("day");
	}  

	const disablePastDate = (current) => {
		let day = dates.getDate();
		day = day < 10 ? '0'+day : day;
		let month = +(dates.getMonth())+1;
		month = month < 10 ? '0'+month : month;
		let date = moment(`${day}/${month}/${dates.getFullYear()}`, dateFormat)
		if (current && current < date.startOf("day")) return true
		return false
	} 
	return (
		<>
		<div className={(visible) ? 'container d-none' : 'container'}>
			<Card>
				<Form
					//layout="horizontal"
					layout="vertical" hideRequiredMark form={form}
				>
					<div className="d-md-flex justify-content-md-between">
						<div className="">
							<h2 className="mb-3 font-weight-semibold">Sale Form</h2>
							<Form.Item style={{ margin: 0, padding: 0 }}>
								<Form.Item
									name="customerName"
									rules={[{ required: true, message:"Enter customer name" }]}
									style={{ display: 'inline-block', width: 'calc(60% - 5px)', marginRight: 8 }}
								>
									<Input placeholder="Customer name" value={customerName} onChange={handleNameChange}/>
								</Form.Item>
								<Form.Item
									name="customerNumber"
									rules={[{ required: true, message:"Enter TIN or Phone number" }]}
									style={{ display: 'inline-block', width: 'calc(40% - 5px)' }}
								>
									<InputNumber placeholder="TIN or Phone Number" className="w-100" value={customerNumber} onChange={handleNumberChange}/>
								</Form.Item>
							</Form.Item>
						</div>
					<div className="mt-3 text-right">
						<Form.Item name="dates">
							<DatePicker defaultValue={moment(new Date(), dateFormat)} format={dateFormat} disabledDate={disabledDate} onChange={handleDateChange}/>
						</Form.Item>
						
					</div>
				</div>
				<div className="mt-4 mb-5">
				{inputFields.map((inputField, index) => (
				<Row gutter={16} className="w-100" key={`${inputField}~${index}`}>
					<Col span={6}>
						<Form.Item name={`productName${index}`} label="Product" rules={[
							{
							required: true,
							message: `Product is required.`,
							},
						]}>
							<Select
								className="w-100"
								showSearch
								optionFilterProp="children"
								filterOption={(input, option) =>
								option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
								}
								disabled={loading}
								value={inputField.productName}
								onChange={value => handleproductNameChange(index, value)}
								>
								{allItems.map(({ label, index, value}) => (
								<Option key={index} value={value}>
									{label}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col span={4}>
						<Form.Item name={`purchasedType${index}`} label="Sold Type" rules={[
							{
							required: true,
							message: `Type is required.`,
							},
						]}>
							<Select
								className="w-100"
								disabled={inputField.pkgUnit === '0' && inputField.productType === '0'}
								value={inputField.purchasedType}
								onChange={value => handlePurchasedTypeChange(index, value)}
								>
								{inputField.soldByPiece === '1' && (<Option value='0'>Pieces</Option>)}
								{inputField.pkgUnit === '1' && (<Option value='1' disabled={inputField.pkgUnit !== '1'}>Carton</Option>)}
								{inputField.productType === '5' && (<Option value='6' disabled={inputField.productType !== '5'}>Dozen</Option>)}
								{inputField.productType === '4' && (<Option value='5' disabled={inputField.productType !== '4'}>Packet</Option>)}
								{inputField.productType === '3' && (<Option value='4' disabled={inputField.productType !== '3'}>Kilogram</Option>)}
								{inputField.productType === '1' && (<Option value='2' disabled={inputField.productType !== '1'}>Sq meter</Option>)}
								{inputField.productType === '2' && (<Option value='3' disabled={inputField.productType !== '2'}>Meters</Option>)}
							</Select>
						</Form.Item>
					</Col>
					<Col span={4}>
						<Form.Item name={`quantity${index}`} label="Quantity" rules={[
							{
							required: true,
							message: `This field is required.`,
							},
						]}>
							<InputNumber className="w-100" min={0} 
										formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										value={inputField.quantity}
										onChange={value => handleQuantityChange(index, value)}/>
						</Form.Item>
					</Col>
					<Col span={4}>
						<Form.Item name={`sellPrice${index}`} label="Price" rules={[
							{
							required: true,
							message: `This field is required.`,
							},
						]}>
							<InputNumber className="w-100" min={1} 
										formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										value={inputField.sellPrice}
										onChange={value => handleSellPriceChange(index, value)}
										onBlur={(value) => handlePriceChange(index, value)}/>
						</Form.Item>
					</Col>
					<Col span={3}>
						<Form.Item label="Total">
							<InputNumber className="w-100" min={0} value={inputField.total} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} disabled/>
						</Form.Item>
					</Col>
					<Col span={3}>
						{inputFields.length > 1 ? (
							<Form.Item label=" ">
								<MinusCircleOutlined
								className="ml-2"
								style={{fontSize: '24px'}}
								onClick={() => handleRemoveFields(index)}
								/>
							</Form.Item>
						) : null}	
					</Col>
				</Row>
				))}		
					<Form.Item>
						<Button
						type="dashed"
						onClick={() => handleAddFields()}
						>
						<PlusOutlined /> Add field
						</Button>
					</Form.Item>  
					<div className="d-flex justify-content-end">
						<div className="text-right ">
							<div className="border-bottom">
							</div>
							<h2 className="font-weight-semibold mt-3">
								<span className="mr-1">Grand Total: </span>
								<NumberFormat 
									displayType={'text'} 
									value={grandTotal} 
									suffix={'Rwf'} 
									thousandSeparator={true}
								/>
							</h2>
							<div className="d-md-flex justify-content-md-between">
								<div>
									
								</div>
								<div className="mt-3 text-right">
								<Form.Item style={{ marginBottom: 0 }} className="text-left">
										<Form.Item
											label="Paid Amount"
											name="PaidAmount"
											rules={[{ required: true }]}
											style={{ display: 'inline-block', width: 'calc(50% - 5px)', marginRight: 8 }}
										>
											<InputNumber placeholder="Amount Received" className="w-100" min={0} onChange={handlePaidChange} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} value={paidAmount}/>
										</Form.Item>
										<Form.Item
											label="Payment Method"
											name="paymentMethod"
											rules={[{ required: true, message: `Specify payment method.` }]}
											style={{ display: 'inline-block', width: 'calc(50% - 5px)' }}
										>
											<Select
												className="w-100"
												placeholder="-Select-"
												value={paymentMethod}
												onChange={handleMethodChange}
												>
													{parseInt(paidAmount) > 0 && (<Option value='Cash' disabled={paidAmount==='' || paidAmount===0}>Cash</Option>)}
													{parseInt(paidAmount) > 0 && (<Option value='Cheque' disabled={paidAmount==='' || paidAmount===0}>Cheque</Option>)}
													{parseInt(paidAmount) > 0 && (<Option value='Mobile Money' disabled={paidAmount==='' || paidAmount===0}>Mobile Money</Option>)}
													{parseInt(paidAmount) > 0 && (<Option value='Bank Transfer' disabled={paidAmount==='' || paidAmount===0}>Bank Transfer</Option>)}
													{parseInt(paidAmount) === 0 && (<Option value='Not Paid' disabled={paidAmount>0}>Not Paid</Option>)}
											</Select>
										</Form.Item>
										<Form.Item 
											label="When to pay the remaining amount?" 
											name="debtDate"
											className={ (grandTotal>0 && paidAmount !== '' && paymentMethod !== '' && paidAmount !== grandTotal) ? '' : 'd-none'}
											style={{ display: 'inline-block', width: 'calc(50% - 5px)' }}
											rules={[{ required: paidAmount !== grandTotal, message: `Specify date to pay the remaining amount.` }]}>
											<DatePicker className="w-100" format={dateFormat} disabledDate={disablePastDate} onChange={handleDeptDateChange} disabled={paidAmount === grandTotal}/>
										</Form.Item>
										<Form.Item name="comment"
											className={ (grandTotal>0 && paidAmount !== '' && paymentMethod !== '' && paidAmount !== grandTotal) ? 'pl-2' : 'd-none'}
											style={{ display: 'inline-block', width: 'calc(50% - 5px)' }}
											rules={[
												{
												required: paidAmount !== grandTotal,
												message: `Comment or description is required.`,
												},
												
											]}>
												<TextArea
												placeholder="Comment"
												autoSize={{ minRows: 3, maxRows: 5 }}
												/>
										</Form.Item>
									</Form.Item>
								</div>
							</div>
						</div>
					</div>
					
				</div>
				<hr className="d-print-none"/>
				<div className="text-right d-print-none">
					<Button type="secondary" className="mr-2" onClick={() => RedirectBack()}>
						<CloseCircleOutlined /> Cancel
					</Button>
					<Button type="primary" loading={buttonLoading} disabled={grandTotal===0 || buttonLoading} onClick={handleSubmit}>
						<SaveOutlined  />
						Save
					</Button>
				</div>
				</Form>
			</Card>
		</div>
		{visible &&(<Invoice receiptTotal={receiptTotal} receiptId={receiptId} orderDetails={orderDetails} salesInfo={salesInfo} shopName={shopName} shortTypes={shortTypes} getId={getId}/>)}
		</>
	);	
}

export default Sales
