import React, { useState } from 'react'
import { Card, Button } from 'antd';
import Flex from 'components/shared-components/Flex'
import { Typography } from "antd";
import { PlusCircleOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import List from './list';
import Invoice from '../invoice';


const { Title } = Typography;
const Purchases = ({systemData}) => {
	const [receiptTotal, setReceiptTotal] = useState(0);
	const [receiptId, setReceiptId] = useState();
	const [orderDetails, setOrderDetails] = useState([]);
	const [visible, setVisible] = useState(false);
	let { purchases, purchasesLoading, records, recordsLoading, users, userLoading, shortTypes, avatarColors, methodColors } = systemData;
	let history = useHistory();	
	const addPurchase = () => {
		history.push(`/app/apps/purchases/add`)
	}	

	const showInvoice = (employee) => {
		let recId = new Date(+employee._id);
		let orderDetails = records.docs.filter(x=> x.data().purchase === true && x.data().purchaseId === +employee._id);
		setOrderDetails(orderDetails);
		setReceiptId(recId);
		setReceiptTotal(employee.amount)
		setVisible(true);
	};

	return (
		<>
			<Card className={(visible) ? 'd-none' : ''}>
				<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
					<Flex className="mb-1" mobileFlex={false}>
						<div className="mr-md-3">
							<Title level={4}>Purchases records</Title>
						</div>
					</Flex>
					<div>
						<Button onClick={addPurchase} size="small" type="primary" icon={<PlusCircleOutlined />} block>Add New</Button>
					</div>
				</Flex>
				<List purchases={purchasesLoading ? [] : purchases.docs.reverse()} loading={purchasesLoading} recordsLoading={recordsLoading} showInvoice={showInvoice} users={users} userLoading={userLoading} avatarColors={avatarColors} methodColors={methodColors}/>
			</Card>
			{visible &&(<Invoice receiptTotal={receiptTotal} receiptId={receiptId} orderDetails={orderDetails} shortTypes={shortTypes}/>)}
		</>
	)
}

export default Purchases
