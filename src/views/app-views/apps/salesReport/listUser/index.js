import React,{ useState } from 'react'
import { Card, Form, Modal, Row, Col, Button } from 'antd';
import Flex from 'components/shared-components/Flex'
import { Typography } from "antd";
import List from './list';
import moment from 'moment';
import { DatePicker } from 'antd';
import { CloudDownloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Title } = Typography;
let stockTotal = 0;
let reportData = [];
const Report = ({systemData}) => {
	const [form] = Form.useForm();
	const [visible, setVisible] = useState(false);
	const [loaded, setLoaded] = useState(false);
	let { records, recordsLoading, userData, shortTypes } = systemData;
	records = recordsLoading ? [] : records.docs.filter(x => x.data().refunded === false && x.data().source === userData.userStore && x.data().sales === true);
	const rangeConfig = {
		rules: [{ type: 'array', required: true, message: 'Please select time!' }],
	  };

	  
	  const setTableData = (index, subscriber,length) => {
		reportData = index === 0 ? [] : reportData ;  
		stockTotal = index === 0 ? 0 : stockTotal;  
		let {quantity,purchasedType,saleId} = subscriber.data();
		let display = (quantity + ' x ' + (purchasedType === '0' ? ' Pcs' : (purchasedType === '1' ? ' Cts' : ' ' + shortTypes[parseInt(purchasedType)-1])));
		stockTotal += parseInt(subscriber.data().total)
		let newRow = {
			dates: saleId,
			product:subscriber.data().product,
			quantity: display,
			amount: subscriber.data().total,
			solde:stockTotal,
		}
		reportData.push(newRow);
		if(parseInt(index+1) === length){
			reportData.push({dates: '',product:'',quantity: '',amount: 'Total',solde:stockTotal});
		}
	  };

	  const handleCancel = () => {
		setVisible(false)
		setLoaded(false);
	};

	const disabledDate = (current) => {
		return current && current > moment().endOf("day");
	} 


	  const handleOk = async () => {
		try {
			const fieldsValue = await form.validateFields();
			let rangeValue = fieldsValue['range-picker'];
			let fdate = new Date(rangeValue[0].format('YYYY-MM-DD')).setHours(0,0,0,0)
			let tdate = new Date(rangeValue[1].format('YYYY-MM-DD')).setHours(23,59,59,999)
			let toMap = records.filter(x => x.data().date >= fdate &&  x.data().date <= tdate);
			toMap.map((subscriber, index) => setTableData(index,subscriber,toMap.length));
			setLoaded(true);
			setVisible(false);
		} catch (errInfo) {}
	  };

	return (
		<Card>
			<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3">
						<Title level={4}>Generate Sales Report</Title>
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
					</Row>
				</Form>
            </Modal>
		</Card>
	)
}

export default Report
