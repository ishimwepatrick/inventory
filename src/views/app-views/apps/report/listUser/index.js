import React,{ useState } from 'react'
import { Card, Form, Modal, Row, Col, Select, Button } from 'antd';
import Flex from 'components/shared-components/Flex'
import { Typography } from "antd";
import List from './list';
import moment from 'moment';
import { DatePicker } from 'antd';
import { CloudDownloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Option } = Select;
let stockTotal = 0;
let openingStock = '.';
let reportData = [];
const Report = ({systemData}) => {
	const [form] = Form.useForm();
	const [ fdate, setFdate ] = useState(0)
	const [ product, setProduct ] = useState('')
	const [visible, setVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loaded, setLoaded] = useState(false);
	let { products, productsLoading, records, recordsLoading, userData, shortTypes } = systemData;
	records = recordsLoading ? [] : records.docs.filter(x => x.data().refunded === false && x.data().source === userData.userStore && x.data().purchase === false && x.data().productName === product);
	const rangeConfig = {
		rules: [{ type: 'array', required: true, message: 'Please select time!' }],
	  };
	 
	let allItems = [];
	let allProducts = [];
	if(!productsLoading){
		let allItem = [];
		let allProduct = [];
		products.docs.filter(x => x.data()[userData.userStore] === true).map((doc, index) => {    
			allProduct = {
				...allProduct,
				[doc.data()._id] : {...doc.data()},
			  }
			allItem = [
				...allItem,
				{label: doc.data().productName, value: doc.id, index:index},
			]
			return true;
		})
		allItems = allItem;
		allProducts = allProduct;
		if(loading){
			setLoading(false);
		}
	}  

	if(!recordsLoading && product){
		let body = [...records]; 
		body = body.filter(x => x.data().date < fdate && x.data().productName === product);
		let initialStock = 0;
		if(allProducts[product].usedStore !== undefined){
			allProducts[product].usedStore.split('**;;@!*.').map(store =>{
				if(userData.userRole === 'Sales' && store !== userData.userStore) {return true}
				let sqmQty = !allProducts[product][`${store}sqmStock`] ? 0 : allProducts[product].productType === '0' ? 0 : ((parseFloat(allProducts[product].productType) > 3 ? parseFloat(allProducts[product][`${store}sqmStock`] * allProducts[product].ctnSqm) :(allProducts[product].pkgUnit === '1' ? parseFloat(allProducts[product][`${store}sqmStock`] * (allProducts[product].qtyPkg/allProducts[product].ctnSqm)) : parseFloat(allProducts[product][`${store}sqmStock`] / allProducts[product].ctnSqm))));
				return initialStock += sqmQty + allProducts[product][`${store}pcsStock`] + (allProducts[product][`${store}pcsStock`]*allProducts[product].qtyPkgBk);
			})
		}
		stockTotal = body.reduce((accumulator, currentElement) => {
			let quantity = currentElement.data().purchasedType === '0' ? currentElement.data().quantity : (currentElement.data().purchasedType === '1' ? currentElement.data().quantity * currentElement.data().qtyPkg : (parseInt(currentElement.data().purchasedType) > 4 ? parseFloat(currentElement.data().quantity * currentElement.data().ctnSqm) :(currentElement.data().pkgUnit === '1' ? parseFloat(currentElement.data().quantity * (currentElement.data().qtyPkg/currentElement.data().ctnSqm)) : parseFloat(currentElement.data().quantity / currentElement.data().ctnSqm))));
		  return currentElement.data().move === true ? parseFloat(accumulator) + parseFloat(quantity) : parseFloat(accumulator) - parseFloat(quantity);
		},initialStock)
		let {pkgUnit,qtyPkg,ctnSqm,productType} = allProducts[product];
		let cartons = body.length > 0 ? (body[0].data().pkgUnit ===  '1' ? parseInt(stockTotal/body[0].data().qtyPkg) : 0) : 0;
		let remaining = body.length > 0 ? stockTotal - (cartons * body[0].data().qtyPkg) : 0;
		let others = parseInt(productType) > 3 ? (body.length > 0 ? parseInt(remaining / ctnSqm) : 0) : '';
		others = (parseInt(productType) > 3 && pkgUnit ===  '1') ? `and ${others} ${shortTypes[productType]} `: (parseInt(productType) > 3 ? `${others} ${shortTypes[productType]} ` : '');
		let pieces = body.length > 0 ? (parseInt(productType) > 3 ? parseInt(remaining % ctnSqm) : parseInt(remaining)) : 0;
		openingStock = pkgUnit ===  '1' ? `${cartons} Cts ${others}and ${pieces} ${shortTypes[0]}` : `${others}${pieces} ${shortTypes[0]}`;
		let sqMeters = (productType ===  '1' && pkgUnit ===  '1') ? stockTotal*(ctnSqm/qtyPkg): (productType ===  '1' && pkgUnit ===  '0') ? stockTotal*ctnSqm : 0;
		let meters = (productType ===  '2' && pkgUnit ===  '1') ? stockTotal*ctnSqm*qtyPkg: (productType ===  '2' && pkgUnit ===  '0') ? stockTotal*ctnSqm : 0;
		let kilos = (productType ===  '3' && pkgUnit ===  '1') ? stockTotal*ctnSqm*qtyPkg: (productType ===  '3' && pkgUnit ===  '0') ? stockTotal*ctnSqm : 0;
		let meter = productType === '2' ? ' and ' + parseInt(meters % ctnSqm) + shortTypes[productType] : ''; 
		let sqMeter = (productType === '1' && pkgUnit ===  '0') ? ' and ' + parseFloat(sqMeters % ctnSqm) + shortTypes[productType] : ''; 
		let kg = productType === '3' ? ' and ' + parseInt(kilos % ctnSqm) +' '+ shortTypes[productType] : ''; 
		openingStock +=  meter + sqMeter + kg;
	  }
	  
	  const setTableData = (subscriber) => {
		let {pkgUnit,qtyPkg,purchasedType,quantity,ctnSqm,productType,move,sales,saleId,damaged,date,moveId} = subscriber.data();
		let qty = purchasedType === '0' ? quantity : (purchasedType === '1' ? quantity * qtyPkg : (parseInt(purchasedType) > 4 ? parseInt(quantity * ctnSqm) :(pkgUnit === '1' ? parseInt(quantity * (qtyPkg/ctnSqm)) : parseFloat(quantity / ctnSqm))));
		stockTotal = move === true ? parseFloat(stockTotal + qty) : parseFloat(stockTotal - qty);
		let sqMeters = (productType ===  '1' && pkgUnit ===  '1') ? stockTotal*(ctnSqm/qtyPkg): (productType ===  '1' && pkgUnit ===  '0') ? stockTotal*ctnSqm : 0;
		let meters = (productType ===  '2' && pkgUnit ===  '1') ? stockTotal*ctnSqm*qtyPkg: (productType ===  '2' && pkgUnit ===  '0') ? stockTotal*ctnSqm : 0;
		let kilos = (productType ===  '3' && pkgUnit ===  '1') ? stockTotal*ctnSqm*qtyPkg: (productType ===  '3' && pkgUnit ===  '0') ? stockTotal*ctnSqm : 0;
		let cartons = pkgUnit ===  '1' ? parseInt(stockTotal/qtyPkg) : 0;
		let remaining = stockTotal - (cartons * qtyPkg);
		let others = parseInt(productType) > 3 ? parseInt(remaining / ctnSqm) : '';
		others = (parseInt(productType) > 3 && pkgUnit ===  '1') ? `and ${others} ${shortTypes[productType]} `: (parseInt(productType) > 3 ? `${others} ${shortTypes[productType]} ` : '');
		let pieces = parseInt(productType) > 3 ? parseInt(remaining % ctnSqm) : parseInt(remaining);
		let result = pkgUnit ===  '1' ? `${cartons} Cts ${others}and ${pieces} ${shortTypes[0]}` : `${others}${pieces} ${shortTypes[0]}`;
		let meter = productType === '2' ? ' and ' + parseInt(meters % ctnSqm) + shortTypes[productType] : ''; 
		let sqMeter = (productType === '1' && pkgUnit ===  '0') ? ' and ' + (parseFloat(sqMeters % ctnSqm)+'').slice(0,5) + shortTypes[productType] : ''; 
		let kg = productType === '3' ? ' and ' + parseInt(kilos % ctnSqm) +' '+ shortTypes[productType] : ''; 
		result +=  meter + sqMeter + kg;
		let subQuantity = purchasedType === '0' ? quantity : (purchasedType === '1' ? quantity * qtyPkg : (parseInt(purchasedType) > 4 ? parseInt(quantity * ctnSqm) :(pkgUnit === '1' ? parseFloat(quantity * (qtyPkg/ctnSqm)) : parseFloat(quantity / ctnSqm))));

		let sqMeters2 = (productType ===  '1' && pkgUnit ===  '1') ? subQuantity*(ctnSqm/qtyPkg): (productType ===  '1' && pkgUnit ===  '0') ? subQuantity*ctnSqm : 0;
		let meters2 = (productType ===  '2' && pkgUnit ===  '1') ? subQuantity*ctnSqm*qtyPkg: (productType ===  '2' && pkgUnit ===  '0') ? subQuantity*ctnSqm : 0;
		let kilos2 = (productType ===  '3' && pkgUnit ===  '1') ? subQuantity*ctnSqm*qtyPkg: (productType ===  '3' && pkgUnit ===  '0') ? subQuantity*ctnSqm : 0;
		let cts = pkgUnit ===  '1' ? parseInt(subQuantity/qtyPkg) : 0;
		let remaining2 = subQuantity - (cts * qtyPkg);
		let others2 = parseInt(productType) > 3 ? parseInt(remaining2 / ctnSqm): '';
		let pcs = parseInt(productType) > 3 ? parseInt(remaining2 % ctnSqm) : parseInt(remaining2);
		let meter2 = productType === '2' ? parseInt(meters2 % ctnSqm) : ''; 
		let sqMeter2 = (productType === '1' && pkgUnit ===  '0') ? parseFloat(sqMeters2 % ctnSqm): ''; 
		let kg2 = productType === '3' ? parseInt(kilos2 % ctnSqm): ''; 
		let suffix = (meter2 || sqMeter2 || kg2) ? ' ' + shortTypes[productType] : ((pcs) ? ' ' + shortTypes[0] : ((others2) ? ' ' + shortTypes[productType] : ''));
		cts = (cts) ? cts + ' Cts' + (suffix) ? ` and ` : '' : '';
		others2 = (others2) ? others2  + ((meter2 || sqMeter2 || kg2 || pcs) ? `${shortTypes[productType]} and ` : '') : '';
		pcs = (pcs) ? pcs + ((meter2 || sqMeter2 || kg2) ? `${shortTypes[0]} and ` : '') : '';
		meter2 = (meter2) ? ((cts || others2 || pcs) ? ` and ` : '') + meter2  : '';
		sqMeter2 = (sqMeter2) ? ((cts || others2 || pcs) ? ` and ` : '') + sqMeter2  : '';
		kg2 = (kg2) ? ((cts || others2 || pcs) ? ` and ` : '') + kg2  : '';
		let display = cts + others2 + pcs + meter2 + sqMeter2 + kg2 + suffix;
		let newRow = {
			dates: sales === true ? saleId : (damaged === true ? date : moveId),
			product:subscriber.data().product,
			debit:(sales === true || damaged === true) ? purchasedType === '0' ? quantity + ' '+shortTypes[0] + (damaged === true ? ' (wastage)': '') : (purchasedType === '1' ? quantity + ' Cartons' + (damaged === true ? ' (wastage)': '') : display) : '',
			credit:move === true ? purchasedType === '0' ? quantity + ' '+shortTypes[0] : (purchasedType === '1' ? quantity + ' Cartons' : display) : '',
			balance:result,
		}
		reportData.push(newRow);
	  };

	  const handleCancel = () => {
		setFdate(0)
		setProduct('')
		setVisible(false)
		setLoaded(false);
		form.setFieldsValue({shop:''})
	};

	const handleProductChange = (value) => {
		setProduct(value);
	};

	const disabledDate = (current) => {
		return current && current > moment().endOf("day");
	} 

	  const handleOk = async () => {
		try {
			setLoading(true);
			const fieldsValue = await form.validateFields();
			let rangeValue = fieldsValue['range-picker'];
			let fdate = new Date(rangeValue[0].format('YYYY-MM-DD')).setHours(0,0,0,0)
			let tdate = new Date(rangeValue[1].format('YYYY-MM-DD')).setHours(23,59,59,999)
			setFdate(fdate);
			reportData = [{dates:fdate, product:'opening stock',debit:'',credit:'',balance:openingStock}];
			records.filter(x => x.data().date >= fdate &&  x.data().date <= tdate)
			.map(subscriber => setTableData(subscriber));
			setLoaded(true);
			setVisible(false);
		} catch (errInfo) {}
	  };

	return (
		<Card>
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3">
						<Title level={4}>Generate Report</Title>
					</div>
				</Flex>
				<div>
					<Button onClick={() => setVisible(true)} size="small" type="primary" icon={<CloudDownloadOutlined />} block>Generate</Button>
				</div>
			</Flex>
			{loaded && (<List customers={reportData} loading={recordsLoading} setVisible={setVisible}/>)}
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
						<Col xs={24} sm={24} md={24}>
							<Form.Item
								label="Product"
								name="product"
								rules={[{ required: true, message: `Please select product` }]}
							>
								<Select
									className="w-100"
									showSearch
									optionFilterProp="children"
									filterOption={(input, option) =>
									option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
									}
									onChange={handleProductChange}
									>
										{allItems.map(({ label, index, value}) => (
										<Option key={index} value={value}>
											{label}
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
