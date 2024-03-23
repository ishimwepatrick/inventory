import React, { Component } from "react";
import { Card } from 'antd';
import Penalty from './Penalty';

export class Penalties extends Component {
  render() {
    return <Card><Penalty systemData={this.props.systemData}/></Card>
  }
}

export default Penalties;
