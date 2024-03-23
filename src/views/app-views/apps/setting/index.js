import React, { Component } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Row, Col, Card } from 'antd';
import Settings from './Setting';
import Data from './Data';

export class Setting extends Component {
	render() {
		return (
			<>
				<PageHeaderAlt className="bg-primary" overlap>
					<div className="container text-center">
						<div className="py-lg-4">
							<h1 className="text-white display-4">System Settings</h1>
							<Row type="flex" justify="center">
								<Col xs={24} sm={24} md={12}>
									<p className="text-white w-75 text-center mt-2 mb-4 mx-auto"></p>
								</Col>
							</Row>
						</div>
					</div>
				</PageHeaderAlt>
				<div className="container mt-5">
					<Row gutter={16}>
						<Col xs={24} sm={24} md={24} lg={24}>
							<Data systemData={this.props.systemData}/>
						</Col>
					</Row>				
				</div>
				<Card>
					<Settings systemData={this.props.systemData}/>
				</Card>
			</>	
		)
	}
}

export default Setting
