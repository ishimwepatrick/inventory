import React,{ useState } from 'react'
import { Card, Button } from 'antd';
import Flex from 'components/shared-components/Flex'
import { Typography } from "antd";
import { PlusCircleOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import List from './list';
import Invoice from '../invoice';

const { Title } = Typography;
const Refill = ({systemData}) => {
	let { move, moveLoading, records, recordsLoading, shops, shopsLoading, shortTypes, avatarColors, users, userLoading } = systemData;
	const [receiptTotal, setReceiptTotal] = React.useState(0);
	const [receiptId, setReceiptId] = React.useState();
	const [orderDetails, setOrderDetails] = useState([]);
	const [shopName, setShopName] = React.useState({});
	const [visible, setVisible] = React.useState(false);
	let history = useHistory();	
	const addRefill = () => {
		history.push(`/app/apps/refill/add`)
	}	
	const showInvoice = (employee) => {
		let recId = new Date(+employee._id);
		let orderDetails = records.docs.filter(x=> x.data().moveId === +employee._id);
		setOrderDetails(orderDetails);
		setReceiptId(recId);
		setReceiptTotal(employee.amount)
		setShopName((shops[employee.source]) ? shops[employee.source] : {'name':employee.backupSource,'location':employee.backupLocation})
		setVisible(true);
	};
	return (
		<>
			<Card className={(visible) ? 'd-none' : ''}>
				<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
					<Flex className="mb-1" mobileFlex={false}>
						<div className="mr-md-3">
							<Title level={4}>Stores Refill</Title>
						</div>
					</Flex>
					<div>
						<Button onClick={addRefill} size="small" type="primary" icon={<PlusCircleOutlined />} block>Add New</Button>
					</div>
				</Flex>
				<List products={moveLoading ? [] : move.docs.reverse()} loading={moveLoading} stores={shops} sloading={shopsLoading} recordsLoading={recordsLoading} users={users} userLoading={userLoading} showInvoice={showInvoice} avatarColors={avatarColors}/>
			</Card>
			{visible &&(<Invoice receiptTotal={receiptTotal} receiptId={receiptId} orderDetails={orderDetails} shopName={shopName} shortTypes={shortTypes}/>)}
		</>
	)
}

export default Refill
