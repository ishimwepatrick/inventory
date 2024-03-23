import React, { useState } from 'react'
import { Card, message, Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import { Typography } from "antd";
import { DataService } from "services/products.service";
import Add from './add';
import Item from './item';
import List from './list';

const { Title } = Typography;
const Products = ({systemData}) => {
	const [selectedUser, setSelectedUser] = useState(null);
	const [userProfileVisible, setUserProfileVisible] = useState(false);
	const { brands, brandsLoading, category, categoryLoading, products, productsLoading, types, brand, categoriess, showBrand, showCategory, stores, storesLoading, setting, setsLoading } = systemData;
	const [brandDisplay, setBrandDisplay] = useState(false);
	const [catsDisplay, setCatsDisplay] = useState(false);
	const [codeDisplay, setCodeDisplay] = useState({xs:0,sm:0,md:0})
	const [nameDisplay, setNameDisplay] = useState({xs:22,sm:20,md:12})
	const [rules, setRules] = useState(false);
	const [useCode, setUseCode] = useState(false);
	const [priceDisplay, setPriceDisplay] = useState(false)
	const [purchaseShare, setPurchaseShare] = useState(false)
	const [visible, setVisible] = useState(false);
	const [byPiece, setByPiece] = useState(false);
	const deleteUser = userId => {
		DataService.remove(userId);
		message.success({ content: `Product Deleted`, duration: 3 });
	}

	const showUserProfile = userInfo => {
		setSelectedUser(userInfo)
		setUserProfileVisible(true)
	};
	
	const closeUserProfile = () => {
		setUserProfileVisible(false)
		setSelectedUser(null)
	}
	
	if(!rules){ 
		if(!setsLoading){
		  if(setting['product_code'] && setting['product_code'].value){
			setCodeDisplay({xs:11,sm:10,md:6})
			setNameDisplay({xs:11,sm:10,md:6})
			setUseCode(true);
		  }
		  if(setting['category'] && setting['category'].value){
			setCatsDisplay(true)
		  }
		  if(setting['brand'] && setting['brand'].value){
			setBrandDisplay(true)
		  }
		  if(setting['prices'] && setting['prices'].value === 2){
			setPriceDisplay(true)
		  }
		  if(setting['purchases'] && setting['purchases'].value === 2){
			setPurchaseShare(true)
		  }
		  setRules(true)
		}
	  }
		return (
			<>
			{!visible ? (<Card>
				<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
					<Flex className="mb-1" mobileFlex={false}>
						<div className="mr-md-3">
							<Title level={4}>Products</Title>
						</div>
					</Flex>
					{/* <Flex mobileFlex={false}>
						<Add DataService={DataService} AllBrands={brands} AllCategory={category} bloading={brandsLoading} cloading={categoryLoading} types={types} brand={brand} categoriess={categoriess} showBrand={showBrand} showCategory={showCategory} stores={stores} storesLoading={storesLoading}/>        
					</Flex> */}
					<Flex mobileFlex={false}>
						<Button size={'small'} 
								style={{
								marginTop: 0,
								paddingTop: 0,
								}}
								onClick={() => setVisible(true)}
								type="primary" icon={<PlusCircleOutlined />} block>Add New</Button>
					</Flex>
				</Flex>
				<List products={productsLoading ? [] : products.docs} loading={productsLoading} deleteUser={deleteUser} showUserProfile={showUserProfile} types={types} brand={brand} categoriess={categoriess} showBrand={showBrand} showCategory={showCategory} brandDisplay={brandDisplay} catsDisplay={catsDisplay}/>
				<Item data={selectedUser} visible={userProfileVisible} close={()=> {closeUserProfile()}} DataService={DataService} AllBrands={brands} AllCategory={category} bloading={brandsLoading} cloading={categoryLoading} types={types} setting={setting} setsLoading={setsLoading}/>        
			</Card>) : 
			(<Card>
				<Flex alignItems="center" justifyContent="between" mobileFlex={true}>
					<Flex className="mb-3 text-center" mobileFlex={true}>
						<div className="mr-md-3">
							<Title className="text-center" level={4}>New Product</Title>
						</div>
					</Flex>
				</Flex>
				<Add 
					DataService={DataService} 
					AllBrands={brands} 
					AllCategory={category} 
					bloading={brandsLoading} 
					cloading={categoryLoading} 
					types={types} 
					brand={brand} 
					categoriess={categoriess} 
					showBrand={showBrand} 
					showCategory={showCategory} 
					stores={stores} 
					storesLoading={storesLoading} 
					setVisible={setVisible} 
					setting={setting} 
					setsLoading={setsLoading}
					brandDisplay={brandDisplay}
					catsDisplay={catsDisplay}
					codeDisplay={codeDisplay}
					nameDisplay={nameDisplay}
					byPiece={byPiece} 
					setByPiece={setByPiece}
					useCode={useCode}
					priceDisplay={priceDisplay}
					purchaseShare={purchaseShare}
				/>        
			</Card>)}
			</>
		)
}

export default Products
