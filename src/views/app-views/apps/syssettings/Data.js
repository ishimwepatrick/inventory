import React, { useState } from 'react'
import moment from "moment";
import { DatePicker, InputNumber, Form, Modal, message, Row, Col, Card } from 'antd';
import { DataService } from "services/settings.service";
import { sysData } from './sysData';
import NumberFormat from 'react-number-format';

const { MonthPicker } = DatePicker;

const Data = ({systemData}) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const [editingType, setEditingType] = useState('');
  const {settings, settingsLoading} = systemData;
  const [setting, setSetting] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  function disabledDate(current) {
    return current && current > moment().endOf("day");
  }

  if(!settingsLoading){
	  let allRecords = [];
    let lastSetting = '';
	  settings.docs.map((doc) => {
      allRecords = {
        ...allRecords,
        [doc.data()._id] : {'value': doc.data().value},
      }
      lastSetting = doc.data()._id;
      return true;
	  })
    if(lastSetting && (showLoading || !setting[lastSetting])){
      setSetting(allRecords)
	  	setShowLoading(false);
	  }
	}

  const edit = record => {
    setEditingKey(record.key);
    setEditingType(record.type);
    setEditingTitle(record.title);
    form.setFieldsValue( (!showLoading && setting[record.key]) ? 
                          (record.type !== 2 ? {value:record.value} : {date:moment(`${new Date(setting[record.key].value).getFullYear()}/${((new Date(setting[record.key].value).getMonth())+1) < 10 ? '0' : ''}${(new Date(setting[record.key].value).getMonth())+1}`, 'YYYY/MM'),})
                          : {value:null, date:null}
                        );
    setVisible(true);
  };

  const handleOk = async e => {
    try {
      const values = await form.validateFields();
      let value = editingType !== 2 ? values.value : 
      new Date(new Date(values.date.format('YYYY-MM-DD')).setDate(1)).setHours(0,0,0,0)
      if (value==='' || value===0) return;
      setConfirmLoading(true);
      let sysDatas = { value }
      DataService.create(sysDatas,editingKey)
      setVisible(false);
      setConfirmLoading(false);
      form.setFieldsValue({value:null, date:null});
      message.success(`${editingTitle} set successfully`)
    } catch (errInfo) {}
    
  }
  const handleCancel = () => {
    setVisible(false);
    setEditingKey('');
    setEditingType('');
    setEditingTitle('');
    form.setFieldsValue({value:null, date:null});
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
              <h3>{(!showLoading && setting[elm.key])? 
                    (
                      elm.type === 1 ?
                        (<NumberFormat displayType={'text'} 
                            value={setting[elm.key].value} suffix=" Rwf" 
                            thousandSeparator={true}/>) 
                        :
                      elm.type === 3 ?
                        (<NumberFormat displayType={'text'} 
                            value={setting[elm.key].value} suffix="%" 
                            thousandSeparator={true}/>) 
                        : `${new Date(setting[elm.key].value).getFullYear()}-${((new Date(setting[elm.key].value).getMonth())+1) < 10 ? '0' : ''}${(new Date(setting[elm.key].value).getMonth())+1}`
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
              {editingType === 3 && (<Form.Item name="value" label="Value" rules={[
                {
                  required: true,
                  message: `This field is required.`,
                },
              ]}>
                <InputNumber
                  className="w-100"
                  min={0}
                  max={100}
                  formatter={data => `${data}%`}
                  parser={data => data.replace('%', '')}
                />
              </Form.Item>)}
              {editingType === 2 && (<Form.Item name="date" label="Date" rules={[
                {
                  required: true,
                  message: `Starting date is required.`,
                },
              ]}>
                <MonthPicker className="w-100" placeholder="Select Month" disabledDate={disabledDate}/>
              </Form.Item>)}
            </Col>
          </Row>
        </Modal> 
      </Form>
    </Row>
	)
}

export default Data;