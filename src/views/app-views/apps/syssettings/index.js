import React, { Component } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Row, Col } from 'antd';
import Penalty from './Penalty';
import Data from './Data';

export class Faq extends Component {

	render() {

		return (
			<>
				<PageHeaderAlt className="bg-primary" overlap>
					<div className="container text-center">
						<div className="py-lg-4">
							<h1 className="text-white display-4">System Settings</h1>
							<Row type="flex" justify="center">
								<Col xs={24} sm={24} md={12}>
									<p className="text-white w-75 text-center mt-2 mb-4 mx-auto">
										Look at these words. Are they small words? And he referred to my words - if they're small, something else must be small..
									</p>
								</Col>
							</Row>
						</div>
					</div>
				</PageHeaderAlt>
				<div className="container mt-5">
					<Row gutter={16}>
						<Col xs={24} sm={24} md={24} lg={7}>
							<Penalty systemData={this.props.systemData}/>
						</Col>
						<Col xs={24} sm={24} md={24} lg={17}>
							<Data systemData={this.props.systemData}/>
						</Col>
					</Row>				
				</div>
			</>	
    	);
	}
}

export default Faq
