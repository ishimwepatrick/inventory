import React, { Component } from 'react';
import { Avatar, Drawer, Tag, Divider,Button, Menu, Dropdown } from 'antd';
import LocationData from "assets/data/district.json"
import { 
	MobileOutlined, 
	MailOutlined, 
	UserOutlined, 
	CompassOutlined,
	IdcardOutlined,
	InfoCircleOutlined,
	DownOutlined
} from '@ant-design/icons';

export class UserView extends Component {
	state = {
		provinceData : LocationData
	}
	getUserStatus = status => {
		if(status) {
			return <Tag className ="text-capitalize" color='cyan'>Active</Tag>
		}
		else{
			return <Tag className ="text-capitalize" color='red'>Blocked</Tag>
		}
	}
	render() {
		const { data, visible, close, handleMenuClick} = this.props;
		const { provinceData } = this.state;
		const menu = (
			<Menu onClick={()=>handleMenuClick(data)}>
			  <Menu.Item key="1" disabled={!(data && !data.status)}>Activate</Menu.Item>
			  <Menu.Item key="2" disabled={!(data && data.status === true)}>Block</Menu.Item>
			</Menu>
		  );
		return (
			<Drawer
				width={300}
				placement="right"
				onClose={close}
				closable={false}
				visible={visible}
			>
				<div className="text-center mt-3">
					<Avatar size={80} src={data?.profile} />
					<h3 className="mt-2 mb-0">{data?.name}</h3>
					<span className="text-muted">{data?.email}</span>
				</div>
				<Divider dashed />
				<div className="">
					<h6 className="text-muted text-uppercase mb-3">Account details</h6>
					<p>
						<UserOutlined />
						<span className="ml-3 text-dark">{data?.userRole}</span>
					</p>
					<p>
						<InfoCircleOutlined />
						<span className="ml-3 text-dark">Status {this.getUserStatus(data?.status)}</span>
							<Dropdown overlay={menu}>
								<Button size={'small'} style={{padding: '5px'}}>
									<DownOutlined />
								</Button>
							</Dropdown>
					</p>
				</div>
				<div className="mt-5">
					<h6 className="text-muted text-uppercase mb-3">CONTACT</h6>
					<p>
						<MobileOutlined />
						<span className="ml-3 text-dark">{data?.phoneNumber? '0'+data?.phoneNumber: '-'}</span>
					</p>
					<p>
						<IdcardOutlined />
						<span className="ml-3 text-dark">{data?.idNumber}</span>
					</p>
					<p>
						<MailOutlined />
						<span className="ml-3 text-dark">{data?.email? data?.email: '-'}</span>
					</p>
					
				</div>
				<div className="mt-5">
					<h6 className="text-muted text-uppercase mb-3">Address</h6>
					<p>
						<CompassOutlined />
						<span className="ml-3 text-dark">{data?.district? provinceData.districts[data.district].name + ' District' : '-'}</span>
					</p>
					<p>
						<CompassOutlined />
						<span className="ml-3 text-dark">{data?.sector? provinceData.districts[data.district].sectors[data.sector].name + ' Sector' : '-'}</span>
					</p>
					<p>
						<CompassOutlined />
						<span className="ml-3 text-dark">{data?.cell? provinceData.districts[data.district].sectors[data.sector].cells[data.cell].name + ' Cell' : '-'}</span>
					</p>
					<p>
						<CompassOutlined />
						<span className="ml-3 text-dark">{data?.village? provinceData.districts[data.district].sectors[data.sector].cells[data.cell].villages[data.village].name + ' Village': '-'}</span>
					</p>
				</div>
			</Drawer>
		)
	}
}

export default UserView
