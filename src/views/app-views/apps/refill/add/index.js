import React, { useState } from 'react'
import { SaveOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Card, Col, Row, Select, Button, DatePicker, InputNumber, message } from 'antd';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import { useHistory } from "react-router-dom";
import { DataService } from "services/move.service";
import { DataService as ProductService } from "services/products.service";
import { DataService as SourceService } from "services/source.service";

const dateFormat = 'DD/MM/YYYY';
const { Option } = Select;
const Add = ({systemData}) => { 	
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(true);
	const [dates, setDates] = useState(new Date());
	const [selected, setSelected] = useState([]);
	const [grandTotal, setGrandTotal] = useState(0);
	const [buttonLoading, setButtonLoading] = useState(false);

	let {products, productsLoading, records, recordsLoading, stores, storesLoading, userData } = systemData;
	records = recordsLoading ? [] : records.docs.filter(x => x.data().refunded === false);
	
	const [inputFields, setInputFields] = useState([
	  { product: '', productName: '', pkgUnit:'', productType:'', purchasedType:'', quantity: '0', costPrice: '0', sellPrice: '0', total:'0' }
	]);
	let history = useHistory();	
	const RedirectBack = () => {
		history.push(`/app/apps/refill/list`)
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
			let moveId = new Date().getTime();
			let shopCode = row.shopCode;
			let newStore = stores.docs.filter(x=> x.id === shopCode)[0];
			let shopName = newStore.data().name;
			let shopLocation = newStore.data().location;
			let data = {
				date: dates.getTime(),
				products: values.length,
				userId : userData.userId,
				amount: grandTotal,
				source:shopCode,
				backupSource:shopName,
				backupLocation:shopLocation,
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
					purchase:false,
					sales:false,
					move:true,
					damaged:false,
					refunded: false,
					source:shopCode,
					backupSource:shopName,
					backupLocation:shopLocation,
					backupUser:userData.displayName,
				};
				saveRecord(record.productName, shopCode);
				return SourceService.create(purchases);
			});
			DataService.create(data,moveId);
			setInputFields([{ product: '', productName: '', pkgUnit:'', productType:'', purchasedType: '',  quantity: '0', costPrice: '0', sellPrice: '0', total:'0', stock:'0' }]);
			setGrandTotal(0);
			setButtonLoading(false)
			RedirectBack();
			message.success('New Refill saved!');
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
		return selected;
	  })
	  allPrices = allRecords;
	  allItems = allItem;
	  if(loading){
	  setLoading(false);
	  }
	}
  
	function getQuantity(product,x,index) {    
		const values = [...inputFields]; 
		let body = [...records]; 
		body = body.filter(x => x.data().productName === product && x.data().sales === false  && x.data().date < +(dates.getTime()));
		const stockTotal = body.reduce((accumulator, currentElement) => {
			let quantity = currentElement.data().purchasedType === '0' ? currentElement.data().quantity : (currentElement.data().purchasedType === '1' ? currentElement.data().quantity * currentElement.data().qtyPkg : (parseInt(currentElement.data().purchasedType) > 3 ? (currentElement.data().pkgUnit === '1' ? parseInt(currentElement.data().quantity * currentElement.data().ctnSqm) : parseFloat(currentElement.data().quantity / currentElement.data().ctnSqm)) :(currentElement.data().pkgUnit === '1' ? parseInt(currentElement.data().quantity * (currentElement.data().qtyPkg/currentElement.data().ctnSqm)) : parseFloat(currentElement.data().quantity / currentElement.data().ctnSqm))));
		  return currentElement.data().move === true ? parseFloat(accumulator) - parseFloat(quantity) : parseFloat(accumulator) + parseFloat(quantity);
		},x)
	
		values[index].stock = stockTotal;
		setInputFields(values);
	  }

	const handleProductNameChange = (index, value) => {
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
		values[index].purchasedType = allPrices[value].pkgUnit === '0' ? '0' : '';
		values[index].productName = value;
		let sqmQty = !allPrices[value].sqmStock ? 0 : allPrices[value].productType === '0' ? 0 : ((parseInt(allPrices[value].productType) > 3 ? parseInt(allPrices[value].sqmStock * allPrices[value].ctnSqm) :(allPrices[value].pkgUnit === '1' ? parseInt(allPrices[value].sqmStock * (allPrices[value].qtyPkg/allPrices[value].ctnSqm)) : parseFloat(allPrices[value].sqmStock / allPrices[value].ctnSqm))));
		let pkgQty = allPrices[value].pkgUnit === '1' ? allPrices[value].pkgStock * allPrices[value].qtyPkg : 0;
      	let stockQuantity = parseFloat(pkgQty) + parseFloat(allPrices[value].pcsStock) + parseFloat(sqmQty);
		setInputFields(values);
		getQuantity(value,stockQuantity, index); 
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
		form.setFieldsValue({[`quantity${index}`]: 0,[`costPrice${index}`]:values[index].costPrice});
	} 
	const handleQuantityChange = (index, value) => {
		const values = [...inputFields];
		if(!values[index]) return;
		let newValue = value === '' ? '' : parseInt(value);
		let stock = values[index].purchasedType === '0' ? values[index].stock : (values[index].purchasedType === '1' ? parseInt(values[index].stock / values[index].qtyPkg) : (parseInt(values[index].purchasedType) > 4 ? parseInt(values[index].stock / values[index].ctnSqm) : (values[index].pkgUnit === '1' ? parseInt(values[index].stock / (values[index].qtyPkg/values[index].ctnSqm)) : parseInt(values[index].stock * values[index].ctnSqm))));
		if(newValue && newValue > stock){
			newValue = stock;
			form.setFieldsValue({[`quantity${index}`]: newValue});
			message.destroy();
			message.error("Unsufficient Quantity on hand!");
		}
		
		let newTotal = grandTotal - values[index].total;
		values[index].quantity = newValue;
		values[index].total = (newValue) ? values[index].costPrice * newValue : 0 ;  
		setGrandTotal(newTotal + values[index].total);  
		setInputFields(values);
	} 
  
	const handleAddFields = () => {
	  const values = [...inputFields];
	  values.push({ product: '',  productName: '', pkgUnit: '', purchasedType: '', quantity: '0', costPrice: '0', sellPrice: '0', total: '0' });
	  setInputFields(values);
	};
  
	const handleDateChange = date => {
		setDates(new Date(date.format('YYYY-MM-DD HH:mm:ss')));
		setInputFields([
			{ product: '', productName: '', pkgUnit:'', productType:'', purchasedType:'', quantity: '0', costPrice: '0', sellPrice: '0', total:'0' }
		  ]);
		setGrandTotal(0);  
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
	};
	const disabledDate = (current) => {
		return current && current > moment().endOf("day");
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
							<h2 className="mb-1 font-weight-semibold">New Refill Form</h2>
							<Form.Item
								name="shopCode"
								className="mt-3"
								label="Store to refill"
								rules={[{ required: true, message: 'Select store to refill' }]}
							>
								<Select placeholder=" --Select-- ">
								{!storesLoading && stores.docs.map((store, index) => (
									<Option key={index} value={store.data()._id}>
									{store.data().name}
									</Option>
								))}
								</Select>
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
						<Form.Item name={`productName${index}`} hasFeedback={loading} validateStatus="validating" label="Product" rules={[
							{
							required: true,
							message: `Product is required.`,
							},
						]}>
							<Select
								className="w-100"
								disabled={loading}
								id="validating"
								showSearch
								optionFilterProp="children"
								filterOption={(input, option) =>
								option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
								}
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
								<Option value='0'>Pieces</Option>
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
						<Form.Item name={`quantity${index}`} hasFeedback={recordsLoading} validateStatus="validating" label="Quantity" rules={[
							{
							required: true,
							message: `This field is required.`,
							},
						]}>
							<InputNumber className="w-100" min={0} 
										id="validating"
										formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										value={inputField.quantity}
										onChange={value => handleQuantityChange(index, value)}/>
						</Form.Item>
					</Col>
					<Col span={4}>
						<Form.Item name={`costPrice${index}`} label="Price" rules={[
							{
							required: true,
							message: `This field is required.`,
							},
						]}>
							<InputNumber className="w-100" min={0} 
										formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										value={inputField.costPrice}
										disabled/>
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
								<span className="mr-1">Total Value: </span>
								<NumberFormat 
									displayType={'text'} 
									value={grandTotal} 
									suffix={'Rwf'} 
									thousandSeparator={true}
								/>
							</h2>
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
