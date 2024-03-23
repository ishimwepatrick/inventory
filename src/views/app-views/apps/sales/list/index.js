import React,{ useState, useEffect } from 'react'
import { Card, Button, message, Input } from 'antd';
import Flex from 'components/shared-components/Flex'
import { Typography } from "antd";
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import { DataService } from "services/sales.service";
import List from './list';
import Invoice from '../invoice';
import _ from 'lodash';

const { Title } = Typography;
const Purchases = ({systemData}) => {
	const { sales, salesLoading, records, recordsLoading, shops, shopsLoading, userData, shortTypes, methodColors, statusColors, users, userLoading, avatarColors, getId} = systemData;
	const [receiptTotal, setReceiptTotal] = useState(0);
	const [receiptId, setReceiptId] = useState();
	const [orderDetails, setOrderDetails] = useState([]);
	const [salesInfo, setSalesInfo] = useState({});
	const [shopName, setShopName] = useState({});
	const [visible, setVisible] = useState(false);
	const [list, setList] = useState([])

	let history = useHistory();	
	const addSale = () => {
		history.push(`/app/apps/sales/add`)
	}	
	
	useEffect(()=>{
		if(salesLoading || list.length > 0) return;
		setList(sales.docs)
	},[salesLoading])

	const showInvoice = (employee) => {
		let recId = new Date(+employee._id);
		let orderDetails = records.docs.filter(x=> x.data().saleId === +employee._id);
		setOrderDetails(orderDetails);
		setReceiptId(recId);
		setReceiptTotal(employee.amount)
		setShopName((shops[employee.source]) ? shops[employee.source] : {'name':employee.backupSource,'location':employee.backupLocation})
		setSalesInfo(employee);
		setVisible(true);
	};

	const sendRequest = (data) => {
		data.refunded = 'Pending'
		DataService.update(data._id,data);
		setVisible(false);
		message.success("Refund request sent!");
	};

	const approveTask = (data) => {
		data.status = true
		DataService.update(data._id,data);
		setVisible(false);
		message.success("Order marked as ready to be delivered!");
	}; 

	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = e.currentTarget.value? list : sales.docs
		const data = _.filter(searchArray, (item) => item.data().customerName.toLowerCase().includes(value.toLowerCase()) ? item.data().customerName.toLowerCase().includes(value.toLowerCase()) : (''+item.data().customerNumber).includes(value));
		setList(data)
		// setSelectedRowKeys([])
	}
	 
	return (
		<>
		<Card className={(visible) ? 'd-none' : ''}>
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3">
						<Title level={4}>Orders Received</Title>
					</div>
				</Flex>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-3 mb-3">
						<Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)}/>
					</div>
					<div>
					<Button onClick={addSale} size="small" type="primary" icon={<PlusCircleOutlined />} block>Add New</Button>
					</div>
				</Flex>
			</Flex>
			
			<List products={list.reverse()} loading={salesLoading} stores={shops} sloading={shopsLoading} showInvoice={showInvoice} loadingRecord={recordsLoading} methodColors={methodColors} statusColors={statusColors} users={users} userLoading={userLoading}  avatarColors={avatarColors} shops={shops}/>
			
		</Card>
		{visible &&(<Invoice receiptTotal={receiptTotal} receiptId={receiptId} orderDetails={orderDetails} salesInfo={salesInfo} shopName={shopName} review={true} userData={userData} sendRequest={sendRequest} approveTask={approveTask} shortTypes={shortTypes} getId={getId}/>)}
		</>
	)
}
export default Purchases
