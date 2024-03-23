import React, { Component } from "react";
import { Card } from 'antd';
import Expenses from './Expenses';

export class Expense extends Component {
  render() {
    return <Card><Expenses systemData={this.props.systemData}/></Card>
  }
}

export default Expense;
