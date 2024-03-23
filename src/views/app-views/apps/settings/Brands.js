import React, { Component, useState } from 'react';
import { Table, Input, Button, Popconfirm, Form, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex'
import { DataService } from "services/brands.service";
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
  const { brands, brandsLoading } = systemData;
  const isEditing = record => record._id === editingKey;

  const edit = record => {
    form.setFieldsValue({ name:record.name });
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
      let name = values.newBrand.slice(0,1) === ' ' ? values.newBrand.slice(1) : values.newBrand;
      if (name==='') return;
      setConfirmLoading(true);
      let brandData = { name }
      DataService.create(brandData)
      setVisible(false);
      setConfirmLoading(false);
      form.setFieldsValue({newBrand:null});
    } catch (errInfo) {}
    
  };

  const handleCancel = () => {
    setVisible(false);
    form.setFieldsValue({newBrand:null});
  };

  const save = async key => {
    try {
      const row = await form.validateFields();
      let brandData = {
        name: row.name
      }
      DataService.update(key,brandData)
      setEditingKey('');
      message.success(`Brand updated`);
    } catch (errInfo) {}
  };

  const remove = key => {
    DataService.remove(key)
    message.success(`Brand deleted`);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '70%',
      editable: true,
      render: (_, record) => {
        return record.data().name
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
    <Form form={form} component={false}>
      <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3">
            <Title level={4}>Brands</Title>
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
                    type="link" icon={<PlusCircleOutlined />} block>Add New</Button>
            <Modal
              title="New Brand"
              visible={visible}
              onOk={handleOk}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
            >
              <Form.Item
                style={{
                  margin: 0,
                }}
                name='newBrand'
                rules={[
                  {
                    required: true,
                    message: `name is required.`,
                  },
                ]}
              >
                <Input onPressEnter={handleOk} />
              </Form.Item>
            </Modal>        
          </div>
        </Flex>
      </Flex>
      <Table
        components={components}
        dataSource={!brandsLoading ? brands.docs : []} 
        columns={mergedColumns}
        loading={brandsLoading}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
        size="middle"
      />
    </Form>
  );
};

export class Brands extends Component {
  render() {
    return (
      <EditableTable systemData={this.props.systemData}/>
    )
  }
}

export default Brands
