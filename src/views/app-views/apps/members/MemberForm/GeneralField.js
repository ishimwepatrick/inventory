import React, {useState} from 'react'
import moment from "moment";
import { Input, Row, Col, Card, Form, DatePicker, Upload, InputNumber, message, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { LoadingOutlined } from '@ant-design/icons';
import LocationData from "assets/data/district.json"
import { useCollection } from "react-firebase-hooks/firestore";
import { DataService } from "services/settings.service";

const { Dragger } = Upload;
const { Option } = Select;

const rules = {
	name: [
		{
			required: true,
			message: 'Please enter member name',
		}
	],
	idNumber: [
		{
			required: true,
			message: 'Please enter id number'
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
	district: [
		{
			required: true,
			message: 'Select district',
		}
	],
	sector: [
		{
			required: true,
			message: 'Select sector',
		}
	],
	cell: [
		{
			required: true,
			message: 'Select cell',
		}
	],
	village: [
		{
			required: true,
			message: 'Select Village',
		}
	],
	dateJoined: [
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
	const userRoles = ["Admin", "Member"];
	const [provinceData] = useState(LocationData);
	const [settings, settingsLoading] = useCollection(DataService.getAll());
	const [setting, setSetting] = useState([]);
	const [showLoading, setShowLoading] = useState(true);
	
	if(!settingsLoading){
		let allRecords = [];
	  	let lastSetting = '';
		settings.docs.map((doc) => {
		allRecords = {
		  ...allRecords,
		  [doc.data()._id] : {'value': doc.data().value},
		}
		lastSetting = doc.data()._id;
		return true;
		})
		if(lastSetting && (showLoading || !setting[lastSetting])){
			setSetting(allRecords)
			setShowLoading(false);
		}
	}
	
	const imageUploadProps = {
		name: 'file',
		multiple: false,
		listType: "picture-card",
		showUploadList: false,
	}
	const [state, setState] = useState({
		sectors: [],
		cells: [],
		villages: [],
		sectorId : [],
		cellId : [],
		villageId: []
	});

	const disabledDate = (current) => {
		let dateFormat = 'YYYY/MM/DD';
		let sDate = setting['startDate'].value;
		let fullDate = `${new Date(sDate).getFullYear()}/${((new Date(sDate).getMonth())+1) < 10 ? '0' : ''}${(new Date(sDate).getMonth())+1}/${(new Date(sDate).getDate()) < 10 ? '0' : ''}${new Date(sDate).getDate()}`
		let response = false;
		if(current && (current > moment().endOf("day") || current < moment(fullDate, dateFormat).startOf("day"))) response = true;
		return current && response;
	}

	const handleDistrictChange = value => {
		setState({
		sectors: provinceData.districts[value].sectors.all,
		sectorId : provinceData.districts[value].sectors,
		cells: [],
		villages: [],
		cellId : [],
		villageId: []
		});
		props.handleStates({
			sectorName : '',
			cellName : '',
			villageName: '',
		})
	};

	const handleSectorChange = value => {
		setState({
		...state,
		cells: state.sectorId[value].cells.all,
		cellId: state.sectorId[value].cells,
		villages: [],
		villageId: []
		});
		props.handleStates({
			sectorName : state.sectorId[value].name,
			cellName : '',
			villageName: ''
		})
	};

	const handleCellChange = value => {
		setState({
		...state,
		villages: state.cellId[value].villages.all,
		villageId: state.cellId[value].villages,
		});
		props.handleStates({
			...props.initialState,
			cellName : state.cellId[value].name,
			villageName: ''
		})
	};

	const handleVillageChange = value => {
		props.handleStates({
			...props.initialState,
			villageName : state.villageId[value].name,
		});
	};
 
	return (
		
	<Row gutter={16}>
		
		<Col xs={24} sm={24} md={17}>
			<Card>
			<Row gutter={16}>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="name" label="Member name" rules={rules.name}>
							<Input placeholder="Member Name" />
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="idNumber" label="Id Number" rules={rules.idNumber}>
							<InputNumber
								className="w-100"
								parser={value => value.replace(/\$\s?|(,*)/g, '')}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="phoneNumber" label="Phone Number" rules={rules.phoneNumber}>
							<InputNumber
								className="w-100"
								formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="email" label="Email Address" rules={[{type: 'email', required: true,}]}>	
							<Input
								type="email"
								className="w-100"
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item rules={rules.dateJoined} label="Date Joined" name="dateJoined">
							<DatePicker className="w-100" format="DD-MM-YYYY" disabledDate={disabledDate}/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="shares" label="Member Shares" rules={rules.shares}>
						<InputNumber
								className="w-100"
								min={1}
								max={100}
								placeholder="shares"
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Form.Item name="district" label="District" rules={rules.district}>
							<Select
								className="w-100"
								placeholder="-"
								showSearch
								optionFilterProp="children"
								onChange={handleDistrictChange}
							>
								{provinceData.districts.all.map((district, index) => (
								<Option key={index} value={district.id}>{district.name}</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Form.Item name="sector" label="Sector" rules={rules.sector}>
							<Select
								className="w-100"
								placeholder="-"
								showSearch
								optionFilterProp="children"
								onChange={handleSectorChange}
								>
								{state.sectors.map((sector, index) => (
									<Option key={index} value={sector.id}>{sector.name}</Option>
									))}
							</Select>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Form.Item name="cell" label="Cell" rules={rules.cell}>
							<Select
								className="w-100"
								placeholder="-"
								showSearch
								optionFilterProp="children"
								onChange={handleCellChange}
							>
								{state.cells.map((cell, index) => (
									<Option key={index} value={cell.id}>{cell.name}</Option>
									))}
							</Select>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Form.Item name="village" label="Village" rules={rules.village}>
							<Select className="w-100" 
									placeholder="-" 
									showSearch
									optionFilterProp="children"
									onChange={handleVillageChange}
								>
							{
								state.villages.map((data,index) => (
									<Option key={index} value={data.id}>{data.name}</Option>
									))
							}
							</Select>
							
						</Form.Item>
					</Col>
					
				</Row>
				
			</Card>
		</Col>
		<Col xs={24} sm={24} md={7}>
			<Card title="Profile Picture">
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
									<UserOutlined className="display-3"/>
									
									<p>Click or drag image to upload</p>
								</div>
							}
						</div>
					}
				</Dragger>
			
				<Form.Item name="userRole" label="Role in Committe" style={{marginTop: 8}} rules={rules.gender}>
					<Select className="w-100" placeholder="-- Select --">
						{
							userRoles.map(elm => (
								<Option key={elm} value={elm}>{elm}</Option>
								))
						}
					</Select>
				</Form.Item>
			</Card>
		</Col>
	</Row>
)}

export default GeneralField
