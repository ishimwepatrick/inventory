import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message } from 'antd';
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
import { useHistory } from "react-router-dom";
import { useCollection } from "react-firebase-hooks/firestore";
import { DataService } from "services/employees.service";
import LocationData from "assets/data/district.json"

const { TabPane } = Tabs;

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const ADD = 'ADD'
const EDIT = 'EDIT'

const EmployeeForm = props => {

	const { mode = ADD, param } = props

	const [form] = Form.useForm();
	const [uploadedImg, setImage] = useState('')
	const [provinceData] = useState(LocationData);
	const [uploadLoading, setUploadLoading] = useState(false)
	const [submitLoading, setSubmitLoading] = useState(false)
	const [employees, loading] = useCollection(DataService.getAll());
	const [currentId, setCurrentId] = useState('');
	const [currentPhone, setCurrentPhone] = useState('');
	const [currentEmail, setCurrentEmail] = useState('');
	const [state, setState] = useState({
		sectorName : '',
		cellName : '',
		villageName : '',
	});
	const [imageState, setImageState] = useState({
		image: null,
		progress:0,
		downloadURL: ''
	});
	const validateMessages = {
		required: 'Email is required!',
		types: {
		  email: 'Not a validate email!',
		}
	  };
	let history = useHistory();

	useEffect(() => {
    	if(mode === EDIT) {
			const { id } = param
			DataService.getRow(id).then(data =>{
				let user = data.data()
				form.setFieldsValue({
					name: user.name,
					idNumber: user.idNumber,
					phoneNumber: user.phoneNumber,
					email: user.email,
					userRole: user.userRole,
					userStore: user.userStore,
					gender: user.gender,
					district: user.district,
					sector: provinceData.districts[user.district].sectors[user.sector].name,
					cell: provinceData.districts[user.district].sectors[user.sector].cells[user.cell].name,
					village: provinceData.districts[user.district].sectors[user.sector].cells[user.cell].villages[user.village].name
				});
				setCurrentId(user.idNumber);
				setCurrentPhone(user.phoneNumber);
				setCurrentEmail(user.email);
				setImage(user.profile)
				setState({
					sectorName : provinceData.districts[user.district].sectors[user.sector].id,
					cellName : provinceData.districts[user.district].sectors[user.sector].cells[user.cell].id,
					villageName : provinceData.districts[user.district].sectors[user.sector].cells[user.cell].villages[user.village].id,
				});
				setImageState({
					image: user.profile,
					progress:100,
					downloadURL: user.profile
				})
			});
		}
  	}, [form, mode, param, props, provinceData]);

	const handleUploadChange = info => {
		if (info.file.status === 'uploading') {
			setImage('')
			setUploadLoading(true)
			let file = info.file.originFileObj;
			
			getBase64(file, imageUrl =>{
				setImageState({
					...imageState,
					downloadURL: imageUrl
				})
				setImage(imageUrl)
				setUploadLoading(false)  
			});
			return;
		}
	};

	const onDiscard = () => {
		history.push(`/app/apps/employees`)
	}

	const onFinish = () => {
		let idNumber = form.getFieldValue('idNumber');
		let phoneNumber = form.getFieldValue('phoneNumber');
		let email = form.getFieldValue('email');
		const verifyId = loading ? [] : employees.docs.filter( employee => employee.data().idNumber === idNumber);
		const verifyPhone = loading ? [] : employees.docs.filter( employee => employee.data().phoneNumber === phoneNumber);
		const verifyEmail = loading ? [] : employees.docs.filter( employee => employee.data().email === email);
		idNumber += '';
		phoneNumber += '';
		let phoneSliced = phoneNumber.slice(0,2);
		if(idNumber.length !== 16){
			message.error('Id number should be 16 numbers');
			return;
		}
		if(phoneNumber.length !== 9){
			message.error('Phone number should be 10 numbers');
			return;
		}
		if(phoneSliced !== '72' && phoneSliced !== '73' && phoneSliced !== '78' && phoneSliced !== '79'){
			message.error('Invalid phone number');
			return;
		}
		if(state.sectorName === ""){
			message.error('Select sector');
			return;
		}
		if(state.cellName === ""){
			message.error('Select cell');
			return;
		}
		if(state.villageName === ""){
			message.error('Select Village');
			return;
		}
		if(imageState.downloadURL === ""){
			message.error('Upload employee picture');
			return;
		}
		if(verifyId.length > 0 && idNumber !== ''+currentId){
			message.error('Id Number is already registered');
			return;
		}
		if(verifyPhone.length > 0 && phoneNumber !== ''+currentPhone){
			message.error('Phone Number is already registered');
			return;
		}
		if(verifyEmail.length > 0 && email !== ''+currentEmail){
			message.error('Email is already registered');
			return;
		}
		
		setSubmitLoading(true)
		form.validateFields().then(values => {
			setTimeout(() => {
				let userData = {
					name : values.name,
					phoneNumber: values.phoneNumber,
					idNumber: values.idNumber,
					email: values.email,
					gender: values.gender,
					profile: imageState.downloadURL,
					district : values.district,
					sector : parseInt(values.sector) ? values.sector : state.sectorName,
					cell : parseInt(values.cell) ? values.cell : state.cellName,
					village : parseInt(values.village) ? values.village : state.villageName,
					userRole : values.userRole,
					userStore : values.userStore,
				}
				if(mode === ADD) {
					userData.status = true
					DataService.create(userData)
					setSubmitLoading(false)
					onDiscard();
					message.success(`Registered ${values.name} to employees list`);
				}
				if(mode === EDIT) {
					let { id } = param
					DataService.update(id,userData)
					setSubmitLoading(false)
					message.success(`Employee updated`);
					onDiscard();
				}
			}, 1500);
		}).catch(info => {
			setSubmitLoading(false)
			console.log('info', info)
			message.error('Please enter all required field ');
		});
	};

	return (
		<>
			<Form
				layout="vertical"
				form={form}
				name="advanced_search"
				className="ant-advanced-search-form"
				validateMessages={validateMessages}
				initialValues={{
					heightUnit: 'cm',
					widthUnit: 'cm',
					weightUnit: 'kg'
				}}
			>
				<PageHeaderAlt className="border-bottom" overlap>
					<div className="container">
						<Flex className="py-2" mobileFlex={false} justifyContent="between" alignItems="center">
							<h2 className="mb-2">{mode === 'ADD'? 'Add New Employee' : `Edit Employee`} </h2>
							<div className="mb-3">
								<Button className="mr-2" onClick={() => onDiscard()}>Discard</Button>
								<Button type="primary" onClick={() => onFinish()} htmlType="submit" loading={submitLoading} >
									{mode === 'ADD'? 'Add' : `Save`}
								</Button>
							</div>
						</Flex>
					</div>
				</PageHeaderAlt>
				<div className="container">
					<Tabs defaultActiveKey="1" style={{marginTop: 30}}>
						<TabPane tab="Basic Info" key="1">
							<GeneralField 
								uploadedImg={uploadedImg} 
								uploadLoading={uploadLoading} 
								handleUploadChange={handleUploadChange}
								initialState={state}
								handleStates={setState}
							/>
						</TabPane>
					</Tabs>
				</div>
			</Form>
		</>
	)
}

export default EmployeeForm
