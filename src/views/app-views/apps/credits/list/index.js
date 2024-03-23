import React,{ useState } from 'react'
import { Card, Form, Modal, InputNumber, message, Row, Col, Select, Button } from 'antd';
import Flex from 'components/shared-components/Flex'
import { Typography } from "antd";
import { DataService } from "services/sales.service";
import Table from '../table';
import Invoice from '../invoice';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { DataService as RecordsService } from "services/records.service";


const { Title } = Typography;
const { Option } = Select;
const Refill = ({systemData}) => {
	const [form] = Form.useForm();
	const [grandTotal, setGrandTotal] = useState(0);
	const [amountPaid, setAmountPaid] = useState(0);
	const [customer, setCustomer] = useState(null);
	const [customerInfo, setCustomerInfo] = useState({});
	const [Loading, setLoading] = useState(true);
	const [visible, setVisible] = useState(false);
	const { records, recordsLoading, shops, shopsLoading, sales, singleShop, multiShop, stores, storesLoading, salesLoading, avatarColors, getId, userData, methodColors } = systemData;
	const [receiptTotal, setReceiptTotal] = useState(0);
	const [receiptId, setReceiptId] = useState();
	const [orderDetails, setOrderDetails] = useState([]);
	const [salesInfo, setSalesInfo] = useState({});
	const [shopName, setShopName] = useState({});
	const [invoice, setInvoice] = useState(false);
	const [customerData, setCustomerData] = useState('');
	const [dataLoading, setDataLoading] = useState(true);
	const [type, setType] = useState(0);
	const [title, setTitle] = useState('Credited Customers');
	const [shop, setShop] = useState(undefined);

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
	  if(Loading){
	  setLoading(false);
	  }
	}

	const showInvoice = (employee) => {
		let recId = new Date(+employee._id);
		let orderDetails = records.docs.filter(x=> x.data().saleId === +employee._id);
		setOrderDetails(orderDetails);
		setReceiptId(recId);
		setReceiptTotal(employee.amount);
		setShopName(!shopsLoading ? ((shops[employee.source]) ? shops[employee.source] : {'name':employee.backupSource,'location':employee.backupLocation}) : {'name':employee.backupSource,'location':employee.backupLocation})
		setSalesInfo(employee);
		setInvoice(true);
	};

	  const setActiveCustomer = (customer) => {
		setGrandTotal(customer.balance)
		setCustomer(customer.number)
		setVisible(true)
	  };

	  const showSales = (customer) => {
		setDataLoading(true)  
		setType(1)  
		setCustomerInfo(customer)
		setTitle(`${customer.name}'s Credits`)
		setCustomerData(sales.docs.filter(x=> x.data().amount > x.data().paid && x.data().customerNumber === customer.number))
		setDataLoading(false)
		setInvoice(false)
	  };

	  const handleCancel = () => {
		setGrandTotal(0)
		setType(0)
		setCustomer(null)
		setCustomerData([])
		setVisible(false)
		setInvoice(false)
		form.setFieldsValue({payment:null,paymentMethod:null});
	  };

	  const listBack = () => {
		setType(0)
		setCustomer(null)
		setCustomerData([])
		setInvoice(false)
		setTitle('Credited Customers')
	  };

	  const invoiceBack = () => {
		setType(1)
		setInvoice(false)
	  };
	  
	  const handleShopChange = value => {
		setShop(value);
	  };

	  const handleOk = async () => {
		try {
			const row = await form.validateFields();
			const { payment, paymentMethod,shopCode } = row;
			let remaining = payment;
			let recordId = +(new Date().getTime());
			let newStore = !shopsLoading ? shops[shopCode] : {'name':'','location':''};
			let shopName = newStore.name;
			let shopLocation = newStore.location;
			let records = {
				date: recordId,
				amount: payment,
				method: paymentMethod,
				type: 1,
				customerName: customer.name,
				customerNumber: customer.number,
				userId : userData.userId,
				backupUser:userData.displayName,
				source:shopCode,
				backupSource:shopName,
				backupLocation:shopLocation,
			}
			sales.docs.filter(x=> x.data().amount > x.data().paid && x.data().customerNumber === customer).map((doc) => {   
				let balance = parseFloat(doc.data().amount - doc.data().paid);
				let paid = remaining > balance ? balance : remaining;
				let payCounter = paid > 0 ? parseInt(doc.data().payCounter + 1) : doc.data().payCounter;
				let record={
					[`payID${payCounter}`]: recordId,
					[`amount${payCounter}`]: paid,
					[`method${payCounter}`]: paymentMethod,
				}
				let payment = parseFloat(doc.data().paid + paid)
				remaining = parseFloat(remaining - paid);
				let newDoc = {...doc.data(),paid:payment, payCounter};
				let updDoc = paid > 0 ? {...newDoc, ...record} : {...newDoc};
				return DataService.update(doc.data()._id, updDoc);
			})
			message.success("Payment added!");
			RecordsService.create(records,recordId);
		  	handleCancel();
		} catch (errInfo) {}
	  };

	  const handleAmountChange = value => {
		setAmountPaid(value);
		form.setFieldsValue({paymentMethod:null});
	  };
	  if(!multiShop && singleShop && !shop){
		setShop(singleShop);
		form.setFieldsValue({'shopCode': singleShop});
	  }
	return (
		<>
		{!invoice &&(<Card>
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3">
						<Title level={4}>{title}</Title>
					</div>
					
				</Flex>
				{type ? (<div>
					<Button className="mr-2" onClick={() => {setActiveCustomer(customerInfo)}} size="small">Add Payment</Button>
					<Button onClick={listBack} size="small" type="primary" icon={<ArrowLeftOutlined />}>Back</Button>
				</div>) : ''}
			</Flex>
			<Table customers={salesLoading ? [] : allCustomers}
				type={type} 
				loading={salesLoading} 
				setActiveCustomer={setActiveCustomer}
				products={dataLoading ? [] : customerData} 
				dataLoading={dataLoading} 
				stores={shopsLoading ? [] : shops} 
				brandloading={shopsLoading}
				showInvoice={showInvoice} 
				showSales={showSales} 
				avatarColors={avatarColors}
				methodColors={methodColors}
				loadingRecord={recordsLoading}/>
			<Modal
              title="Add Payment"
              visible={visible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
				<Form layout="vertical" form={form}>
					<Row gutter={16}>
						<Col xs={24} sm={24} md={24}>
						<Form.Item
								name="shopCode"
								label="In which store are you?"
								className={multiShop ? '' : 'd-none'}
								rules={[{ required: true, message: 'a store is required' }]}
							>
								<Select placeholder="Select a store" className="w-100" onChange={handleShopChange}>
								{!storesLoading && stores.docs.map((store, index) => (
									<Option key={index} value={store.data()._id}>
									{store.data().name}
									</Option>
								))}
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={24}>
						<Form.Item name="payment" label="Amount received" rules={[
							{
							required: true,
							message: `Enter amount received.`,
							},
						]}>
							<InputNumber min={0} max={grandTotal} onChange={handleAmountChange} className="w-100" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
						</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={24}>
							<Form.Item
								label="Payment Method"
								name="paymentMethod"
								rules={[{ required: true, message: `Specify payment method` }]}
							>
								<Select
									className="w-100"
									>
										<Option value='Cash' disabled={amountPaid==='' || amountPaid===0}>Cash</Option>
										<Option value='Cheque' disabled={amountPaid==='' || amountPaid===0}>Cheque</Option>
										<Option value='Mobile Money' disabled={amountPaid==='' || amountPaid===0}>Mobile Money</Option>
										<Option value='Bank Transfer' disabled={amountPaid==='' || amountPaid===0}>Bank Transfer</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
				</Form>
            </Modal>
		</Card>)}
		{invoice &&(<Invoice receiptTotal={receiptTotal} receiptId={receiptId} orderDetails={orderDetails} salesInfo={salesInfo} shopName={shopName} invoiceBack={invoiceBack} getId={getId}/>)}
		</>
	)
}

export default Refill