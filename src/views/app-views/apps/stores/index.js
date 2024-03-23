import React, { Component } from "react";
import { Card } from 'antd';
import Store from './Stores';

export class Stores extends Component {
  render() {
    return <Card><Store systemData={this.props.systemData}/></Card>
          
  }
}

export default Stores;
