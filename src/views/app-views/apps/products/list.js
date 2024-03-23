import React from 'react'
import { Table, Tooltip, Button, Popconfirm } from 'antd';
import { EyeOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';

const Products = (props) => {
		const {deleteUser, showUserProfile, products, loading, types, brand, categoriess, showBrand, showCategory, brandDisplay, catsDisplay} = props;
		const tablefullColumns = [
			{
				title: 'Product',
				dataIndex: 'product',
				render: (_,record) => record.data().productName
			},
			{
				title: 'Category',
				dataIndex: 'category',
				render: (_,record) => !showCategory ? ( categoriess[record.data().category] ? categoriess[record.data().category].name : record.data().backupCategory) : (<LoadingOutlined/>)
			},
			{
				title: 'Brand',
				dataIndex: 'brand',
				render: (_,record) => !showBrand ? ( brand[record.data().brand] ? brand[record.data().brand].name : record.data().backupBrand) : (<LoadingOutlined/>)
			},
			{
				title: 'Safety stock',
				dataIndex: 'safetyStock',
				render: (_,record) => `${record.data().safetyStock} ${record.data().safetyType === '0' ? ' Pieces' : (record.data().safetyType === '1' ? ' Carton' : types[record.data().safetyType]) }`
			},
			{
				title: 'Sale Price',
				dataIndex: 'price',
				render: (_,record) => parseInt(record.data().productType) ? `${record.data().sqmPrice} /1 ${types[record.data().productType]}` : record.data().pcsSalePrice + ' /Pc'
			},
			{
				title: '',
				dataIndex: 'actions',
				render: (_, elm) => (
					<div className="text-right">
						<Tooltip title="View">
							<Button type="primary" className="mr-2" icon={<EyeOutlined />} onClick={() => {showUserProfile(elm.data())}} size="small"/>
						</Tooltip>
						
						<Popconfirm title="Sure to delete?" onConfirm={e => {
							e.preventDefault()
							deleteUser(elm.id)
							}}>
							<Tooltip title="Delete">
								<Button danger icon={<DeleteOutlined />} size="small"/>
							</Tooltip>
						</Popconfirm>
					</div>
				)
			}
		];
		const tableColumns = [
			{
				title: 'Product',
				dataIndex: 'product',
				render: (_,record) => record.data().productName
			},
			{
				title: 'Safety stock',
				dataIndex: 'safetyStock',
				render: (_,record) => `${record.data().safetyStock} ${record.data().safetyType === '0' ? ' Pieces' : (record.data().safetyType === '1' ? ' Carton' : types[record.data().safetyType]) }`
			},
			{
				title: 'Sale Price',
				dataIndex: 'price',
				render: (_,record) => parseInt(record.data().productType) ? `${record.data().sqmPrice} /1 ${types[record.data().productType]}` : record.data().pcsSalePrice + ' /Pc'
			},
			{
				title: '',
				dataIndex: 'actions',
				render: (_, elm) => (
					<div className="text-right">
						<Tooltip title="View">
							<Button type="primary" className="mr-2" icon={<EyeOutlined />} onClick={() => {showUserProfile(elm.data())}} size="small"/>
						</Tooltip>
						
						<Popconfirm title="Sure to delete?" onConfirm={e => {
							e.preventDefault()
							deleteUser(elm.id)
							}}>
							<Tooltip title="Delete">
								<Button danger icon={<DeleteOutlined />} size="small"/>
							</Tooltip>
						</Popconfirm>
					</div>
				)
			}
		];
		const tablebrandColumns = [
			{
				title: 'Product',
				dataIndex: 'product',
				render: (_,record) => record.data().productName
			},
			{
				title: 'Brand',
				dataIndex: 'brand',
				render: (_,record) => !showBrand ? ( brand[record.data().brand] ? brand[record.data().brand].name : record.data().backupBrand) : (<LoadingOutlined/>)
			},
			{
				title: 'Safety stock',
				dataIndex: 'safetyStock',
				render: (_,record) => `${record.data().safetyStock} ${record.data().safetyType === '0' ? ' Pieces' : (record.data().safetyType === '1' ? ' Carton' : types[record.data().safetyType]) }`
			},
			{
				title: 'Sale Price',
				dataIndex: 'price',
				render: (_,record) => parseInt(record.data().productType) ? `${record.data().sqmPrice} /1 ${types[record.data().productType]}` : record.data().pcsSalePrice + ' /Pc'
			},
			{
				title: '',
				dataIndex: 'actions',
				render: (_, elm) => (
					<div className="text-right">
						<Tooltip title="View">
							<Button type="primary" className="mr-2" icon={<EyeOutlined />} onClick={() => {showUserProfile(elm.data())}} size="small"/>
						</Tooltip>
						
						<Popconfirm title="Sure to delete?" onConfirm={e => {
							e.preventDefault()
							deleteUser(elm.id)
							}}>
							<Tooltip title="Delete">
								<Button danger icon={<DeleteOutlined />} size="small"/>
							</Tooltip>
						</Popconfirm>
					</div>
				)
			}
		];
		const tablecategoryColumns = [
			{
				title: 'Product',
				dataIndex: 'product',
				render: (_,record) => record.data().productName
			},
			{
				title: 'Category',
				dataIndex: 'category',
				render: (_,record) => !showCategory ? ( categoriess[record.data().category] ? categoriess[record.data().category].name : record.data().backupCategory) : (<LoadingOutlined/>)
			},
			{
				title: 'Safety stock',
				dataIndex: 'safetyStock',
				render: (_,record) => `${record.data().safetyStock} ${record.data().safetyType === '0' ? ' Pieces' : (record.data().safetyType === '1' ? ' Carton' : types[record.data().safetyType]) }`
			},
			{
				title: 'Sale Price',
				dataIndex: 'price',
				render: (_,record) => parseInt(record.data().productType) ? `${record.data().sqmPrice} /1 ${types[record.data().productType]}` : record.data().pcsSalePrice + ' /Pc'
			},
			{
				title: '',
				dataIndex: 'actions',
				render: (_, elm) => (
					<div className="text-right">
						<Tooltip title="View">
							<Button type="primary" className="mr-2" icon={<EyeOutlined />} onClick={() => {showUserProfile(elm.data())}} size="small"/>
						</Tooltip>
						
						<Popconfirm title="Sure to delete?" onConfirm={e => {
							e.preventDefault()
							deleteUser(elm.id)
							}}>
							<Tooltip title="Delete">
								<Button danger icon={<DeleteOutlined />} size="small"/>
							</Tooltip>
						</Popconfirm>
					</div>
				)
			}
		];
		return (
				<Table 
					columns={(brandDisplay && catsDisplay) ? tablefullColumns : ((!brandDisplay && !catsDisplay) ? tableColumns : (brandDisplay ? tablebrandColumns : tablecategoryColumns))} 
					dataSource={products} 
					loading={loading} 
					rowKey='id' 
					size="small"/>
		)
}

export default Products
