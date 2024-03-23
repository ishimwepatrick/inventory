import React, { Component } from "react";
import { Row, Col, Card } from 'antd';
import Brands from './Brands';
import Categories from './Categories'

export class Settings extends Component {
  render() {
    return (
      <div>
        <Row gutter={16} type="flex">
          <Col sm={24} md={24} lg={12}>
            <Card>
              <Brands systemData={this.props.systemData}/>
            </Card>
          </Col>
          <Col sm={24} md={24} lg={12}>
            <Card>
              <Categories systemData={this.props.systemData}/>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Settings;
