import React, { useState } from 'react';
import { List, Switch, Radio, message } from 'antd';
import { 
	BarcodeOutlined, 
	TagOutlined, 
	ShoppingCartOutlined,
	ClusterOutlined,
	LoadingOutlined,
	EuroOutlined
} from '@ant-design/icons';
import Icon from 'components/util-components/Icon';
import Flex from 'components/shared-components/Flex'
import { DataService } from "services/settings.service";

const Setting = ({systemData}) => {
	const {settings, settingsLoading} = systemData;
	const [setting, setSetting] = useState([]);
  	const [setsLoading, setSetsLoading] = useState(true);
	const [config, setConfig] = useState([
		{
			key: 'product_code',
			title: 'Product Code',
			icon: BarcodeOutlined,
			desc: 'Allow Each Product to have an extra text field for product code.',
			boolean: true,
			allow: false
		},
		{
			key: 'category',
			title: 'Category',
			icon: ClusterOutlined,
			desc: 'Allow Each Product to have a category and brand on product table.',
			boolean: true,
			allow: false
		},
		{
			key: 'brand',
			title: 'Brand',
			icon: TagOutlined,
			desc: 'Allow Each Product to have a category and brand on product table.',
			boolean: true,
			allow: false
		},
		{
			key: 'purchases',
			title: 'Purchased Allocation',
			icon: ShoppingCartOutlined,
			option1: 'Purchase for a specific store then purchased products goes in stock of specified store.',
			option2: 'Purchase once for all stores then distribute purchased products to store one by one.',
			options: true,
			checked: null,
		},
		{
			key: 'prices',
			title: 'Products Prices',
			icon: EuroOutlined,
			option1: 'Prices of Carton, packet or dozen varies according to Sale or purchase price of one piece',
			option2: 'Carton, packet or dozen have their own prices, independent to price of one piece. ',
			options: true,
			checked: null,
		}			
	]);
	
	if(!settingsLoading){
		let allRecords = [];
	 	let lastSetting = '';
		let changes = false;
		settings.docs.map((doc) => {
		allRecords = {
		  ...allRecords,
		  [doc.data()._id] : {'value': doc.data().value},
		}
		lastSetting = doc.data()._id;
		changes = !setting[lastSetting] || setting[lastSetting].value !== doc.data().value
		? true : changes; 
		return true;
		})
		if(changes || (lastSetting && (setsLoading || !setting[lastSetting]))){
			setSetting(allRecords)
			setSetsLoading(false);
			let checkedItem = config.map( elm => {
				if(allRecords[elm.key]){
					if(elm.options){
						elm.checked = allRecords[elm.key].value
					}
					else{
						elm.allow = allRecords[elm.key].value
					}			
				}				
				return elm
			})
			setConfig([
				...checkedItem	
			])
		}
	}

	const onChange = (key,e) => {
		message.loading({ content: 'Saving...', key:'key' });
		let value = e.target ? e.target.value : e;
		const checkedItem = config.map( elm => {
			if(elm.key === key) {
				if(elm.options){
					elm.checked = value
				}
				else{
					elm.allow = value
				}							}
			return elm
		})
		setConfig([
			...checkedItem	
		])
		setTimeout(() => {
			DataService.create({ value },key);
			message.success({ content: 'Changes Saved!', key:'key', duration: 2 });
		}, 1000);
		// let value = e.target ? e.target.value : e
		// console.log(setting);
		// console.log(key + ' ' + value);
		// let sysDatas = { value }
      	// DataService.create(sysDatas,key);
		// setTimeout(() => {
		// 	message.success({ content: 'Changes Saved!', key:'key', duration: 2 });
		// }, 1000);

	};

	const radioStyle = {
		display: 'block',
		height: '35px',
		lineHeight: '35px',
	};

	return (
		<List
			itemLayout="horizontal"
			dataSource={config}
			renderItem={item => (
				<List.Item>
					<Flex justifyContent="between" alignItems="center" className="w-100">
						<div className="d-flex align-items-center">
							<Icon className="h1 mb-0 text-primary" type={item.icon} />
							<div className="ml-3">
								<h4 className="mb-0">{item.title}</h4>
								{item.boolean ? (<p>{item.desc}</p>) : null}
								{item.options ? 
								(<Radio.Group onChange={checked => {onChange(item.key,checked)}} 
									value={item.checked} 
									className="ml-1">
									<Radio style={radioStyle} value={1}>
										{item.option1}
									</Radio>
									<Radio style={radioStyle} value={2}>
										{item.option2}
									</Radio>
									</Radio.Group>) 
								: null}
							</div>
						</div>
						{item.boolean ? 
							(<div className="ml-3">
								<Switch defaultChecked={item.allow} 
								onChange={checked => {onChange(item.key,checked)}}  />
							{(!setsLoading && setting[item.key]) ? null : <LoadingOutlined/>}
						</div>) : null}
					</Flex>
				</List.Item>
			)}
		/>
	)
}

export default Setting
