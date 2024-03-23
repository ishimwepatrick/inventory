import React, { Component, useState } from 'react';
import { Table, Input, Button, Popconfirm, Form, Modal, message, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import { DataService } from "services/stores.service";
import { Typography } from "antd";

const { Title } = Typography;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =  <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          label="Store name"
          rules={[
            {
              required: true,
              message: `Please Input name!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = ({systemData}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { stores, storesLoading } = systemData;
  const isEditing = record => record._id === editingKey;

  const edit = record => {
    form.setFieldsValue({ name:record.name,location:record.location });
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async e => {
    try {
      const values = await form.validateFields();
      let name = values.newStore.slice(0,1) === ' ' ? values.newStore.slice(1) : values.newStore;
      let location = values.storeLocation.slice(0,1) === ' ' ? values.storeLocation.slice(1) : values.storeLocation;
      if (name==='' || location==='') return;
      setConfirmLoading(true);
      let storeData = { name,location }
      DataService.create(storeData)
      setVisible(false);
      setConfirmLoading(false);
      form.setFieldsValue({newStore:null,storeLocation:null});
    } catch (errInfo) {}
    
  };

  const handleCancel = () => {
    setVisible(false);
    form.setFieldsValue({newStore:null,storeLocation:null});
  };

  const save = async key => {
    try {
      const row = await form.validateFields();
      let storeData = {
        name: row.name,
        location: row.location
      }
      DataService.update(key,storeData)
      setEditingKey('');
      message.success(`Store info updated`);
    } catch (errInfo) {}
  };

  const remove = key => {
    DataService.remove(key)
    message.success(`Store info deleted`);
  };

  const columns = [
    {
      title: 'Store Name',
      dataIndex: 'name',
      width: '40%',
      editable: true,
      render: (_, record) => {
        return record.data().name
      }
    },
    {
      title: 'Location',
      dataIndex: 'location',
      width: '40%',
      editable: true,
      render: (_, record) => {
        return record.data().location
      }
    },
    {
      title: '',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record.data());
        return editable ? (
          <span>
            
            <Popconfirm title="Sure to save?" onConfirm={e => {
              e.preventDefault()
              save(record.data()._id)
            }}>
              <a
              href="/#"
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            </Popconfirm>
            <a
              href="/#"
              onClick={e => {
                e.preventDefault()
                cancel(record.data()._id)
              }}
            >
              Cancel
            </a>
          </span>
        ) : (
          <>
          <a href="/#" disabled={editingKey !== ''} onClick={e => {
            e.preventDefault()
            edit(record.data())
          }}>
            <EditOutlined />
					  <span className="ml-2">Edit</span>
          </a>
          <Popconfirm title="Sure to delete?" onConfirm={e => {
              e.preventDefault()
              remove(record.data()._id)
            }}>
              <a href="/#" className="ml-2 danger"><DeleteOutlined /> Delete</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  const components = {
    body: {
      cell: EditableCell,
    },
  };
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
            <Title level={4}>Stores</Title>
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
              title="New Store details"
              visible={visible}
              onOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
            >
              <Row gutter={16}>
                <Col xs={24} sm={24} md={24}>
                  <Form.Item name="newStore" label="Store name" rules={[
                    {
                      required: true,
                      message: `name is required.`,
                    },
                  ]}>
                    <Input/>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24}>
                  <Form.Item name="storeLocation" label="Location" rules={[
                    {
                      required: true,
                      message: `Location is required.`,
                    },
                  ]}>
                    <Input
                      className="w-100"                      
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Modal>        
          </div>
        </Flex>
      </Flex>
      <Table
        components={components}
        dataSource={!storesLoading ? stores.docs : []} 
        columns={mergedColumns}
        loading={storesLoading}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
        size="middle"
      />
    </Form>
  );
};

export class Stores extends Component {
  render() {
    return (
      <EditableTable systemData={this.props.systemData}/>
    )
  }
}

export default Stores
