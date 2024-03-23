import React from 'react'
import { Card, Button } from 'antd';
import Flex from 'components/shared-components/Flex'
import { Typography } from "antd";
import { PlusCircleOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import List from './list';

const { Title } = Typography;
const Purchases = ({systemData}) => {
	const {  records, recordsLoading, shops, shopsLoading, userData, users, userLoading, avatarColors} = systemData;
	let history = useHistory();	
	const addSale = () => {
		history.push(`/app/apps/damaged/add`)
	}	

	return (
		<Card>
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3">
						<Title level={4}>Wastage Products</Title>
					</div>
				</Flex>
				<div>
					<Button onClick={addSale} size="small" type="primary" icon={<PlusCircleOutlined />} block>Add Damaged</Button>
				</div>
			</Flex>
			<List records={recordsLoading ? [] : records.docs.filter(x => x.data().damaged === true && x.data().source === userData.userStore).reverse()} stores={shops} sloading={shopsLoading} recordsLoading={recordsLoading} users={users} userLoading={userLoading} avatarColors={avatarColors}/>
		</Card>
	)
}
export default Purchases
