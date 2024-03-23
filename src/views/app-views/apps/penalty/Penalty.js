import React, { Component, useState } from 'react';
import { Table, Input, Button, Form, Modal, message, Row, Col, Avatar, Select, Tag, Menu } from 'antd';
import { MessageOutlined, DeleteOutlined, PlusCircleOutlined, LoadingOutlined, DoubleRightOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import { DataService } from "services/penalties.service";
import { Typography } from "antd";
import UserView from './UserView';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import utils from 'utils';

const { confirm } = Modal;
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const EditableTable = ({systemData}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [visible, setVisible] = useState(false);
  const [userProfileVisible, setUserProfileVisible] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null)
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [member, setMember] = useState([]);
  const [pensList, setPensList] = useState([]);
	const [showMember, setShowMember] = useState(true);
	const [showPenalty, setShowPenalty] = useState(true);
  const { penalties, penaltiesLoading, penalty, penaltyLoading, members, membersLoading, userData, getColor, avatarColors  } = systemData;
  const isEditing = record => record._id === editingKey;
  if(!membersLoading){
		let allRecords = [];
	  	let lastMember = '';
		members.docs.map((doc) => {
			allRecords = {
			...allRecords,
			[doc.data()._id] : {'id': doc.data()._id,'name': doc.data().name,'shares': doc.data().shares,'email': doc.data().email,'profile': doc.data().profile,'userRole': doc.data().userRole,'status': doc.data().status,'phoneNumber': doc.data().phoneNumber,'idNumber': doc.data().idNumber,'district': doc.data().district,'sector': doc.data().sector,'cell': doc.data().cell,'village': doc.data().village},
			}
			lastMember = doc.data()._id;
			return true;
		})
		if(lastMember && (showMember || !member[lastMember])){
			setMember(allRecords); 
			setShowMember(false);
		}
	}
  if(!penaltyLoading){
		let allRecords = [];
	  let lastPenalty = '';
		penalty.docs.map((doc) => {
			allRecords = {
			...allRecords,
			[doc.data()._id] : {'id': doc.data()._id,'title': doc.data().title,'fine': doc.data().fine},
			}
			lastPenalty = doc.data()._id;
			return true;
		})
		if(lastPenalty && (showPenalty || !pensList[lastPenalty])){
			setPensList(allRecords); 
			setShowPenalty(false);
		}
	}

  function showConfirm(data) {
    confirm({
      title: 'Do you want to delete this penalty record?',
      onOk() {
        remove(data)
      },
      onCancel() {},
    });
  }

  function info(data) {
    Modal.info({
      title: !showMember ? member[data.member].name : '',
      content: (
        <div>
          
          <div className="mb-2">
            <h4 className="font-weight-semibold">Penalty</h4>
            <AvatarStatus name={data.title} subTitle={'Fine: '+ data.fine +' Rwf'} size={0}/>
          </div>
          <div>
            <h4 className="font-weight-semibold">Comment</h4>
            <p><MessageOutlined /> {data.comment}</p>
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
      let memberID = values.member;
      let backupProfile = member[memberID].profile;
      let backupName = member[memberID].name;
      let backupPhoneNumber = member[memberID].phoneNumber;
      let fine = values.penalty;
      let penaltyfine = pensList[fine].fine;
      let penaltyTitle = pensList[fine].title;
      let admin = userData.userId;
      let backupAdmin = userData.displayName;
      let date = new Date().getTime();
      let comment = values.comment.slice(0,1) === ' ' ? values.comment.slice(1) : values.comment;
      if (memberID==='' || !penaltyfine || !penaltyTitle || comment==='') return;
      setConfirmLoading(true);
      let penaltyData = { date, member:memberID,fine:penaltyfine,title:penaltyTitle,comment,admin,penalty:fine,paid:0,backupProfile,backupName,backupPhoneNumber,backupAdmin }
      DataService.create(penaltyData)
      setVisible(false);
      setConfirmLoading(false);
      form.setFieldsValue({member:'',penalty: '' ,comment:' '});
    } catch (errInfo) {}
  };

  const handleCancel = () => {
    setVisible(false);
    form.setFieldsValue({member:'',penalty: '' ,comment:' '});
  };

  const showUserProfile = userInfo => {
		setUserProfileVisible(true)
		setSelectedUser(userInfo)
	};
	
	const closeUserProfile = () => {
		setUserProfileVisible(false)
		setSelectedUser(null)
	}

  const remove = key => {
    if (key.paid > 0) message.error(`Unable to delete a paid penalty`,3);
    else{
      DataService.remove(key._id);
      message.success(`${!showMember ? member[key.member].name+"'s" : ''} penalty deleted`,3);
    }
  };

  const columns = [
    
    {
			title: 'Member',
			dataIndex: 'name',
			render: (_, record) => (
				<div className="d-flex" onClick={() => {showUserProfile(member[record.data().member])}} style={{cursor:'pointer'}}>
					<AvatarStatus size={50} type="square" src={!showMember ? (member[record.data().member] ? member[record.data().member].profile : record.data().backupProfile) : (<LoadingOutlined/>)} name={!showMember ? (member[record.data().member] ? member[record.data().member].name : record.data().backupName) : ''} subTitle={!showMember ? (member[record.data().member] ? '0'+member[record.data().member].phoneNumber : '0'+record.data().backupPhoneNumber) : ''}/>
				</div>
			),
		},
    {
      title: 'Penalty',
      dataIndex: 'penalty',
      render: (_, record) => {
        return (<AvatarStatus name={record.data().title} subTitle={record.data().fine + ' Rwf'} size={1}/>)
      }
    },
    {
      title: 'Paid',
      dataIndex: 'paid',
      render: (_, record) => {
        return (
          <Tag color={getColor(record.data().fine,record.data().paid)} key={record.data()._id}>
            {record.data().paid}
          </Tag>
        )
      }
    },
    {
      title: 'Done by',
      dataIndex: 'admin',
      render: (_, record) => (
        <div className="d-flex align-items-center">
          <Avatar size={30} className="font-size-sm" style={{backgroundColor: avatarColors[Math.floor(Math.random() * avatarColors.length) - 1]}}>
            {!showMember ? (member[record.data().admin] ? utils.getNameInitial(member[record.data().admin].name) : utils.getNameInitial(record.data().backupAdmin)) : ''}
          </Avatar>
          <span className="ml-2">{!showMember ? (member[record.data().admin] ? member[record.data().admin].name : record.data().backupAdmin) : (<LoadingOutlined/>)}</span>
        </div>
        )
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (_, record) => {
        return new Date(record.data().date).toLocaleDateString()
      }
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, elm) => (
				<div className="text-right">
					<EllipsisDropdown menu={dropdownMenu(elm.data())}/>
				</div>
			)
    },
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
            <Title level={4}>Penalized Members</Title>
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
              title="New imposed penalty"
              visible={visible}
              onOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
            >
              <Row gutter={16}>
                <Col xs={24} sm={24} md={24}>
                  <Form.Item label="Member" name="member" className="blockform-col col-12" rules={[
                    {
                      required: true,
                      message: `Select a member to penalise!`,
                    },
                  ]}>
                    <Select
                      className="w-100"
                      placeholder="select a member"
                      optionLabelProp="label"
                    >
                      {
                        !membersLoading && members.docs.map(member => (
                          <Option key={member.id} value={member.id} label={member.data().name}>
                            <Avatar 
                              className="cursor-pointer" 
                              size={25} 
                              src={member.data().profile}
                            >
                            </Avatar>
                            <span className="pt-2 pl-1" aria-label={member.data().name}>
                              {member.data().name}
                            </span>
                          </Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24}>
                  <Form.Item label="Penalty " name="penalty" className="blockform-col col-12" rules={[
                    {
                      required: true,
                      message: `Penalty imposed is required!`,
                    },
                  ]}>
                    <Select
                      className="w-100"
                      placeholder="Choose penalty imposed"
                      optionLabelProp="label"
                    >
                      {
                        !penaltyLoading && penalty.docs.map(pens => (
                          <Option key={pens.id} value={pens.id} label={`${pens.data().title} (${pens.data().fine} Rwf)`}>
                            <DoubleRightOutlined/>
                            <span className="pt-2 pl-1" aria-label={pens.data().title}>
                              {`${pens.data().title} (${pens.data().fine} Rwf)`}
                            </span>
                          </Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>                
                <Col xs={24} sm={24} md={24}>
                  <Form.Item name="comment" label="Comment" rules={[
                    {
                      required: true,
                      message: `Comment or description is required.`,
                    },
                  ]}>
                    <TextArea
                      placeholder="Comment"
                      autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Modal>        
          </div>
        </Flex>
      </Flex>
      <Table
        dataSource={!penaltiesLoading ? penalties.docs.reverse() : []} 
        columns={mergedColumns}
        loading={penaltiesLoading}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
        size="middle"
      />
      <UserView data={selectedUser} visible={userProfileVisible} close={()=> {closeUserProfile()}}/>
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
