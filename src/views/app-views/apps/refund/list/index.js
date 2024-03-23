import React,{ useState } from 'react'
import { Card, message } from 'antd';
import Flex from 'components/shared-components/Flex'
import { Typography } from "antd";
import { DataService } from "services/sales.service";
import { DataService as SourceService} from "services/source.service";
import List from './list';
import Invoice from '../invoice';

const { Title } = Typography;
const Purchases = ({systemData}) => {
	const { sales, salesLoading, records, recordsLoading, shops, shopsLoading, userData, shortTypes, avatarColors, getId, methodColors } = systemData;
	const [receiptTotal, setReceiptTotal] = React.useState(0);
	const [receiptId, setReceiptId] = React.useState();
	const [orderDetails, setOrderDetails] = useState([]);
	const [salesInfo, setSalesInfo] = React.useState({});
	const [shopName, setShopName] = React.useState({});
	const [visible, setVisible] = React.useState(false);

	const showInvoice = (employee) => {
		let recId = new Date(+employee._id);
		let orderDetails = records.docs.filter(x=> x.data().saleId === +employee._id);
		setOrderDetails(orderDetails);
		setReceiptId(recId);
		setReceiptTotal(employee.amount)
		setShopName((shops[employee.source]) ? shops[employee.source] : {'name':employee.source,'location':employee.source})
		setSalesInfo(employee);
		setVisible(true);
	};
	const deleteRecord = (id) => {
		let orderDetails = records.docs.filter(x=> x.data().saleId === +id);
		DataService.remove(id);
		message.success("Refund Approved!");
		orderDetails.map((record)=>{
			return SourceService.remove(record.id);
		})
		setVisible(false);
	};
	const rejectRecord = (data) => {
		data.refunded = false;
		DataService.update(data._id,data);
		message.success("Refund Rejected!");
		setVisible(false);
	};
	return (
		<>
		<Card className={(visible) ? 'd-none' : ''}>
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3">
						<Title level={4}>Sales for Refund</Title>
					</div>
				</Flex>
			</Flex>
			<List products={salesLoading ? [] : sales.docs.filter(x => x.data().refunded !== false).reverse()} loading={salesLoading} stores={shops} sloading={shopsLoading} showInvoice={showInvoice} loadingRecord={recordsLoading} deleteRecord={deleteRecord} avatarColors={avatarColors} methodColors={methodColors}/>
		</Card>
		{visible &&(<Invoice receiptTotal={receiptTotal} receiptId={receiptId} orderDetails={orderDetails} salesInfo={salesInfo} shopName={shopName} rejectRecord={rejectRecord} deleteRecord={deleteRecord} userData={userData} shortTypes={shortTypes} getId={getId}/>)}
		</>
	)
}
export default Purchases
