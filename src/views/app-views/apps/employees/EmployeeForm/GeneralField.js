import React, {useState} from 'react'
import { Input, Row, Col, Card, Form, Upload, InputNumber, message, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { LoadingOutlined } from '@ant-design/icons';
import LocationData from "assets/data/district.json"
import { useCollection } from "react-firebase-hooks/firestore";
import { DataService } from "services/stores.service";

const { Dragger } = Upload;
const { Option } = Select;

const rules = {
	name: [
		{
			required: true,
			message: 'Please enter employee name',
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
			message: 'Please enter employee shares',
		}
	],
	roles: [
		{
			required: true,
			message: 'Please select employee role',
		}
	],
	gender: [
		{
			required: true,
			message: 'Please select gender',
		}
	],
	comparePrice: [		
	],
	taxRate: [		
		{
			required: true,
			message: 'Please enter tax rate',
		}
	],
	cost: [		
		{
			required: true,
			message: 'Please enter item cost',
		}
	]
}

const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 0.5;
  if (!isLt2M) {
    message.error('Image must smaller than 500KB!');
  }
  return isJpgOrPng && isLt2M;
}

const GeneralField = props => {
	const [store, loading] = useCollection(DataService.getAll().orderBy("name", "asc"));
	const gender = ['Male', 'Female']
	const userRoles = ["Admin", "Sales", "Operator"];
	const allStores = {
		Admin: ["All Stores"],
		Sales: loading ? [] : store.docs,
		Operator: loading ? [] : store.docs
	};
	const [provinceData] = useState(LocationData);
	const [stores, setStores] = useState({
		role: [],
    	store: ''
	})
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

	const handleRoleChange = value => {
		setStores({
		  role: allStores[value],
		  store: ''
		});
	  };
	
	const onStoreChange = value => {
		setStores({
		  ...stores,
		  store: value
		});
	  };

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
						<Form.Item name="name" label="Employee name" rules={rules.name}>
							<Input placeholder="Employee Name" />
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
						<Form.Item name="userRole" label="User Role" rules={rules.roles}>
							<Select
								className="w-100"
								defaultValue={''}
								onChange={handleRoleChange}
								>
								{userRoles.map(role => (
									<Option key={role}>{role}</Option>
									))}
							</Select>
							
						</Form.Item>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<Form.Item name="userStore" label="Store">
							<Select
								className="w-100"
								value={stores.store}
								onChange={onStoreChange}
								>
								{stores.role.map((store, index) => (
									<Option key={index} value={(store.id) ? store.data()._id : store}>{(store.id) ? store.data().name : store}</Option>
									))}
							</Select>
							
						</Form.Item>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Form.Item name="district" label="District" rules={rules.district}>
							<Select
								className="w-100"
								placeholder="-"
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
			
				<Form.Item name="gender" label="Gender" style={{marginTop: 8}} rules={rules.gender}>
					<Select className="w-100" placeholder="-- Select --">
						{
							gender.map(elm => (
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
