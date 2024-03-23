import React, { useState } from 'react'
import { SaveOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Card, Col, Row, Select, Button, DatePicker, Input, InputNumber, message } from 'antd';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import { useHistory } from "react-router-dom";
import { DataService } from "services/purchases.service";
import { DataService as MoveService } from "services/move.service";
import { DataService as ProductService } from "services/products.service";
import { DataService as SourceService } from "services/source.service";
import { DataService as SuppliersService } from "services/suppliers.service";
import { DataService as RecordsService } from "services/records.service";

const { TextArea } = Input;
const dateFormat = 'DD/MM/YYYY';
const { Option } = Select;
const Add = ({systemData}) => { 	
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(true);
	const [dates, setDates] = useState(new Date());
	const [deptDate, setDeptDate] = useState(0);
	const [supplierName, setSupplierName] = useState('');
	const [supplierNumber, setSupplierNumber] = useState('');
	const [selected, setSelected] = useState([]);
	const [grandTotal, setGrandTotal] = useState(0);
	const [paidAmount, setPaidAmount] = useState('');
	const [paymentMethod, setPaymentMethod] = useState('');
	const [buttonLoading, setButtonLoading] = useState(false);
	const { products, productsLoading, stores, singleShop, multiShop,  storesLoading, shops, shopsLoading, userData, setting, setsLoading } = systemData;
	const [shop, setShop] = useState(undefined);
	const [shopDisplay, setShopDisplay] = useState(false);
	const [inputFields, setInputFields] = useState([
	  { product: '', productName: '', pkgUnit:'', productType:'', purchasedType:'', quantity: '0', costPrice: '0', sellPrice: '0', total:'0' }
	]);
	let history = useHistory();	
	const RedirectBack = () => {
		history.push(`/app/apps/purchases/list`)
	}
	const saveRecord = (productId, shopId) =>{
		ProductService.getRow(productId).then(data=>{
			let product = data.data();
			product[shopId] = true;
			ProductService.update(productId,product);
		}).catch(()=>{})
	}
	const handleSubmit = async () => {
		try {
			setButtonLoading(true)
			const row = await form.validateFields();
			const values = [...inputFields];
			let purchaseId = new Date().getTime();
			let shopCode = shopDisplay ? row.shopCode : ''; 
			let comment = row.comment ? row.comment : '';
			let newStore = (!shopsLoading && shopDisplay ) ? shops[shopCode] : {'name':'','location':''};
			let shopName = newStore.name;
			let shopLocation = newStore.location;
			let recordId = +(purchaseId);
			let payCounter = paidAmount > 0 ? 1 :0;
			let supplier = {
				supplierName,
				supplierNumber,
			}
			let shopData = {
				source:shopCode,
				backupSource:shopName,
				backupLocation:shopLocation,
			}
			if(!shopDisplay) shopData = {};
			let records ={
				date: recordId,
				amount: paidAmount,
				method: paymentMethod,
				type: 2,
				userId : userData.userId,
				backupUser:userData.displayName,
				...supplier,
				...shopData,
			}
			let record={
				[`payID${payCounter}`]: payCounter ? recordId : '',
				[`amount${payCounter}`]: paidAmount,
				[`method${payCounter}`]: payCounter ? paymentMethod : '',
			}
			let data = {
				date: dates.getTime(),
				debt: deptDate,
				comment,
				products: values.length,
				paid: paidAmount,
				refunded: false,
				payCounter,
				userId : userData.userId,
				amount: grandTotal,
				backupUser:userData.displayName,
				...supplier,
				...record,
			}
			values.map(function(record){
				let purchases = {
				date:dates.getTime(),
				product : record.product,
				costPrice : record.costPrice,
				sellPrice  : record.sellPrice ,
				quantity : record.quantity,
				pkgUnit : record.pkgUnit,
				ctnSqm : record.ctnSqm,
				qtyPkg : record.qtyPkg,
				productType : record.productType,
				purchasedType : record.purchasedType,
				productName : record.productName,
				total : record.total,
				userId : userData.userId,
				purchaseId,
				purchase:true,
				sales:false,
				move:false,
				damaged:false,
				refunded: false,
				backupUser:userData.displayName,
				};
				SourceService.create(purchases);
				if(shopDisplay && shop){
					let moveId = new Date().getTime();
					let shopCode = shop;
					let data = {
						date: dates.getTime(),
						products: values.length,
						userId : userData.userId,
						amount: grandTotal,
						automatic: true,
						...shopData,
						backupUser:userData.displayName,
					}
					values.map(function(record){
						let purchases = {
							date:dates.getTime(),
							product : record.product,
							costPrice : record.costPrice,
							sellPrice  : record.sellPrice ,
							total : record.total,
							quantity : record.quantity,
							pkgUnit : record.pkgUnit,
							ctnSqm : record.ctnSqm,
							qtyPkg : record.qtyPkg,
							productType : record.productType,
							purchasedType : record.purchasedType,
							productName : record.productName,
							userId : userData.userId,
							moveId,
							purchaseId,
							purchase:false,
							sales:false,
							move:true,
							damaged:false,
							refunded: false,
							...shopData,
							backupUser:userData.displayName,
						};
						saveRecord(record.productName, shopCode);
						return SourceService.create(purchases);
					});
					MoveService.create(data,moveId);
				}
				return selected;
			});
			DataService.create(data,purchaseId);
			if(paidAmount > 0) RecordsService.create(records,recordId);
			SuppliersService.create(supplier,supplierNumber);
			setInputFields([{ product: '', productName: '', pkgUnit:'', productType:'', purchasedType: '',  quantity: '0', costPrice: '0', sellPrice: '0', total:'0' }]);
			setGrandTotal(0);
			setButtonLoading(false)
			RedirectBack();
			message.success('New Purchase added!');
		} catch (errInfo) {setButtonLoading(false)}
	}

	let allPrices = [];
	let allItems = [];
	if(!productsLoading){
	  let allRecords = [];
	  let allItem = [];
	  products.docs.map((doc, index) => {    
		allRecords = {
		  ...allRecords,
		  [doc.data()._id] : {...doc.data(), name:doc.data().productName},
		}
		allItem = [
		  ...allItem,
		  {label: doc.data().productName, value: doc.id, index:index},
		]
		return true;
	  })
	  allPrices = allRecords;
	  allItems = allItem;
	  if(loading){
	  setLoading(false);
	  }
	}
  
	const handleProductNameChange = (index, value) => {
		const values = [...inputFields];
		if(shopDisplay && !shop){
			form.setFieldsValue({[`quantity${index}`]: ''});
			message.error("Select Store to continue");
			return;
		}
		values[index].product = allPrices[value].name;
		values[index].costPrice = allPrices[value].pkgUnit === '0' ? allPrices[value].pcsPurchasePrice : 0;
		values[index].sellPrice = allPrices[value].pkgUnit === '0' ? allPrices[value].pcsSalePrice : 0;
		values[index].total = 0;
		values[index].quantity = 0;
		values[index].pkgUnit = allPrices[value].pkgUnit;
		values[index].ctnSqm = allPrices[value].ctnSqm;
		values[index].qtyPkg = allPrices[value].qtyPkg;
		values[index].soldByPiece = allPrices[value].soldByPiece;
		values[index].productType = allPrices[value].productType;
		values[index].purchasedType = (allPrices[value].pkgUnit === '0' && allPrices[value].productType === '0') ? '0' : '';
		values[index].productName = value;
		setInputFields(values);
		form.setFieldsValue({[`purchasedType${index}`]:values[index].purchasedType, [`total${index}`]:0, [`quantity${index}`]: 0, [`costPrice${index}`]:values[index].costPrice});
	} 
	const handlePurchasedTypeChange = (index, value) => {
		const values = [...inputFields];
		if(!values[index]) return;
		values[index].costPrice = value === '0' ? allPrices[values[index].productName].pcsPurchasePrice : (value === '1' ? allPrices[values[index].productName].pkgPurchasePrice : (value === '2' ? (allPrices[values[index].productName].pkgUnit === '1' ? parseInt((allPrices[values[index].productName].qtyPkg / allPrices[values[index].productName].ctnSqm) * allPrices[values[index].productName].pkgPurchasePrice) : parseInt(allPrices[values[index].productName].pcsPurchasePrice / allPrices[values[index].productName].ctnSqm)) : parseInt(allPrices[values[index].productName].pcsPurchasePrice / allPrices[values[index].productName].ctnSqm)))
		values[index].sellPrice = value === '0' ? allPrices[values[index].productName].pcsSalePrice : (value === '1' ? allPrices[values[index].productName].pkgSalePrice : allPrices[values[index].productName].sqmPrice);
		values[index].purchasedType = value;
		values[index].quantity = 0;
		setInputFields(values);
		form.setFieldsValue({[`quantity${index}`]: 0,[`costPrice${index}`]:values[index].costPrice,[`total${index}`]: 0});
	} 
	const handleQuantityChange = (index, value) => {
		const values = [...inputFields];
		if(!values[index]) return;
		let newValue = value === '' ? '' : parseFloat(value);
		let newTotal = grandTotal - values[index].total;
		values[index].quantity = newValue;
		values[index].total = (newValue) ? values[index].costPrice * newValue : 0 ;  
		setGrandTotal(newTotal + values[index].total);  
		setInputFields(values);
	} 
	const handleCostPriceChange = (index, value) => {
		const values = [...inputFields];
		if(!values[index]) return;
		let newValue = value === '' ? '' : parseInt(value);
		let newTotal = grandTotal - values[index].total;
		values[index].costPrice = newValue;
		values[index].total = (newValue && values[index].quantity) ? values[index].quantity * newValue : 0;  
		setGrandTotal(newTotal + values[index].total);  
		setInputFields(values);
	} 
  
	const handleAddFields = () => {
	  const values = [...inputFields];
	  values.push({ product: '', productName: '', pkgUnit: '', productType:'', purchasedType: '', quantity: '0', costPrice: '0', sellPrice: '0', total: '0' });
	  setInputFields(values);
	};
  
	const handleDateChange = date => {
		setDates(new Date(date.format('YYYY-MM-DD HH:mm:ss')));
		setInputFields([
			{ product: '', productName: '', pkgUnit:'', productType:'', purchasedType:'', quantity: '0', costPrice: '0', sellPrice: '0', total:'0'}
		  ]);
		setGrandTotal(0);
		setPaidAmount('');
		setPaymentMethod('');  
		form.setFieldsValue({'PaidAmount': '', paymentMethod: '', debtDate:''});
	};
		
	const handleDeptDateChange = date => {
		setDeptDate(new Date(date.format('YYYY-MM-DD HH:mm:ss')).getTime());
	};
	const handleNameChange = event => {
		setSupplierName(event.target.value);
	};
	
	const handleNumberChange = value => {
		let newValue = ((!value && value !== 0 )|| value === '') ? '' : ((value+'').length > 9 ? (value+'').slice(0,9) : parseInt(value));
		let newTin = ((!value && value !== 0 )|| value === '') ? '' : parseInt(value);
		let check = (value+'').slice(0,2);

		if(newValue){
			newValue = check === ('78' || '79' || '73' || '72') ? ('0' + newValue) : newTin;
		}
		setSupplierNumber(newValue);
		form.setFieldsValue({'supplierNumber': newValue});
	};
	
	const handlePaidChange = value => {
		let newValue = ((!value && value !== 0 )|| value === '') ? '' : parseInt(value);
		newValue = (newValue && newValue) > grandTotal ? grandTotal : newValue;
		setPaidAmount(newValue);
		setPaymentMethod('');	
		form.setFieldsValue({'PaidAmount': newValue, paymentMethod: '', debtDate:''});
	};
	
	const handleMethodChange = value => {
		setPaymentMethod(value);
	};
  
	const handleShopChange = value => {
		setShop(value);
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
	  form.setFieldsValue({'PaidAmount': '', paymentMethod: '', debtDate:''});
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

	if(!setsLoading && setting.purchases && parseInt(setting.purchases.value) === 1 && !shopDisplay){
		setShopDisplay(true);
	}

	if(!multiShop && singleShop && !shop && shopDisplay){
		setShop(singleShop);
		form.setFieldsValue({'shopCode': singleShop});
	}
	return (
		<div className="container">
			<Card>
				<Form
					//layout="horizontal"
					layout="vertical" hideRequiredMark form={form}
				>
					<div className="d-md-flex justify-content-md-between">
						<div className="">
							<h2 className="mb-1 font-weight-semibold">Purchase Form</h2>
							{shopDisplay ? (<Form.Item
								name="shopCode"
								label="Store to sell from"
								className={multiShop ? 'mt-3' : 'd-none'}
								rules={[{ required: true, message: 'a store is required' }]}
							>
								<Select placeholder="Select a store" onChange={handleShopChange}>
								{!storesLoading && stores.docs.map((store, index) => (
									<Option key={index} value={store.data()._id}>
									{store.data().name}
									</Option>
								))}
								</Select>
							</Form.Item>) : null}
						</div>
						<div className="mt-3 text-right">
						<Form.Item name="dates">
							<DatePicker defaultValue={moment(new Date(), dateFormat)} format={dateFormat} disabledDate={disabledDate} onChange={handleDateChange}/>
						</Form.Item>
						<Form.Item style={{ margin: 0, padding: 0 }}>
							<Form.Item
								name="supplierName"
								rules={[{ required: true, message:"Enter supplier name" }]}
								style={{ display: 'inline-block', width: 'calc(60% - 5px)', marginRight: 8 }}
							>
								<Input placeholder="Supplier name" value={supplierName} onChange={handleNameChange}/>
							</Form.Item>
							<Form.Item
								name="supplierNumber"
								rules={[{ required: true, message:"Enter TIN or Phone Number" }]}
								style={{ display: 'inline-block', width: 'calc(40% - 5px)' }}
							>
								<InputNumber placeholder="TIN or Phone Number" className="w-100" value={supplierNumber} onChange={handleNumberChange}/>
							</Form.Item>
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
								onChange={value => handleProductNameChange(index, value)}
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
						<Form.Item name={`purchasedType${index}`} label="Type" rules={[
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
								{inputField.productType === '5' && (<Option value='6' disabled={inputField.productType !== '5'}>Dozen</Option>)}
								{inputField.productType === '4' && (<Option value='5' disabled={inputField.productType !== '4'}>Packet</Option>)}
								{inputField.productType === '3' && (<Option value='4' disabled={inputField.productType !== '3'}>Kilogram</Option>)}
								{inputField.productType === '1' && (<Option value='2' disabled={inputField.productType !== '1'}>Sq meter</Option>)}
								{inputField.productType === '2' && (<Option value='3' disabled={inputField.productType !== '2'}>Meters</Option>)}
								<Option value='0'>Pieces</Option>
								{inputField.pkgUnit === '1' && (<Option value='1' disabled={inputField.pkgUnit !== '1'}>Carton</Option>)}
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
						<Form.Item name={`costPrice${index}`} label="Cost Price" rules={[
							{
							required: true,
							message: `This field is required.`,
							},
						]}>
							<InputNumber className="w-100" min={0} 
										formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										value={inputField.costPrice}
										onChange={value => handleCostPriceChange(index, value)}/>
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
								<div className="mt-3 text-right">
								<Form.Item style={{ marginBottom: 0 }} className="text-left">
										<Form.Item
											label="Paid Amount"
											name="PaidAmount"
											rules={[{ required: true }]}
											style={{ display: 'inline-block', width: 'calc(50% - 5px)', marginRight: 8 }}
										>
											<InputNumber placeholder="Amount Paid" className="w-100" min={0} onChange={handlePaidChange} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} value={paidAmount}/>
										</Form.Item>
										<Form.Item
											label="Payment Method"
											name="paymentMethod"
											rules={[{ required: true,message: `Specify payment method.` }]}
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
					<Button type="primary" loading={buttonLoading} disabled={grandTotal===0 || buttonLoading} onClick={handleSubmit}>
						<SaveOutlined  />
						Save
					</Button>
				</div>
				</Form>
			</Card>
		</div>
	);	
}

export default Add
