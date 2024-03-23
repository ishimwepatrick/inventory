import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message } from 'antd';
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
import { useHistory } from "react-router-dom";
import { useCollection } from "react-firebase-hooks/firestore";
import { DataService } from "services/payments.services";
import { DataService as SettingsService } from "services/settings.service";
import LocationData from "assets/data/district.json"
import moment from "moment";

const { TabPane } = Tabs;

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const ADD = 'ADD'
const EDIT = 'EDIT'

const ReceiptForm = props => {

	const { mode = ADD, param, systemData } = props

	const [form] = Form.useForm();
	const [uploadedImg, setImage] = useState('')
	const [provinceData] = useState(LocationData);
	const [uploadLoading, setUploadLoading] = useState(false)
	const [submitLoading, setSubmitLoading] = useState(false)
	const [employees, loading] = useCollection(DataService.getAll());
	const [settings, settingsLoading] = useCollection(SettingsService.getAll());
	const [setting, setSetting] = useState([]);
	const [showLoading, setShowLoading] = useState(true);
	const [options, setOptions] = useState([]);
	const [selected, setSelected] = useState([]);
	const [selectedData, setSelectedData] = useState([])
	const [length, setLength] = useState(0);
	const [amount, setAmount] = useState(0);
	const [maximum, setMaximum] = useState(0);
	const [key] = useState('updatable');
	const [disableField, setDisableField] = useState(false);
	const [load, setLoad] = useState(true)
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
	useEffect(() => {
    	if(mode === EDIT) {
			const { id } = param
			DataService.getRow(id).then(data =>{
				let user = data.data()
				let sDate = user.dateJoined;
				let fullDate=`${new Date(sDate).getFullYear()}/${((new Date(sDate).getMonth())+1) < 10 ? '0' : ''}${(new Date(sDate).getMonth())+1}/${(new Date(sDate).getDate()) < 10 ? '0' : ''}${new Date(sDate).getDate()}`
				form.setFieldsValue({
					name: user.name,
					idNumber: user.idNumber,
					phoneNumber: user.phoneNumber,
					email: user.email,
					userRole: user.userRole,
					shares: user.shares,
					district: user.district,
					dateJoined: moment(fullDate, 'YYYY/MM/DD'),
					sector: provinceData.districts[user.district].sectors[user.sector].name,
					cell: provinceData.districts[user.district].sectors[user.sector].cells[user.cell].name,
					village: provinceData.districts[user.district].sectors[user.sector].cells[user.cell].villages[user.village].name
				});
				setImage(user.profile)
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
		history.push(`/app/apps/payments`)
	}

	const onChange = (checkedValues) => {
		setOptions(checkedValues)
		let length = checkedValues.length;
		length += checkedValues.indexOf('loan') > -1 ? 1 : 0;
		let disable = length < 2 ? true : false;
		disable = selected.length > 1 ? false : disable;
		setDisableField(disable);
		let fieldsValue = !disable ? 0 : amount;
		let loaned = (selected.length === 1 && length === 2 && checkedValues.indexOf('loan') > -1) ? true : false;
		let onlyLoan = (selected.length === 1 && length === 2 && checkedValues.indexOf('loan') > -1) ? amount : 0;
		let interests = onlyLoan ? (amount * setting['interestRate'].value)/100 : 0;
		let extra = onlyLoan ? amount - interests : 0;
		let allMembers = [];
		selected.map((doc) => {
			allMembers = {
			...allMembers,
			[doc] : {saving:fieldsValue,penalty:fieldsValue,interest: interests,loan:onlyLoan, box:false, loaned, extra},
			}
			return form.setFieldsValue({[`saving${doc}`]:fieldsValue, [`penalty${doc}`]:fieldsValue, [`interest${doc}`]:interests, [`loan${doc}`]:onlyLoan});
		})
		setSelectedData(allMembers);
		setLength(length);
		setMaximum(0);
	}

	const handleChange = value => {
		let disable = length < 2 ? true : false;
		disable = value.length > 1 ? false : disable;
		let fieldsValue = !disable ? 0 : amount;
		let loaned = (value.length === 1 && length === 2 && options.indexOf('loan') > -1) ? true : false;
		let onlyLoan = (value.length === 1 && length === 2 && options.indexOf('loan') > -1) ? amount : 0;
		let interests = onlyLoan ? (amount * setting['interestRate'].value)/100 : 0;
		let extra = onlyLoan ? amount - interests : 0;
		let allMembers = [];
		value.map((doc) => {
			allMembers = {
			...allMembers,
			[doc] : {saving:fieldsValue,penalty:fieldsValue,interest: interests,loan:onlyLoan, box:false, loaned, extra},
			}
			return form.setFieldsValue({[`saving${doc}`]:fieldsValue, [`penalty${doc}`]:fieldsValue, [`interest${doc}`]:interests, [`loan${doc}`]:onlyLoan});
		})
		setDisableField(disable);
		setSelectedData(allMembers);
		setSelected(value);
		setMaximum(onlyLoan);
		setTimeout(() => {
			setLoad(false);
		}, 1500);
	};	

	const amountChange = value => {
		value = !value ? 0 : value;
		setAmount(value);
	};

	const onValuesChange = (link,member,value) => {
		value = !value ? 0 : value;
		let allDatas = {
			...selectedData
		}
		let temp = allDatas[member][link];
		let maxLimit = maximum - temp + value;
		let diff = amount - (maxLimit - value);
		diff = diff >= 0 ? diff : 0;
		if(maxLimit > amount){
			message.destroy()
			form.setFieldsValue({[`${link}${member}`]:diff});
			message.error({ content: 'Maximum amount reached!', key, duration: 2 });
			return false;
		}
		allDatas[member][link] = value;
		setSelectedData(allDatas)
		setMaximum(maxLimit);
	};

	const onChangeInterest = (link,member,value) => {
		value = !value ? 0 : value;
		let allDatas = {
			...selectedData
		}
		let temp = allDatas[member][link];
		let onlyLoan = (length > 1 && options.indexOf('loan') > -1) ? value : 0;
		let maxLimit = maximum - temp + onlyLoan;
		let interests = onlyLoan ? (value * setting['interestRate'].value)/100 : 0;
		let extra = onlyLoan ? value - interests : 0;
		if(maxLimit > amount){
			message.destroy()
			form.setFieldsValue({[`${link}${member}`]:temp});
			message.error({ content: 'Maximum amount reached!', key, duration: 2 });
			return false;
		}
		allDatas[member][link] = value;
		allDatas[member].extra = extra;
		form.setFieldsValue({[`interest${member}`]:interests, [`loan${member}`]:onlyLoan});
		setSelectedData(allDatas)
		setMaximum(maxLimit);
	};

	const onInterestChange = (member,e) => {
		let allDatas = {
			...selectedData
		}
		allDatas[member].box = (selected.length === 1 && length === 2 && options.indexOf('loan') > -1) ? false : e.target.checked;
		allDatas[member].loaned = (selected.length === 1 && length === 2 && options.indexOf('loan') > -1) ? true : e.target.checked;
		let onlyLoan = (selected.length === 1 && length === 2 && options.indexOf('loan') > -1) ? amount : (e.target.checked ? allDatas[member].loan : allDatas[member].interest);
		let interests = onlyLoan ? (onlyLoan * setting['interestRate'].value)/100 : 0;
		let extra = !e.target.checked ? (onlyLoan ? onlyLoan - interests : 0) : 0;
		interests = e.target.checked ? onlyLoan : interests;
		onlyLoan = e.target.checked ? 0 : onlyLoan;
		allDatas[member].extra = extra;
		let temp = maximum - (allDatas[member].interest + allDatas[member].loan);
		allDatas[member].interest = e.target.checked ? interests : 0;
		allDatas[member].loan = onlyLoan;
		temp += (allDatas[member].interest + allDatas[member].loan);
		form.setFieldsValue({[`interest${member}`]:interests, [`loan${member}`]:onlyLoan});
		setSelectedData(allDatas)
		setMaximum(temp);
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
		
		if(imageState.downloadURL === ""){
			message.error('Upload employee picture');
			return;
		}
		if(verifyId.length > 0){
			message.error('Id Number is already registered');
			return;
		}
		if(verifyPhone.length > 0){
			message.error('Phone Number is already registered');
			return;
		}
		if(verifyEmail.length > 0){
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
					shares: values.shares,
					profile: imageState.downloadURL,
					district : values.district,
					userRole : values.userRole,
					dateJoined : new Date(values.dateJoined.format('YYYY-MM-DD')).setHours(0,0,0,0),
				}
				if(mode === ADD) {
					userData.status = true
					DataService.create(userData)
					setSubmitLoading(false)
					message.success(`Receipt Registered`);
				}
				if(mode === EDIT) {
					let { id } = param
					DataService.update(id,userData)
					setSubmitLoading(false)
					message.success(`Receipt updated`);
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
							<h2 className="mb-2">{mode === 'ADD'? 'Add New Receipt' : `Edit Receipt`} </h2>
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
								systemData={systemData}
								onChange={onChange}
								handleChange={handleChange}
								amountChange={amountChange}
								disableField={disableField}
								length={length}
								selected={selected}
								options={options}
								onValuesChange={onValuesChange}
								onChangeInterest={onChangeInterest}
								onInterestChange={onInterestChange}
								setting={setting}
								amount={amount}
								selectedData={selectedData}
								load={load}
							/>
						</TabPane>
					</Tabs>
				</div>
			</Form>
		</>
	)
}

export default ReceiptForm
