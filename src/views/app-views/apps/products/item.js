import React, { useState } from "react";
import { Drawer, Form, Button, Col, Row, Input, InputNumber, Select, message, Modal, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DataService as CategoryService} from "services/category.service";
import { DataService as BrandService} from "services/brands.service";

const { Option } = Select;
let pendingBrands = {};
let pendingCategories = {};

const FormInDrawer = (props) => { 
  const { data, visible, close} = props;
  const [loading, setLoading] = useState(true);
  const initialState = {productType: "", pkgUnit: "",};
  const [employee, setEmployee] = useState(initialState);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [catVisible, setCatVisible] = useState(false);
  const [brandVisible, setBrandVisible] = useState(false);
  const {DataService, AllBrands, AllCategory, bloading, cloading, types, setting, setsLoading} = props;
  const [form] = Form.useForm();
  const [rules, setRules] = useState(false);
  const [useCode, setUseCode] = useState(false);
  const [codeDisplay, setCodeDisplay] = useState({xs:0,sm:0,md:0})
  const [nameDisplay, setNameDisplay] = useState({xs:22,sm:20,md:12})
  const [catsDisplay, setCatsDisplay] = useState(false);
  const [priceDisplay, setPriceDisplay] = useState(false)
  const [purchaseShare, setPurchaseShare] = useState(false)
  const [formBrand] = Form.useForm();
  const [formCategory] = Form.useForm();
  const showDrawer = () => {
    form.setFieldsValue({
      productName:(data && data.productCode) ? data?.productName.split(data.productCode)[1] : data?.productName,
      productCode:data?.productCode,
      productType:data?.productType,
      ctnSqm:data?.reserved,
      sqmPrice:data?.sqmPrice,
      pkgUnit:data?.pkgUnit,
      qtyPkg: (parseInt(data?.productType) > 3 && data?.pkgUnit === '1') ? data?.qtyPkg / data?.reserved : data?.qtyPkg,
      pkgStock:data?.pkgStock,
      pcsStock:data?.pcsStock,
      pkgPurchasePrice:data?.pkgPurchasePrice,
      pcsPurchasePrice:data?.pcsPurchasePrice,
      pkgSalePrice:data?.pkgSalePrice,
      pcsSalePrice:data?.pcsSalePrice,
      safetyStock:data?.safetyStock,
      safetyType:data?.safetyType,
      category:data?.category,
      brand:data?.brand
    })
  };

  const onClose = () => {
    close();
    setEmployee(initialState);
        form.setFieldsValue({
          productName:'',
          productCode:'',
          productType:'',
          ctnSqm:'',
          sqmPrice:'',
          pkgUnit:'',
          qtyPkg:'',
          pkgStock:'',
          pcsStock:'',
          pkgPurchasePrice:'',
          pcsPurchasePrice:'',
          pkgSalePrice:'',
          pcsSalePrice:'',
          safetyStock:'',
          safetyType:'',
          category:'',
          brand:''
        })
  };


const handleTypeChange = (value) => {
  setEmployee({ ...employee, productType: value });
  if(value === '0'){
    form.setFieldsValue({ctnSqm:'0',sqmPrice:'0'});
  }
  else{
    form.setFieldsValue({ctnSqm:'',sqmPrice:''});
  }
};

const handlePkgChange = (value) => {
  setEmployee({ ...employee, pkgUnit: value});
  if(value === '0'){
    form.setFieldsValue({pkgStock:'0',pkgPurchasePrice:'0',pkgSalePrice:'0',qtyPkg:'0',safetyType:'0'})
  }
  else{
    form.setFieldsValue({pkgStock:'',pkgPurchasePrice:'',pkgSalePrice:'',qtyPkg:'',safetyType:''})
  }
};
let allBrands = [];
let allCategories = [];
if(!bloading && !cloading){
  let allBrand = [];
  let allCategory = [];
  AllCategory.docs.map((doc, index) => {    
    return allCategory = [
      ...allCategory,
      {label: doc.data().name, value: doc.id, index:index},
    ]
  })
  AllBrands.docs.map((doc, index) => {    
    return allBrand = [
      ...allBrand,
      {label: doc.data().name, value: doc.id, index:index},
    ]
  })
  allBrands = allBrand;
  allCategories = allCategory;
  if(loading){
  setLoading(false);
  }
}
const saveEmployee = async () => {
  try {
    setButtonLoading(true)
    const row = await form.validateFields();
    let productCode = (row.productCode && useCode) ? row.productCode + ' ' : '';
    var datas = {
      productName: productCode + row.productName,
      productCode,
      productType: row.productType,
      ctnSqm: row.ctnSqm,
      sqmPrice: row.sqmPrice,
      pkgUnit: row.pkgUnit,
      qtyPkg: (parseInt(row.productType) > 3 && row.pkgUnit === '1') ? row.qtyPkg * row.ctnSqm : row.qtyPkg,
      pkgStock:row.pkgStock,
      pcsStock:row.pcsStock,
      pkgPurchasePrice:row.pkgPurchasePrice,
      pcsPurchasePrice:row.pcsPurchasePrice,
      pkgSalePrice:row.pkgSalePrice,
      pcsSalePrice:row.pcsSalePrice,
      safetyStock: row.safetyStock,
      safetyType: row.safetyType,
      category: pendingCategories.id && row.category === pendingCategories.data.name ? pendingCategories.id : row.category,
      reserved:row.ctnSqm,
      brand: pendingBrands.id && row.brand === pendingBrands.data.name ? pendingBrands.id : row.brand,
      shopQuantity: 0,
    };
    
      DataService.update(data?._id, datas);
      if(pendingBrands.id){
        BrandService.create(pendingBrands.data,pendingBrands.id)
        pendingBrands = {}
      }
      if(pendingCategories.id){
        CategoryService.create(pendingCategories.data,pendingCategories.id)
        pendingCategories = {}
      }
      setButtonLoading(false)
      close();
      message.success(`Product updated`);
      onClose();
      
  } catch (errInfo) {}

  
};

const showCatModal = () => {
  setCatVisible(true);
}; 

const showBrandModal = () => {
  setBrandVisible(true);
};

const handleOkCat = async e => {
  try {
    const values = await formCategory.validateFields();
    let name = values.newCategory.slice(0,1) === ' ' ? values.newCategory.slice(1) : values.newCategory;
    if (name==='') return;
    let categoryData = { name }
    let id = ''+(new Date().getTime());
    allCategories.push({label:name,value:id,index:allCategories.length});
    pendingCategories = {data:categoryData, id};
    setCatVisible(false);
    formCategory.setFieldsValue({newCategory:' '});
    form.setFieldsValue({category:name});
  } catch (errInfo) {formCategory.setFieldsValue({newCategory:' '});}
  
};

const handleOkBrand = async e => {
  try {
    const values = await formBrand.validateFields();
    let name = values.newBrand.slice(0,1) === ' ' ? values.newBrand.slice(1) : values.newBrand;
    if (name==='') return;
    let brandData = { name }
    let id = ''+(new Date().getTime());
    allBrands.push({label:name,value:id,index:allBrands.length});
    pendingBrands = {data:brandData, id};
    setBrandVisible(false);
    formBrand.setFieldsValue({newBrand:' '});
    form.setFieldsValue({brand:name});
  } catch (errInfo) {formBrand.setFieldsValue({newBrand:' '});}
  
};

const handleCancelCat = () => {
  setCatVisible(false);
  formCategory.setFieldsValue({newCategory:' '});
};

const handleCancelBrand = () => {
  setBrandVisible(false);
  form.setFieldsValue({newBrand:' '});
};

if(!rules){ 
  if(!setsLoading){
    if(setting['product_code'] && setting['product_code'].value){
      setCodeDisplay({xs:11,sm:10,md:6})
      setNameDisplay({xs:11,sm:10,md:6})
      setUseCode(true);
    }
    if(setting['tags'] && setting['tags'].value){
      setCatsDisplay(true)
    }
    if(setting['prices'] && setting['prices'].value === 2){
      setPriceDisplay(true)
    }
    if(setting['purchases'] && setting['purchases'].value === 2){
      setPurchaseShare(true)
    }
    setRules(true)
  }
}

let isMeasure = (parseInt(employee.productType) ? types[employee.productType] : " ") + ((employee.pkgUnit==='1' && employee.productType!=='0')? ' / 1 carton' : (employee.pkgUnit==='0' && employee.productType!=='0') ? ' / 1 Piece' : " ")
isMeasure = parseInt(employee.productType) > 3 ? `Pieces / 1 ${types[employee.productType]}` : isMeasure;
let isPrice = parseInt(employee.productType) ? `Price/1 ${types[employee.productType]}` : " ";
let Ppc = (parseInt(employee.productType) > 3 && employee.pkgUnit==='1')? `${types[employee.productType]} in Carton` : 'Pieces in Carton';
if(visible && employee.productType==='' && employee.pkgUnit===''){
  showDrawer();
  setEmployee({ productType:data.productType, pkgUnit: data.pkgUnit });
}
  return (
    <div>
      <Drawer
        title="New Product"
        width={950}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button
              onClick={onClose}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button onClick={saveEmployee} loading={buttonLoading} type="primary">
              Update product
            </Button>
          </div>
        }
      >
        <Form layout="vertical" hideRequiredMark form={form}>
          <Row gutter={16}>
          <Col span={0}>
                <Form.Item name="productCode" label="Code" rules={[
                    {
                    required: false,
                    message: `code is required.`,
                    },
                ]}>
                    <Input/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name="productName" label="Name" rules={[
                    {
                    required: true,
                    message: `name is required.`,
                    },
                ]}>
                    <Input/>
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item name="productType" label="Measure" rules={[
                    {
                    required: true,
                    message: `measure is required.`,
                    },
                ]}>
                    <Select
                        className="w-100"
                        onChange={handleTypeChange}
                        >
                            <Option value="5">Dozen</Option>
                            <Option value="3">Kilogram</Option>
                            <Option value="2">Meters</Option>
                            <Option value="4">Packet</Option>
                            <Option value="1">Square Meters</Option>
                            <Option value="0">Pieces Only</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item name="pkgUnit" label="Package Type" rules={[
                    {
                    required: true,
                    message: `Package Type is required.`,
                    },
                ]}>
                    <Select
                        className="w-100"
                        onChange={handlePkgChange}
                        >
                            <Option value="0">None</Option>
                            <Option value="1">Cartons</Option>
                    </Select>
                </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={10}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Select placeholder="Please select a category"
                showSearch
								optionFilterProp="children"
								filterOption={(input, option) =>
								option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
								}>
                  {allCategories.map(({ label, index, value}) => (
                    <Option key={index} value={value}>
                      {label}
                      </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item label=" ">
                <Tooltip title="Add new Category">
                  <Button type="primary" shape="circle" icon={<PlusOutlined />} size="small" onClick={showCatModal}/>
                </Tooltip>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name="brand"
                label="Brand"
                rules={[{ required: true, message: 'Please choose Brand' }]}
              >
                <Select placeholder="Please choose Brand"
                showSearch
								optionFilterProp="children"
								filterOption={(input, option) =>
								option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
								}>
                  {allBrands.map(({ label, index, value}) => (
                    <Option key={index} value={value}>
                      {label}
                      </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item label=" ">
                <Tooltip title="Add new Brand">
                  <Button type="primary" shape="circle" icon={<PlusOutlined />} size="small"  onClick={showBrandModal}/>
                </Tooltip>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={4}>
                <Form.Item name="pkgStock" label="Cartons in hand" rules={[
                    {
                    required: true,
                    message: `Cartons in hand is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0} disabled={employee.pkgUnit!=='1'}/>
                </Form.Item>
            </Col>
            <Col span={4}>
                <Form.Item name="pkgPurchasePrice" label="Carton Cost Price" rules={[
                    {
                    required: true,
                    message: `This field is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0} disabled={employee.pkgUnit!=='1'} addonAfter="Rwf" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                </Form.Item>
            </Col>
            <Col span={4}>
                <Form.Item name="pkgSalePrice" label="Carton Sale Price" rules={[
                    {
                    required: true,
                    message: `This field is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0} disabled={employee.pkgUnit!=='1'} addonAfter="Rwf" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                </Form.Item>
            </Col>
            <Col span={4}>
                <Form.Item name="qtyPkg" label={Ppc} rules={[
                    {
                    required: true,
                    message: `Pieces in carton is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0} disabled={employee.pkgUnit!=='1'}/>
                </Form.Item>
            </Col>
            <Col span={4}>
                <Form.Item name="ctnSqm" label={isMeasure} rules={[
                    {
                    required: true,
                    message: `This is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0} disabled={!parseInt(employee.productType)}/>
                </Form.Item>
            </Col>
            <Col span={4}>
                <Form.Item name="sqmPrice" label={isPrice} rules={[
                    {
                    required: true,
                    message: `This is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0} disabled={!parseInt(employee.productType)} addonAfter="Rwf" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={4}>
                <Form.Item name="pcsStock" label="Pieces in hand" rules={[
                    {
                    required: true,
                    message: `Pieces in hand is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0}/>
                </Form.Item>
            </Col>
            <Col span={4}>
                <Form.Item name="pcsPurchasePrice" label="Piece Cost Price" rules={[
                    {
                    required: true,
                    message: `This field is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0} addonAfter="Rwf" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                </Form.Item>
            </Col>
            <Col span={4}>
                <Form.Item name="pcsSalePrice" label="Piece Sale Price" rules={[
                    {
                    required: true,
                    message: `This field is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0} addonAfter="Rwf" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item name="safetyStock" label="Safety stock" rules={[
                    {
                    required: true,
                    message: `Safety stock is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0}/>
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item name="safetyType" label="Of" rules={[
                    {
                    required: true,
                    message: `Safety Type is required.`,
                    },
                ]}>
                    <Select
                        className="w-100"
                        >
                            <Option value="0">Pieces</Option>
                            <Option value="1" disabled={employee.pkgUnit!=='1'}>Cartons</Option>
                    </Select>
                </Form.Item>
            </Col>
          </Row>
        </Form>
        <Modal
            title="New Category"
            visible={catVisible}
            onOk={handleOkCat}
            onCancel={handleCancelCat}
          >
            <Form layout="vertical" hideRequiredMark form={formCategory}>
            <Form.Item
              style={{
                margin: 0,
              }}
              name='newCategory'
              rules={[
                {
                  required: true,
                  message: `Category name is required.`,
                },
              ]}
            >
              <Input onPressEnter={handleOkCat}/>
            </Form.Item>
            </Form>
          </Modal>        
        <Modal
            title="New Brand"
            visible={brandVisible}
            onOk={handleOkBrand}
            onCancel={handleCancelBrand}
          >
            <Form layout="vertical" hideRequiredMark form={formBrand}>
              <Form.Item
                style={{
                  margin: 0,
                }}
                name='newBrand'
                rules={[
                  {
                    required: true,
                    message: `brand name is required.`,
                  },
                ]}
              >
                <Input onPressEnter={handleOkBrand}/>
              </Form.Item>
            </Form>
          </Modal>
      </Drawer>
    </div>
  );
  
}

export default FormInDrawer;
