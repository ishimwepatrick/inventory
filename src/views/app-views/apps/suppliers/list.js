import React from 'react'
import { Card, Table, Avatar, Tooltip, Button } from 'antd';
import Flex from 'components/shared-components/Flex'
import { Typography } from "antd";
import utils from 'utils';
import { 
	LoadingOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import NumberFormat from 'react-number-format';

const { Title } = Typography;

const List = ({setSupplier,setIdLoaded,setPurchId,systemData}) => {
	
	const { suppliers, suppliersLoading, purchases, purchasesLoading, avatarColors } = systemData;
	const [Loading, setLoading] = React.useState(true);
	let allCustomers = {};
	if(!purchasesLoading){
	  let allCustomer = {};
	  purchases.docs.map((doc) => {   
		let balance = parseFloat(doc.data().amount - doc.data().paid);
		let debt = doc.data().debt ? doc.data().debt : 0;
		let latest = doc.data().date;
		let id = doc.id;
		let index = doc.data().supplierNumber;
		if(allCustomer[index]){
		  allCustomer[index].id += `,${id}`;
		  allCustomer[index].debt = debt < allCustomer[index].debt ? debt : allCustomer[index].debt;
		  allCustomer[index].balance = parseFloat(allCustomer[index].balance + balance);
		  allCustomer[index].latest = latest > allCustomer[index].latest ? latest : allCustomer[index].latest;
		}
		else{
		  allCustomer = {
			...allCustomer,
			[index] : {name: doc.data().supplierName, number: index, balance, debt, latest,id},
		  }
		}
		return true;
	  })
	  allCustomers = allCustomer;
	  if(Loading){
	  	setLoading(false);
	  }
	}

	const supplierChange = (data) =>{
		setIdLoaded(false);
		setPurchId(data.id);
		setSupplier(data);
	}

	const tableColumns = [
		{
			title: 'Name',
			dataIndex: 'name',
			render: (_,record) => (
				<div className="d-flex align-items-center">
				  <Avatar size={30} className="font-size-sm" style={{backgroundColor: avatarColors[Math.floor(Math.random() * avatarColors.length) - 1]}}>
					{utils.getNameInitial(record.data().supplierName)}
				  </Avatar>
				  <span className="ml-2">{record.data().supplierName}</span>
				</div>
			  )
		},
		{
			title: 'TIN / Phone Number',
			dataIndex: 'number',
			render: (_, record) => record.data().supplierNumber
		},
		{
			title: 'Last Purchase',
			dataIndex: 'date',
			render: (_, record) => (allCustomers[record.data().supplierNumber] && allCustomers[record.data().supplierNumber].latest) ? new Date(allCustomers[record.data().supplierNumber].latest).toLocaleDateString() : ''
		},
		{
			title: 'Balance',
			dataIndex: 'balance',
			render: (_, record) => {
				return !Loading ? (allCustomers[record.data().supplierNumber] ? 
				(<NumberFormat displayType={'text'} value={allCustomers[record.data().supplierNumber].balance} thousandSeparator={true}/>)
				: 0) : (<LoadingOutlined/>)
			}
		},
		{
			title: '',
			dataIndex: 'actions',
			render: (_,elm) => (
				<div className="text-right">
					<Tooltip title="View Records">
						<Button type="primary" className="mr-2" icon={<EyeOutlined />} disabled={!allCustomers[elm.data().supplierNumber]} onClick={() => supplierChange(allCustomers[elm.data().supplierNumber])} size="small"/>
					</Tooltip>	
				</div>
			)
		}
	];

	return (
		<Card>
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3 mb-3">
						<Title level={4}>Suppliers</Title>
					</div>
				</Flex>
			</Flex>
			<div className="table-responsive">
				<Table 
					columns={tableColumns} 
					dataSource={!suppliersLoading ? suppliers.docs : []} 
					loading={suppliersLoading}
					rowKey='_id' 
				/>
			</div>
		</Card>
	)
}

export default List