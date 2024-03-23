import React, { Component, useState } from 'react';
import { Table, Input, InputNumber, Button, Form, Modal, DatePicker, message, Select, Row, Col, Avatar, Menu } from 'antd';
import { MessageOutlined, DeleteOutlined, PlusCircleOutlined, LoadingOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import { DataService } from "services/expenses.service";
import { DataService as SuppliersService } from "services/suppliers.service";
import { DataService as RecordsService } from "services/records.service";
import { Typography } from "antd";
import NumberFormat from 'react-number-format';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import utils from 'utils';
import moment from 'moment';

const { confirm } = Modal;
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const dateFormat = 'DD/MM/YYYY';
const EditableTable = ({systemData}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [visible, setVisible] = useState(false);
  const [dates] = useState(new Date());
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [member, setMember] = useState([]);
  const [deptDate, setDeptDate] = useState(0);
	const [supplierName, setSupplierName] = useState('');
	const [supplierNumber, setSupplierNumber] = useState('');
	const [grandTotal, setGrandTotal] = useState(0);
	const [paidAmount, setPaidAmount] = useState('');
	const [paymentMethod, setPaymentMethod] = useState('');
	const [showMember, setShowMember] = useState(true);
  const [shop, setShop] = useState(undefined);
  const { expenses, expensesLoading, singleShop, multiShop, stores, storesLoading, shops, shopsLoading, userData, avatarColors, methodColors, users, userLoading, } = systemData;
  const isEditing = record => record._id === editingKey;
  const [visibility, setVisibility] = useState(false);
	const handleVisibility = () => {
	  setVisibility(!visibility);
	};


  const handleDeptDateChange = date => {
		setDeptDate(new Date(date.format('YYYY-MM-DD HH:mm:ss')).getTime());
	};

	const handleNameChange = event => {
		setSupplierName(event.target.value);
	};
	
	const handleNumberChange = value => {
		let newValue = ((!value && value !== 0 )|| value === '') ? '' : ((value+'').length > 9 ? (value+'').slice(0,9) : parseInt(value));
		let newTin = ((!value && value !== 0 )|| value === '') ? '' : parseInt(value);
		let check = (value+'').slice(0,2);

		if(newValue){
			newValue = check === ('78' || '79' || '73' || '72') ? ('0' + newValue) : newTin;
		}
		setSupplierNumber(newValue);
		form.setFieldsValue({'supplierNumber': newValue});
	};

  const handlePaidChange = value => {
		let newValue = ((!value && value !== 0 )|| value === '') ? '' : parseInt(value);
		newValue = (newValue && newValue) > grandTotal ? grandTotal : newValue;
		setPaidAmount(newValue);
		setPaymentMethod('');	
		form.setFieldsValue({'PaidAmount': newValue, paymentMethod: null, debtDate:null});
	};
	
	const handleMethodChange = value => {
		setPaymentMethod(value);
	};

  const handleSpentAmount = value => {
    setGrandTotal(value)
    setPaidAmount(0);
    setPaymentMethod('');	
		form.setFieldsValue({PaidAmount: null, paymentMethod: null, debtDate:null});
  }

	const handleShopChange = value => {
		setShop(value);
	};

  function showConfirm(data) {
    confirm({
      title: 'Do you want to delete this expense record?',
      onOk() {
        remove(data)
      },
      onCancel() {},
    });
  }

  const disablePastDate = (current) => {
		let day = dates.getDate();
		day = day < 10 ? '0'+day : day;
		let month = +(dates.getMonth())+1;
		month = month < 10 ? '0'+month : month;
		let date = moment(`${day}/${month}/${dates.getFullYear()}`, dateFormat)
		if (current && current < date.startOf("day")) return true
		return false
	}  

  if(!multiShop && singleShop && !shop){
		setShop(singleShop);
		form.setFieldsValue({'shopCode': singleShop});
	}

  else if(multiShop && !shopsLoading && userData.role !== 'Admin' && !singleShop && shops[userData.userStore] && !shop){
		setShop(userData.userStore);
		form.setFieldsValue({'shopCode': userData.userStore});
	}
  function info(data) {
    Modal.info({
      title: 'Expense on '+ new Date(data.date).toLocaleDateString() +' '+ new Date(data.date).toLocaleTimeString(),
      content: (
        <div>
          <div className="mb-2">
            <h4 className="font-weight-semibold">
              <NumberFormat
                displayType={'text'} 
                value={data.amount} 
                thousandSeparator={true} 
                suffix=' Rwf'
                prefix='Amount: '
              />
            </h4>
          </div>
          <div>
            <h4 className="font-weight-semibold">Title: {data.title}</h4>
            <p>{data.comment}</p>
          </div>
        </div>
      ),
      onOk() {},
    });
  }
  
  const dropdownMenu = row => (
		<Menu>
			<Menu.Item onClick={() => {info(row)}}>
				<Flex alignItems="center">
					<MessageOutlined />
					<span className="ml-2">View Comment</span>
				</Flex>
			</Menu.Item>
			<Menu.Item onClick={() => showConfirm(row)}>
				<Flex alignItems="center">
					<DeleteOutlined />
					<span className="ml-2">Delete</span>
				</Flex>
			</Menu.Item>
		</Menu>
	);

  const cancel = () => {
    setEditingKey('');
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async e => {
    try {
      const values = await form.validateFields();

      let userId = userData.userId;
      let backupUser = userData.displayName;
      let date = new Date().getTime();
      let amount = values.amount;
      let comment = values.comment ? values.comment : '';
      let title = values.title ? values.title : '';
      title = title.slice(0,1) === ' ' ? title.slice(1) : title;
      comment = comment.slice(0,1) === ' ' ? comment.slice(1) : comment;
      if (amount==='' || title==='') return;
      setConfirmLoading(true);
      let expenseId = new Date().getTime();
      let shopCode = values.shopCode; 
      let newStore = !shopsLoading ? shops[shopCode] : {'name':'','location':''};
			let shopName = newStore.name;
			let shopLocation = newStore.location;
			let recordId = +(expenseId);
			let payCounter = paidAmount > 0 ? 1 :0;
			let supplier = {
				supplierName,
				supplierNumber,
			}
			let shopData = {
				source:shopCode,
				backupSource:shopName,
				backupLocation:shopLocation,
			}
      let records = {
				date: recordId,
				amount: paidAmount,
				method: paymentMethod,
				type: 2,
				userId : userData.userId,
				backupUser:userData.displayName,
				...supplier,
				...shopData,
			}
			let record={
				[`payID${payCounter}`]: payCounter ? recordId : '',
				[`amount${payCounter}`]: paidAmount,
				[`method${payCounter}`]: payCounter ? paymentMethod : '',
			}
      let penaltyData = { 
        date,
        debt: deptDate,
        amount,
        title,
        comment,
        payCounter,
        paid: paidAmount,
        userId,
        backupUser,
        ...supplier,
				...record,
        ...shopData,
      }
      DataService.create(penaltyData);
      if(paidAmount > 0) RecordsService.create(records,recordId);
			if(supplierNumber && supplierName) SuppliersService.create(supplier,supplierNumber);
      setVisible(false);
      setConfirmLoading(false);
      form.setFieldsValue({supplierName:null, supplierNumber:null, amount:null,title: null,comment: null, PaidAmount: null, paymentMethod: null});
    } catch (errInfo) {}
  };

  const handleCancel = () => {
    setVisible(false);
    form.setFieldsValue({supplierName:null, supplierNumber:null, amount:null,title: null,comment: null, PaidAmount: null, paymentMethod: null});
  };

  const remove = key => {
      DataService.remove(key._id);
      message.success(`Expense deleted`,3);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (_, record) => {
        return new Date(record.data().date).toLocaleDateString()
      }
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (_, record) => {
        return (
          <NumberFormat
            displayType={'text'} 
            value={record.data().amount} 
            thousandSeparator={true} 
            suffix=' Rwf'
          />
        )
      }
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      render: (_, record) => {
        return record.data().title
      }
    },
    {
      title: 'Payment',
      dataIndex: 'method',
      render: (_,record) => (<div>{methodColors(record.data())}</div>)
    },
    {
      title: 'Balance',
      dataIndex: 'paid',
      render: (_,record) => (<NumberFormat displayType={'text'} value={parseInt(record.data().amount - record.data().paid)} thousandSeparator={true}/>)
    },
    {
      title: 'Done by',
      dataIndex: 'admin',
      render: (_, record) => (
          <div className="d-flex align-items-center">
					  {!userLoading &&(<Avatar size={30} className="font-size-sm" style={{backgroundColor: avatarColors[Math.floor(Math.random() * avatarColors.length) - 1]}}>
						{utils.getNameInitial(users[record.data().userId] ? users[record.data().userId].name : record.data().backupUser)}
					  </Avatar>)}
					  <span className="ml-2">{ !userLoading ? (users[record.data().userId] ? users[record.data().userId].name : record.data().backupUser) : (<LoadingOutlined/>)}</span>
					</div>
        )
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, elm) => (
				<div className="text-right">
					<EllipsisDropdown menu={dropdownMenu(elm.data())}/>
				</div>
			)
    }
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record.data()),
      }),
    };
  });
  return (
    <Form form={form} component={false} layout="vertical">
      <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3">
            <Title level={4}>Expenses</Title>
          </div>
        </Flex>
        <Flex mobileFlex={false}>
          <div>
            <Button size={'small'} 
                    style={{
                      marginTop: 0,
                      paddingTop: 0,
                    }}
                    onClick={showModal}
                    type="primary" icon={<PlusCircleOutlined />} block>Add New</Button>
            <Modal
              title="New expense"
              visible={visible}
              onOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
            >
              <Row gutter={16}>
                <Col xs={24} sm={24} md={24}>
                  <Form.Item
                    name="shopCode"
                    label="Store Amount Spent from"
                    className={multiShop ? 'blockform-col col-12' : 'd-none'}
                    rules={[{ required: true, message: 'a store is required' }]}
                  >
                    <Select placeholder="Select a store" onChange={handleShopChange}>
                    {!storesLoading && stores.docs.map((store, index) => (
                      <Option key={index} value={store.data()._id}>
                      {store.data().name}
                      </Option>
                    ))}
                    </Select>
                </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12}>
                        <Form.Item
                          label="Supplier Name"
                          name="supplierName"
                          rules={[{ required: true, message:"Enter supplier name" }]}
                        >
                        <Input placeholder="Supplier name" value={supplierName} onChange={handleNameChange}/>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12}>
                      <Form.Item
                        label="Supplier Number"
                        name="supplierNumber"
                        rules={[{ required: true, message:"Enter TIN or Phone Number" }]}
                      >
                        <InputNumber placeholder="TIN or Phone Number" className="w-100" value={supplierNumber} onChange={handleNumberChange}/>
                      </Form.Item>
                    </Col>
                <Col xs={24} sm={12} md={12}>
                  <Form.Item label="Total Amount Spent" name="amount" className="w-100" rules={[
                    {
                      required: true,
                      message: `Enter amount spent!`,
                    },
                  ]}>
                    <InputNumber
                      className="w-100"
                      min={0}
                      onChange={handleSpentAmount}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12} md={12}>
                  <Form.Item label="Reason" name="title" className="w-100" rules={[
                    {
                      required: true,
                      message: `Provide reason!`,
                    },
                  ]}>
                    <Input className="w-100"/>
                  </Form.Item>
                </Col>
                
                
                <Col xs={24} sm={12} md={12}>
                  <Form.Item label="Amount Paid" name="PaidAmount" className="w-100" rules={[
                    {
                      required: true,
                      message: `Enter amount paid!`,
                    },
                  ]}>
                    <InputNumber
                      className="w-100"
                      min={0}
                      onChange={handlePaidChange}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12}>
                <Form.Item
											label="Payment Method"
											name="paymentMethod"
											rules={[{ required: true,message: `Specify payment method.` }]}
                      style={{ display: 'block'}}
                      className="w-100" 
										>
											<Select
												className="w-100"
												placeholder="-Select-"
												value={paymentMethod}
												onChange={handleMethodChange}
												>
													{parseInt(paidAmount) > 0 && (<Option value='Cash' disabled={paidAmount==='' || paidAmount===0}>Cash</Option>)}
													{parseInt(paidAmount) > 0 && (<Option value='Cheque' disabled={paidAmount==='' || paidAmount===0}>Cheque</Option>)}
													{parseInt(paidAmount) > 0 && (<Option value='Mobile Money' disabled={paidAmount==='' || paidAmount===0}>Mobile Money</Option>)}
													{parseInt(paidAmount) > 0 && (<Option value='Bank Transfer' disabled={paidAmount==='' || paidAmount===0}>Bank Transfer</Option>)}
													{parseInt(paidAmount) === 0 && (<Option value='Not Paid' disabled={paidAmount>0}>Not Paid</Option>)}
											</Select>
										</Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} className="text-right">
                  <Button size={'small'} 
                    className="p-0 m-0"
                    onClick={handleVisibility}
                    type="link" icon={visibility ? <MinusOutlined/> : <PlusOutlined/> }>
                      {visibility ? 'Remove' : 'Add' } Description
                  </Button>
                </Col>
                {(visibility) ? (
                  <Col xs={24} sm={24} md={24}>
                    <Row gutter={16}>
                    <Col xs={24} sm={24} md={24}>
                      <Form.Item name="comment" label="Expense Description" 
                        style={{ display: 'block'}}
                        className="w-100" rules={[
                        {
                          required: {visibility},
                          message: `Description is required.`,
                        },
                      ]}>
                        <TextArea
                          className="w-100"
                          placeholder="Description"
                          autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  </Col>
					      ) : null}
                    <Col xs={24} sm={24} md={24}>
										<Form.Item 
											label="When to pay the remaining amount?" 
											name="debtDate"
                      style={{ display: 'block'}}
											className={ (grandTotal>0 && paidAmount !== '' && paymentMethod !== '' && paidAmount !== grandTotal) ? 'w-100' : 'd-none'}
											rules={[{ required: paidAmount !== grandTotal, message: `Specify date to pay the remaining amount.` }]}>
											<DatePicker className="w-100" format={dateFormat} disabledDate={disablePastDate} onChange={handleDeptDateChange} disabled={paidAmount === grandTotal}/>
										</Form.Item>
                </Col>
                
              </Row>
            </Modal>        
          </div>
        </Flex>
      </Flex>
      <Table
        dataSource={!expensesLoading ? ((!shopsLoading && shops[userData.userStore]) ? expenses.docs.filter(x=> x.data().source === userData.userStore).reverse() : expenses.docs.reverse()) : []} 
        columns={mergedColumns}
        loading={expensesLoading}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
        size="middle"
      />
    </Form>
  );
};

export class Penalties extends Component {
  render() {
    return (
      <EditableTable systemData={this.props.systemData}/>
    )
  }
}

export default Penalties
