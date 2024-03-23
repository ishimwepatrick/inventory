import React, {useState} from 'react'
import moment from "moment";
import { Input, Row, Col, Card, Form, DatePicker, Upload, InputNumber, message, Select, Checkbox } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useCollection } from "react-firebase-hooks/firestore";
import { DataService as MembersService} from "services/members.service";
import { Balance } from "functions/balance";
import CustomIcon from 'components/util-components/CustomIcon';
import { ImageSvg } from 'assets/svg/icon';
import NumberFormat from 'react-number-format';
import { Typography } from 'antd';

const { Text } = Typography;
const { Dragger } = Upload;
const { Option } = Select;

const rules = {
	name: [
		{
			required: true,
			message: 'Please enter member name',
		}
	],
	amount: [
		{
			required: true,
			message: 'Please enter amount on receipt'
		}
	],
	phoneNumber: [
		{
			required: true,
			message: 'Please enter phone number',
		}
	],
	emailAddress: [		
		{
			required: true,
			message: 'Please enter a valid email',
		}
	],
	member: [
		{
			required: true,
			message: 'Select paid member(s)',
		}
	],
	datePaid: [
		{
			required: true,
			message: 'Invalid Date',
		}
	],
	shares: [
		{
			required: true,
			message: 'Please enter member shares',
		}
	],
	roles: [
		{
			required: true,
			message: 'Please select member role',
		}
	]
}

