import React, { useState } from 'react'
import { Input, InputNumber, Form, Modal, message, Button, Row, Col, Card, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import { DataService } from "services/penalty.service";

const Penalty = ({systemData}) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const { penalty, penaltyLoading } = systemData;
  const cardDropdown = () => (
    <a href="/#" className="text-gray font-size-sm" onClick={e => {e.preventDefault(); showModal()}}>
      <PlusOutlined className="text-gray font-size-sm"/> Create New
    </a>
  )
  const edit = record => {
    form.setFieldsValue({ Oldtitle:record.title,Oldfine:record.fine });
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey('');
    form.setFieldsValue({Oldtitle:null,Oldfine:null});
  };

  const save = async () => {
    try {
      const row = await form.validateFields();
      let title = row.Oldtitle.slice(0,1) === ' ' ? row.Oldtitle.slice(1) : row.Oldtitle;
      let fine = row.Oldfine;
      if (title==='' || fine===0) return;
      let penaltyData = {title, fine}
      DataService.update(editingKey,penaltyData)
      setEditingKey('');
      form.setFieldsValue({Oldtitle:null,Oldfine:null});
      message.success(`Penalty updated`);
    } catch (errInfo) {}
  };

  const remove = () => {
    DataService.remove(editingKey)
    message.success(`Penalty deleted`);
  };

  const showModal = () => {
    setVisible(true);
  }
  const handleOk = async e => {
    try {
      const values = await form.validateFields();
      let title = values.title.slice(0,1) === ' ' ? values.title.slice(1) : values.title;
      let fine = values.fine;
      if (title==='' || fine===0) return;
      setConfirmLoading(true);
      let penaltyData = { title,fine }
      DataService.create(penaltyData)
      setVisible(false);
      setConfirmLoading(false);
      form.setFieldsValue({title:null,fine:null});
    } catch (errInfo) {}
    
  }
  const handleCancel = () => {
    setVisible(false);
    form.setFieldsValue({title:null,fine:null});
  }
	return (
		<Card title="Penalties" extra={cardDropdown()}>
            <div >
              {
                !penaltyLoading && penalty.docs.map((elm, i) => (
                  <div key={i} className={`d-flex align-items-center justify-content-between mb-4 cursor-pointer`} onClick={() => {edit(elm.data())}}>
                    <AvatarStatus id={i} name={elm.data().title} subTitle={elm.data().fine + ' Rwf'} size='small'/>
                  </div>
                ))
              }
            </div>
            <Form form={form} component={false} layout="vertical">
              <Modal
                title="New Penalty"
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={24}>
                    <Form.Item name="title" label="Title" rules={[
                      {
                        required: true,
                        message: `Penalty name is required.`,
                      },
                    ]}>
                      <Input/>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24}>
                    <Form.Item name="fine" label="Fine" rules={[
                      {
                        required: true,
                        message: `Fine amount is required.`,
                      },
                    ]}>
                      <InputNumber
                        className="w-100"
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        addonAfter="Rwf" 
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Modal> 
              <Modal
                title="Update Penalty"
                visible={editingKey}
                onOk={save}
                onCancel={cancel}
                footer={[
                  <Popconfirm
                    title="Are you sure delete this?"
                    onConfirm={remove}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button key="delete" className="float-left">
                      <DeleteOutlined/> Delete
                    </Button>
                  </Popconfirm>,
                  <Button key="back" onClick={cancel}>
                  Cancel
                </Button>,
                  <Button key="submit" type="primary" loading={confirmLoading} onClick={save}>
                    OK
                  </Button>,
                ]}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={24}>
                    <Form.Item name="Oldtitle" label="Title" rules={[
                      {
                        required: true,
                        message: `Penalty name is required.`,
                      },
                    ]}>
                      <Input/>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24}>
                    <Form.Item name="Oldfine" label="Fine" rules={[
                      {
                        required: true,
                        message: `Fine amount is required.`,
                      },
                    ]}>
                      <InputNumber
                        className="w-100"
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        addonAfter="Rwf" 
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Modal> 
            </Form> 
        </Card>
	)
}

export default Penalty