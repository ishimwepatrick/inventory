import React, { useState } from 'react'
import { SaveOutlined, MinusCircleOutlined, PlusOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Form, Card, Col, Row, Select, Button, DatePicker, InputNumber, message } from 'antd';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import { useHistory } from "react-router-dom";
import { DataService as SourceService } from "services/source.service";

const dateFormat = 'DD/MM/YYYY';
const { Option } = Select;
const Sales = ({systemData}) => { 	
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(true);
	const [dates, setDates] = useState(new Date());
	const [selected, setSelected] = useState([]);
	const [grandTotal, setGrandTotal] = useState(0);
	const [buttonLoading, setButtonLoading] = useState(false);
	let {products, productsLoading, records, recordsLoading, singleShop, multiShop, stores, storesLoading, userData } = systemData;
	records = recordsLoading ? [] : records.docs.filter(x => x.data().refunded === false);
	const [shop, setShop] = useState(undefined);
	const [inputFields, setInputFields] = useState([
	  { product: '', productName: '', pkgUnit:'', productType:'', purchasedType:'', quantity: '0', costPrice: '0', sellPrice: '0', total:'0', stock:'0' }
	]);
	let history = useHistory();	
	const RedirectBack = () => {
		history.push(`/app/apps/damaged/list`)
	}
	const handleSubmit = async () => {
		setButtonLoading(true)
		try {
			const row = await form.validateFields();
			let values = [...inputFields];
			let shopCode = row.shopCode; 
			let newStore = stores.docs.filter(x=> x.id === shopCode)[0];
			let shopName = newStore.data().name;
			let shopLocation = newStore.data().location;
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
				purchase:false,
				sales:false,
				move:false,
				damaged:true,
				refunded:false,
				source:shopCode,
				backupSource:shopName,
				backupLocation:shopLocation,
				backupUser:userData.displayName,
			};
			return SourceService.create(purchases);
			});
			setInputFields([{ product: '', productName: '', pkgUnit:'', productType:'', purchasedType: '',  quantity: '0', costPrice: '0', sellPrice: '0', total:'0', stock:'0' }]);
			setGrandTotal(0);
			setButtonLoading(false)
			RedirectBack();
			message.success("Product damaged reported!")
		} catch (errInfo) {setButtonLoading(false)}	
	};
	  let allPrices = [];
	  let allItems = [];
	  if(!productsLoading && !recordsLoading){
		let allRecords = [];
		let allItem = [];
		products.docs.map((doc, index) => {    
		  allRecords = {
			...allRecords,
			[doc.data()._id] : {...doc.data(), name:doc.data().productName},
		  }
		  allItem = [
			...allItem,
			{label: doc.data().productName, value: doc.id, index:index, product: doc.data()},
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
		body = body.filter(x => x.data().productName === product && x.data().refunded === false && x.data().purchase === false && x.data().source === shop && x.data().date < +(dates.getTime()));
		const stockTotal = body.reduce((accumulator, currentElement) => {
			let quantity = currentElement.data().purchasedType === '0' ? currentElement.data().quantity : (currentElement.data().purchasedType === '1' ? currentElement.data().quantity * currentElement.data().qtyPkg : (parseInt(currentElement.data().purchasedType) > 4 ? parseFloat(currentElement.data().quantity * currentElement.data().ctnSqm) :(currentElement.data().pkgUnit === '1' ? parseFloat(currentElement.data().quantity * (currentElement.data().qtyPkg/currentElement.data().ctnSqm)) : parseFloat(currentElement.data().quantity / currentElement.data().ctnSqm))));
		  return currentElement.data().move === true ? parseFloat(accumulator) + parseFloat(quantity) : parseFloat(accumulator) - parseFloat(quantity);
		},initialStock)
		values[index].stock = stockTotal;
		setInputFields(values);
	  }
	  const handleproductNameChange = (index, value) => {
		const values = [...inputFields];
		if(!shop){
			form.setFieldsValue({[`quantity${index}`]: ''});
			message.destroy()
			message.error("Select Shop to continue");
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
		values[index].productType = allPrices[value].productType;
		values[index].purchasedType = (allPrices[value].pkgUnit === '0' && allPrices[value].productType === '0') ? '0' : '';
		values[index].productName = value;
		values[index].initSqm = allPrices[value][`${shop}sqmStock`] ? allPrices[value][`${shop}sqmStock`] : 0;
		values[index].initPcs = allPrices[value][`${shop}pcsStock`] ? allPrices[value][`${shop}pcsStock`] : 0;
		values[index].initPkg = allPrices[value][`${shop}pkgStock`] ? allPrices[value][`${shop}pkgStock`] : 0;
		values[index].initPkg = values[index].initPkg * allPrices[value].qtyPkgBk;
		values[index].initSqm = !values[index].initSqm ? 0 : allPrices[value].productType === '0' ? 0 : ((parseInt(allPrices[value].productType) > 3 ? parseInt(values[index].initSqm * allPrices[value].ctnSqm) :(allPrices[value].pkgUnit === '1' ? parseInt(values[index].initSqm * (allPrices[value].qtyPkg/allPrices[value].ctnSqm)) : parseFloat(values[index].initSqm / allPrices[value].ctnSqm))));
		getQuantity(value, index); 
		form.setFieldsValue({[`purchasedType${index}`]:values[index].purchasedType, [`total${index}`]:0, [`quantity${index}`]: 0,[`costPrice${index}`]:values[index].sellPrice});
	 }

	const handlePurchasedTypeChange = (index, value) => {
		const values = [...inputFields];
		if(!values[index]) return;
		values[index].costPrice = value === '0' ? allPrices[values[index].productName].pcsPurchasePrice : (value === '1' ? allPrices[values[index].productName].pkgPurchasePrice : (allPrices[values[index].productName].qtyPkg/allPrices[values[index].productName].ctnSqm) * allPrices[values[index].productName].pcsSalePrice);
		values[index].sellPrice = value === '0' ? allPrices[values[index].productName].pcsSalePrice : (value === '1' ? allPrices[values[index].productName].pkgSalePrice : allPrices[values[index].productName].sqmPrice);
		values[index].purchasedType = value;
		values[index].quantity = 0;
		form.setFieldsValue({[`quantity${index}`]: 0,[`costPrice${index}`]:values[index].sellPrice,[`total${index}`]: 0});
		setInputFields(values);
	}

	const handleQuantityChange = (index, value) => {	
		const values = [...inputFields];
		if(!values[index]) return;
		if(!shop){
			form.setFieldsValue({[`quantity${index}`]: ''});
			message.destroy()
			message.error("Select Shop to continue");
			return;
		}
		let newValue = value === '' ? '' : parseFloat(value);
		let stock = values[index].purchasedType === '0' ? values[index].stock : (values[index].purchasedType === '1' ? parseFloat(values[index].stock / values[index].qtyPkg) : (parseFloat(values[index].purchasedType) > 4 ? parseFloat(values[index].stock / values[index].ctnSqm) : (values[index].pkgUnit === '1' ? parseFloat(values[index].stock / (values[index].qtyPkg/values[index].ctnSqm)) : parseFloat(values[index].stock * values[index].ctnSqm))));
		if(newValue && newValue > stock){
			newValue = stock;
			form.setFieldsValue({[`quantity${index}`]: newValue});
			message.destroy()
			message.error("can not damage more than store Quantity!");
		}
		let newTotal = grandTotal - values[index].total;
		values[index].quantity = newValue;
		values[index].total = (newValue) ? values[index].sellPrice * newValue : 0 ;  
		setGrandTotal(newTotal + values[index].total);  
		setInputFields(values);
	} 
	
	
	const handleAddFields = () => {
		const values = [...inputFields];
		values.push({ product: '', productCode: '', productName: '', pkgUnit: '', purchasedType: '', quantity: '0', costPrice: '0', sellPrice: '0', total: '0', stock:'0' });
		setInputFields(values);
	};
	
	const handleDateChange = date => {
		setDates(new Date(date.format('YYYY-MM-DD HH:mm:ss')));
		setInputFields([{ product: '', productCode: '', productName: '', pkgUnit:'', productType:'', purchasedType: '',  quantity: '0', costPrice: '0', sellPrice: '0', total:'0', stock:'0' }]);
		setGrandTotal(0);
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
	};  
	const disabledDate = (current) => {
		return current && current > moment().endOf("day");
	}  
	if(!multiShop && singleShop && !shop){
		setShop(singleShop);
		form.setFieldsValue({'shopCode': singleShop});
	}
	return (
		<div className='container'>
			<Card>
				<Form
					//layout="horizontal"
					layout="vertical" hideRequiredMark form={form}
				>
					<div className="d-md-flex justify-content-md-between">
						<div className="">
							<h2 className="mb-1 font-weight-semibold">Wastage products Form</h2>
							<Form.Item
								name="shopCode"
								label="Store to report from"
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
								{(shop) && allItems.filter(x => x.product[shop] === true).map(({ label, index, value}) => (
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
								disabled={inputField.pkgUnit !== '1' && inputField.productType === '0'}
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
						<Form.Item name={`costPrice${index}`} label="Price" rules={[
							{
							required: true,
							message: `This field is required.`,
							},
						]}>
							<InputNumber className="w-100" min={1} 
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
								<span className="mr-1">Total Loss: </span>
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
	);	
}

export default Sales
