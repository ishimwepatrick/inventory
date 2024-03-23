import React, { useState } from 'react'
import { InputNumber, Form, Modal, message, Row, Col, Card } from 'antd';
import { DataService } from "services/settings.service";
import { sysData } from './sysData';
import NumberFormat from 'react-number-format';


const Data = ({systemData}) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const [editingType, setEditingType] = useState('');
  const {setting, setsLoading} = systemData;


  const edit = record => {
    setEditingKey(record.key);
    setEditingType(record.type);
    setEditingTitle(record.title);
    form.setFieldsValue( (!setsLoading && setting[record.key]) ? 
                          {value:record.value}
                          : {value:null}
                        );
    setVisible(true);
  };

  const handleOk = async e => {
    try {
      const values = await form.validateFields();
      let value = values.value;
      if (value==='') return;
      setConfirmLoading(true);
      let sysDatas = { value }
      DataService.create(sysDatas,editingKey)
      setVisible(false);
      setConfirmLoading(false);
      form.setFieldsValue({value:null});
      message.success(`${editingTitle} set successfully`)
    } catch (errInfo) {}
    
  }
  const handleCancel = () => {
    setVisible(false);
    setEditingKey('');
    setEditingType('');
    setEditingTitle('');
    form.setFieldsValue({value:null});
  }

	return (
		<Row gutter={16}>
      {sysData.map(elm => (
        <Col xs={24} sm={24} md={8} key={elm.key}>
          <Card 
            hoverable 
            onClick={() => {
              edit(elm)
            }}>
            <div className="text-center">
              <h3>{(!setsLoading && setting[elm.key])? 
                    (
                      elm.type === 1 ?
                        (<NumberFormat displayType={'text'} 
                            value={setting[elm.key].value} suffix=" Rwf" 
                            thousandSeparator={true}/>) 
                        : parseInt(setting[elm.key].value) > 0 ? (`${setting[elm.key].value} Minute` + (setting[elm.key].value > 1 ? 's' : '')) : 'Disabled'
                    )
                      : '-'
                  }
              </h3>
              <h5 className="mt-4">{elm.title}</h5>
            </div>
          </Card>
        </Col>
      ))}
      <Form form={form} component={false} layout="vertical">
        <Modal
          title={editingTitle}
          visible={visible}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24}>
            {editingType === 1 && (<Form.Item name="value" label="Value" rules={[
                {
                  required: true,
                  message: `This field is required.`,
                },
              ]}>
                <InputNumber
                  className="w-100"
                  min={0}
                  parser={data => data.replace(/\$\s?|(,*)/g, '')}
                  addonAfter="Rwf" 
                  formatter={data => `${data}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>)}
              {editingType === 2 && (<Form.Item name="value" label="Value" rules={[
                {
                  required: true,
                  message: `This field is required.`,
                },
              ]}>
                <InputNumber
                  className="w-100"
                  placeholder="Enter Minutes"
                  min={0}
                  max={100}
                />
              </Form.Item>)}
            </Col>
          </Row>
        </Modal> 
      </Form>
    </Row>
	)
}

export default Data;