const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const GeneralField = props => {
	
	const [members, membersLoading] = useCollection(MembersService.getAll());
	const [member, setMember] = useState([]);
	const [showMember, setShowMember] = useState(true);
	const {onChange, handleChange, amountChange, disableField, length, selected, options, onValuesChange, onChangeInterest, onInterestChange, setting, amount, selectedData, load } = props;
	if(!membersLoading){
		let allRecords = [];
	  	let lastMember = '';
		members.docs.map((doc) => {
			allRecords = {
			...allRecords,
			[doc.data()._id] : {'name': doc.data().name,'shares': doc.data().shares,'email': doc.data().email},
			}
			lastMember = doc.data()._id;
			return true;
		})
		if(lastMember && (showMember || !member[lastMember])){
			setMember(allRecords); 
			setShowMember(false);
		}
	}
	
	const imageUploadProps = {
		name: 'file',
		multiple: false,
		listType: "picture-card",
		showUploadList: false,
	}

	const disabledDate = (current) => {
		let dateFormat = 'YYYY/MM/DD';
		let sDate = setting['startDate'].value;
		let fullDate = `${new Date(sDate).getFullYear()}/${((new Date(sDate).getMonth())+1) < 10 ? '0' : ''}${(new Date(sDate).getMonth())+1}/${(new Date(sDate).getDate()) < 10 ? '0' : ''}${new Date(sDate).getDate()}`
		let response = false;
		if(current && (current > moment().endOf("day") || current < moment(fullDate, dateFormat).startOf("day"))) response = true;
		return current && response;
	}

	return (
		
	<Row gutter={16}>
		<Col xs={24} sm={24} md={17}>
			<Card>
				<Row gutter={16}>
					<Col xs={24} sm={12} md={6}>
						<Form.Item rules={rules.datePaid} label="Receipt Date" name="datePaid">
							<DatePicker className="w-100" format="DD-MM-YYYY" disabledDate={disabledDate}/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Form.Item name="amount" label="Amount" rules={rules.amount}>
							<InputNumber
								onChange={amountChange}
								className="w-100"
								min={0}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}
								formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="name" label="Name on receipt" rules={rules.name}>
							<Input placeholder="" />
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={24}>
						<Form.Item name="members" label="Paid Member(s)" rules={rules.member}>
							<Select
								className="w-100"
								onChange={handleChange}
								showSearch
								placeholder="Select a member"
								optionFilterProp="children"
								mode="multiple" 
							>
								{!membersLoading && members.docs.map((member, index) => (
									<Option key={index} value={member.data()._id}>
										{member.data().name}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>	
				</Row>
				<Checkbox.Group className="w-100" onChange={onChange}>
					<Row>
						<Col xs={24} sm={12} md={6}>
							<Checkbox value="saving">Saving</Checkbox>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Checkbox value="penalty">Penalty</Checkbox>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Checkbox value="loan">Loan</Checkbox>
						</Col>
					</Row>
				</Checkbox.Group>
			</Card>
			{selected.map((selectedMember, index) => (
			<Card key={index} title={member[selectedMember].name}>
				<Row gutter={16}>
					<Col xs={24} sm={24/length} md={24/length} className={options.indexOf('saving') > -1 ? '' : 'd-none'}>
						<Form.Item label="Saving" name={`saving${selectedMember}`}>
							<InputNumber
								className="w-100"
								parser={value => value.replace(/\$\s?|(,*)/g, '')}
								min={0}
								defaultValue={0}
								max={amount}
								disabled={disableField}
								onChange={(e) => onValuesChange(`saving`,selectedMember,e)}
								formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24/length} md={24/length} className={options.indexOf('penalty') > -1 ? '' : 'd-none'}>
						<Form.Item name={`penalty${selectedMember}`} label="Penalty">
							<InputNumber
								className="w-100"
								parser={value => value.replace(/\$\s?|(,*)/g, '')}
								min={0}
								max={amount}
								defaultValue={0}
								disabled={disableField}
								onChange={(e) => onValuesChange(`penalty`,selectedMember,e)}
								formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24/length} md={24/length} className={options.indexOf('loan') > -1 ? '' : 'd-none'}>
						<Form.Item label="Interest" name={`interest${selectedMember}`} extra={(<Checkbox checked={selectedData[selectedMember].box} onChange={(e) => onInterestChange(selectedMember,e)} className="mt-1">Only for Interest</Checkbox>)}>
							<InputNumber
								className="w-100"
								parser={value => value.replace(/\$\s?|(,*)/g, '')}
								min={0}
								max={amount}
								defaultValue={0}
								disabled={!selectedData[selectedMember].box}
								onChange={(e) => onValuesChange(`interest`,selectedMember,e)}
								formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24/length} md={24/length} className={options.indexOf('loan') > -1 ? '' : 'd-none'}>
						<Form.Item label="Loan Payment" name={`loan${selectedMember}`} extra={!selectedData[selectedMember].extra ? '' : (<NumberFormat displayType={'text'} value={selectedData[selectedMember].extra} suffix={' after -'+setting['interestRate'].value+'%'} thousandSeparator={true}/>)}>
							<InputNumber
								className="w-100"
								parser={value => value.replace(/\$\s?|(,*)/g, '')}
								min={0}
								max={amount}
								defaultValue={0}
								disabled={selectedData[selectedMember].loaned}
								onChange={(e) => onChangeInterest(`loan`,selectedMember,e)}
								formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							/>
						</Form.Item>
					</Col>
				</Row>
			</Card>
			))}
		</Col>
		<Col xs={24} sm={24} md={7}>
			<Card>
				<Dragger {...imageUploadProps} beforeUpload={beforeUpload} onChange={e=> props.handleUploadChange(e)}>
					{
						props.uploadedImg ? 
						<img src={props.uploadedImg} alt="avatar" className="img-fluid" /> 
						: 
						<div>
							{
								props.uploadLoading ? 
								<div>
									<LoadingOutlined className="font-size-xxl text-primary"/>
									<div className="mt-3">Uploading</div>
								</div> 
								: 
								<div>
									<p>Receipt image (optional)</p>
									<CustomIcon className="display-3" svg={ImageSvg}/>
									<p>Click or drag image to upload</p>
								</div>
							}
						</div>  
					}
				</Dragger>
			</Card>
			{ selected.length > 0 &&(
			<Card title="Pending Payments">
				<div className="m-0 p-0 text-center">
					{selected.map((selectedMember, index) => (
						<div className="w-100" key={index}>
						<Text strong>{member[selectedMember].name}</Text>
						<br />
						{load && (<LoadingOutlined/>)}
						{!load && Balance.findMonths(setting,member[selectedMember].shares)}
						</div>
					))}
				</div>
			</Card>
			)}
		</Col>
	</Row>
)}

export default GeneralField