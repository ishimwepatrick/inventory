import React,{ useState } from 'react'
import { Card, Form, Modal, InputNumber, message, Row, Col, Select, Button } from 'antd';
import Flex from 'components/shared-components/Flex'
import { Typography } from "antd";
import { DataService } from "services/expenses.service";
import Table from '../table';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { DataService as RecordsService } from "services/records.service";
import NumberFormat from 'react-number-format';

const { Title } = Typography;
const { Option } = Select;
const Refill = ({systemData}) => {
	const [form] = Form.useForm();
	const [grandTotal, setGrandTotal] = useState(0);
	const [amountPaid, setAmountPaid] = useState(0);
	const [customer, setCustomer] = useState(null);
	const [customerNme, setCustomerNme] = useState(null);
	const [customerInfo, setCustomerInfo] = useState({});
	const [Loading, setLoading] = useState(true);
	const [visible, setVisible] = useState(false);
	const { recordsLoading, shops, shopsLoading, expenses, singleShop, multiShop, stores, storesLoading, expensesLoading, avatarColors, userData, methodColors } = systemData;
	const [customerData, setCustomerData] = useState('');
	const [dataLoading, setDataLoading] = useState(true);
	const [type, setType] = useState(0);
	const [title, setTitle] = useState('Expenses to be paid');
	const [shop, setShop] = useState(undefined);

	let allCustomers = [];
	if(!expensesLoading){
	  let allCustomer = [];
	  expenses.docs.filter(x=> x.data().amount > x.data().paid).map((doc) => {   
		let balance = parseFloat(doc.data().amount - doc.data().paid);
		let debt = doc.data().debt ? doc.data().debt : 0;
		let tempArr = [...allCustomer];
		let data = tempArr.filter(x => x.number === doc.data().supplierNumber);
		if(data.length === 1){
		  let index = allCustomer.indexOf(data[0]);
		  allCustomer[index].debt = debt < allCustomer[index].debt ? debt : allCustomer[index].debt;
		  allCustomer[index].balance = parseFloat(allCustomer[index].balance + balance);
		}
		else{
		  allCustomer = [
			...allCustomer,
			{name: doc.data().supplierName, number: doc.data().supplierNumber, balance, debt},
		  ]
		}
		return true;
	  })
	  allCustomers = allCustomer;
	  if(Loading){
	  setLoading(false);
	  }
	}



	  const setActiveCustomer = (customer) => {
		setGrandTotal(customer.balance)
		setCustomer(customer.number)
		setCustomerNme(customer.name)
		setVisible(true)
	  };

	  const showSales = (customer) => {
		setDataLoading(true)  
		setType(1)  
		setCustomerInfo(customer)
		setTitle(`${customer.name}'s Pending Payment`)
		setCustomerData(expenses.docs.filter(x=> x.data().amount > x.data().paid && x.data().supplierNumber === customer.number))
		setDataLoading(false)
	  };

	  const handleCancel = () => {
		setGrandTotal(0)
		setType(0)
		setCustomer(null)
		setCustomerNme(null)
		setCustomerData([])
		setVisible(false)
		form.setFieldsValue({payment:null,paymentMethod:null});
	  };

	  const listBack = () => {
		setType(0)
		setCustomer(null)
		setCustomerNme(null)
		setCustomerData([])
		setTitle('Expenses to be paid')
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
				type: 2,
				supplierName: customerNme,
				supplierNumber: customer,
				userId : userData.userId,
				backupUser:userData.displayName,
				source:shopCode,
				backupSource:shopName,
				backupLocation:shopLocation,
			}
			expenses.docs.filter(x=> x.data().amount > x.data().paid && x.data().supplierNumber === customer).map((doc) => {   
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
	  function info(data) {
		Modal.info({
		  title: 'Expense on '+ new Date(data.date).toLocaleDateString() +' '+ new Date(data.date).toLocaleTimeString(),
		  content: (
			<div>
			  <div className="mb-2">
				<h4 className="font-weight-semibold">
				  <NumberFormat
					displayType={'text'} 
					value={data.amount} 
					thousandSeparator={true} 
					suffix=' Rwf'
					prefix='Amount: '
				  />
				</h4>
			  </div>
			  <div>
				<h4 className="font-weight-semibold">Title: {data.title}</h4>
				<p>{data.comment}</p>
			  </div>
			</div>
		  ),
		  onOk() {},
		});
	  }
	return (
		<Card>
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
			<Table customers={expensesLoading ? [] : allCustomers}
				type={type} 
				loading={expensesLoading} 
				setActiveCustomer={setActiveCustomer}
				products={dataLoading ? [] : customerData} 
				dataLoading={dataLoading} 
				stores={shopsLoading ? [] : shops} 
				brandloading={shopsLoading}
				showInvoice={info} 
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
						<Form.Item name="payment" label="Amount you paid" rules={[
							{
							required: true,
							message: `Enter amount you paid to ${customerNme}.`,
							},
						]}>
							<InputNumber min={0} max={grandTotal} onChange={handleAmountChange} className="w-100" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
						</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={24}>
							<Form.Item
								label="Payment Method"
								name="paymentMethod"
								rules={[{ required: true, message: `Specify payment method you used` }]}
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
		</Card>
	)
}

export default Refill