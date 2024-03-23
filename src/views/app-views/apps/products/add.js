import React, { useState } from "react";
import { Form, Steps, Button, Col, Row, Input, InputNumber, Select, message, Modal, Tooltip, Typography, Checkbox } from 'antd';
import { PlusOutlined, WarningOutlined, CloseOutlined } from '@ant-design/icons';
import { DataService as CategoryService} from "services/category.service";
import { DataService as BrandService} from "services/brands.service";

const { Option } = Select;
let pendingCategories = {};
let pendingBrands = {};
const { Step } = Steps;
const { Title } = Typography;
const FormInDrawer = (props) => { 
  
  const [measure] = useState(['pieces','square meters','meters','kilogram','packets','dozen']);
  const [catVisible, setCatVisible] = useState(false);
  const [brandVisible, setBrandVisible] = useState(false);
  const [states, setStates] = useState(0);

  const [form] = Form.useForm();
  const [formBrand] = Form.useForm();
  const [formCategory] = Form.useForm();
  const initialState = {
    productName: "",
    productCode: "",
    productType: "",
    ctnSqm: "0",
    sqmPrice: "0",
    pkgUnit: "",
    qtyPkg: "0",
    pkgStock:"0",
    pcsStock:"0",
    sqmStock:"0",
    pkgPurchasePrice:"0",
    pcsPurchasePrice:"",
    pkgSalePrice:"0",
    pcsSalePrice:"",
    safetyStock: "",
    safetyType: "",
    soldByPiece:"",
    category: "",
    brand: "",
  };

  const [loading, setLoading] = React.useState(true);
  const [employee, setEmployee] = useState(initialState);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [qtyPkgs, setQtyPkg] = useState(0)
  const [ctnSqms, setCtnSqms] = useState(0)
  const [counts, setCounts] = useState(0)
  const [notSold, setNotSold] = useState({})
  const {DataService, AllBrands, AllCategory, bloading, cloading, types, brand, categoriess, showBrand, showCategory, stores, storesLoading, setVisible, brandDisplay, catsDisplay, codeDisplay, nameDisplay, useCode, priceDisplay, purchaseShare, byPiece, setByPiece} = props;

  const next = () => {
    if(states === 0 && (employee.productType === '' || employee.pkgUnit === '' || employee.soldByPiece === '')){
      return;
    }
    const current = states + 1;
    setStates(current);
  }

  const prev = () => {
    const current = states - 1;
    setStates(current);
  }

  const onClose = () => {
    setVisible(false);
    setEmployee(initialState);
        form.setFieldsValue({
          productName:null,
          productCode:null,
          productType:null,
          ctnSqm:null,
          sqmPrice:null,
          pkgUnit:null,
          qtyPkg:null,
          pkgStock:null,
          pcsStock:null,
          sqmStock:null,
          pkgPurchasePrice:null,
          pcsPurchasePrice:null,
          pkgSalePrice:null,
          pcsSalePrice:null,
          safetyStock:null,
          safetyType:null,
          soldByPiece:null,
          category:null,
          brand:null
        })
  };

const handleTypeChange = (value) => {
  setEmployee({ ...employee, productType: value, soldByPiece: value === '0' ? '1' : employee.soldByPiece});
  setByPiece(parseInt(value) > 0);
  if(value === '0'){
    form.setFieldsValue({ctnSqm:'0',sqmPrice:'0',pcsPurchasePrice:null,pcsSalePrice:null,pkgPurchasePrice:null,pkgSalePrice:null});
    setCtnSqms(0);
  }
  else if(value === '5'){
    form.setFieldsValue({ctnSqm:'12',sqmPrice:'',pcsPurchasePrice:null,pcsSalePrice:null,pkgPurchasePrice:null,pkgSalePrice:null});
    setCtnSqms(12)
  }
  else{
    form.setFieldsValue({ctnSqm:null,sqmPrice:null,pcsPurchasePrice:null,pcsSalePrice:null,pkgPurchasePrice:null,pkgSalePrice:null});
    setCtnSqms('')
  }
};

const handlePkgChange = (value) => {
  setEmployee({ ...employee, pkgUnit: value});
  if(value === '0'){
    form.setFieldsValue({pkgStock:'0',pkgPurchasePrice:'0',pkgSalePrice:'0',qtyPkg:'0',safetyType:'0',pcsPurchasePrice:parseInt(employee.soldByPiece)===0?'0':null,pcsSalePrice:parseInt(employee.soldByPiece)===0?'0':null})
  }
  else{
    form.setFieldsValue({pkgStock:'',pkgPurchasePrice:'',pkgSalePrice:'',qtyPkg:'',safetyType:'',pcsPurchasePrice:null,pcsSalePrice:null})
  }
};

const handlesoldByPiece = (value) => {
  setEmployee({ ...employee, soldByPiece: value});
  if(value === '0'){
    form.setFieldsValue({pcsPurchasePrice:'0',pcsSalePrice:'0'})
  }
  else{
    form.setFieldsValue({pcsPurchasePrice:null,pcsSalePrice:null})
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
    const row = await form.validateFields();
    setButtonLoading(true)
    let productCode = (row.productCode && useCode) ? row.productCode + ' ' : '';
    var data = {
      productName: productCode + row.productName,
      productCode,
      productType: row.productType,
      ctnSqm: row.ctnSqm,
      sqmPrice: row.sqmPrice,
      pkgUnit: row.pkgUnit,
      qtyPkg: (parseInt(row.productType) > 3 && row.pkgUnit === '1') ? row.qtyPkg * row.ctnSqm : row.qtyPkg,
      qtyPkgBk: (parseInt(row.productType) > 3 && row.pkgUnit === '1') ? row.qtyPkg * row.ctnSqm : row.qtyPkg,
      pkgStock:row.pkgStock !== undefined ? row.pkgStock : 0,
      pcsStock:row.pcsStock !== undefined ? row.pcsStock : 0,
      sqmStock:row.sqmStock !== undefined ? row.sqmStock : 0,
      pkgPurchasePrice:row.pkgPurchasePrice,
      pcsPurchasePrice:row.pcsPurchasePrice,
      pkgSalePrice:row.pkgSalePrice,
      pcsSalePrice:row.pcsSalePrice,
      safetyStock: row.safetyStock,
      safetyType: row.safetyType,
      soldByPiece: row.soldByPiece,
      category: pendingCategories.id && row.category === pendingCategories.data.name ? pendingCategories.id : (row.category ? row.category : ''),
      backupCategory: pendingCategories.id && row.category === pendingCategories.data.name ? pendingCategories.data.name : !showCategory ? (categoriess[row.category] ? categoriess[row.category].name:'') : '',
      reserved:row.ctnSqm,
      brand: pendingBrands.id && row.brand === pendingBrands.data.name ? pendingBrands.id : (row.brand ? row.brand : ''),
      backupBrand: pendingBrands.id && row.brand === pendingBrands.data.name ? pendingBrands.data.name : !showBrand ? (brand[row.brand] ? brand[row.brand].name : '') : '',
      shopQuantity: 0,
    };
    let inStock = {};
    let usedStore = '';
    !storesLoading && !purchaseShare && stores.docs.map(store => {
      if(notSold[store.id] !== true){
        usedStore = usedStore !== '' ? '**;;@!*.' + store.id : ''+store.id;
        inStock = {
          [`${store.id}sqmStock`]:(employee.productType !== '0' && row[`${store.id}sqmStock`])? row[`${store.id}sqmStock`] : 0,
          [`${store.id}pcsStock`]:row[`${store.id}pcsStock`],
          [`${store.id}`]:true,
          [`${store.id}pkgStock`]:(employee.pkgUnit==='1' && row[`${store.id}pkgStock`])? row[`${store.id}pkgStock`] : 0,
        }
      }
      return true;
    })
    data = {
      ...data,
      ...inStock,
      usedStore,
    }
    DataService.getAll().where("productName", "==", data.productName)
    .get()
    .then(docList => {
      if(docList.docs.length > 0 ){
        message.error(`Product already registered, Verify your data!`);
        setButtonLoading(false)
      }
      else{
        DataService.create(data);
        if(pendingBrands.id){
          BrandService.create(pendingBrands.data,pendingBrands.id)
          pendingBrands = {}
        }
        if(pendingCategories.id){
          CategoryService.create(pendingCategories.data,pendingCategories.id)
          pendingCategories = {}
        }
        setButtonLoading(false)
        setVisible(false);
        message.success(`New Product saved`);
        onClose();
      }
    });
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
    formCategory.setFieldsValue({newCategory:null});
    form.setFieldsValue({category:name});
  } catch (errInfo) {formCategory.setFieldsValue({newCategory:null});}
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
    formBrand.setFieldsValue({newBrand:null});
    form.setFieldsValue({brand:name});
  } catch (errInfo) {formBrand.setFieldsValue({newBrand:null});}
};

const handleCancelCat = () => {
  setCatVisible(false);
  formCategory.setFieldsValue({newCategory:null});
};

const handleCancelBrand = () => {
  setBrandVisible(false);
  form.setFieldsValue({newBrand:null});
};

const salePrice = (value) => {
  value = !value ? 0 : value
  let price = parseInt(qtyPkgs) > 0 ? value*qtyPkgs : value;
  price = parseInt(ctnSqms) > 0 ? price*ctnSqms : price;
  let Sprices = parseInt(ctnSqms) > 0 ? value*ctnSqms : value;
  if(!priceDisplay && parseInt(employee.productType) > 3){
    form.setFieldsValue({pkgSalePrice:price,sqmPrice:Sprices});
  }
  else if(!priceDisplay){
    form.setFieldsValue({pkgSalePrice:price});
  }
}

const purchasePrice = (value) => {
  value = !value ? 0 : value
  let price = parseInt(qtyPkgs) > 0 ? value*qtyPkgs : value;
  price = parseInt(ctnSqms) > 0 ? price*ctnSqms : price;
  if(!priceDisplay){
    form.setFieldsValue({pkgPurchasePrice:price});
  }
}

const changeQtyPkg = (value) => {
  value = !value ? 0 : value
  setQtyPkg(value)
  if(!priceDisplay && parseInt(employee.productType) > 3){
    form.setFieldsValue({pcsPurchasePrice:parseInt(employee.soldByPiece)===0?'0':null,pcsSalePrice:parseInt(employee.soldByPiece)===0?'0':null,pkgPurchasePrice:null,pkgSalePrice:null,sqmPrice:null});
  }
  else if(!priceDisplay){
    form.setFieldsValue({pcsPurchasePrice:parseInt(employee.soldByPiece)===0?'0':null,pcsSalePrice:parseInt(employee.soldByPiece)===0?'0':null,pkgPurchasePrice:null,pkgSalePrice:null});
  }

  if(employee.soldByPiece === '0')
  {
    purchasePrice(0)
    salePrice(0)
  }
}

const changeCtnSqm = (value) => {
  value = !value ? 0 : value
  setCtnSqms(value)
  if(!priceDisplay && parseInt(employee.productType) > 3){
    form.setFieldsValue({pcsPurchasePrice:parseInt(employee.soldByPiece)===0?'0':null,pcsSalePrice:parseInt(employee.soldByPiece)===0?'0':null,pkgPurchasePrice:null,pkgSalePrice:null,sqmPrice:null});
  }
  else if(!priceDisplay){
    form.setFieldsValue({pcsPurchasePrice:parseInt(employee.soldByPiece)===0?'0':null,pcsSalePrice:parseInt(employee.soldByPiece)===0?'0':null,pkgPurchasePrice:null,pkgSalePrice:null});
  }

  if(employee.soldByPiece === '0')
  {
    purchasePrice(0)
    salePrice(0)
  }
}

const toggleQuantity = (store,e) => {
  let data = {...notSold}
  let incr = e.target.checked ? counts+1 : counts-1;
  data[store] = e.target.checked;
  setNotSold(data);
  setCounts(incr);

}

let isMeasure = (parseInt(employee.productType) ? types[employee.productType] : " ") + ((employee.pkgUnit==='1' && employee.productType!=='0')? ' / 1 carton' : (employee.pkgUnit==='0' && employee.productType!=='0') ? ' / 1 Piece' : " ")
isMeasure = parseInt(employee.productType) > 3 ? `Pieces / 1 ${types[employee.productType]}` : isMeasure;
let isPrice = parseInt(employee.productType) ? `Price/1 ${types[employee.productType]}` : " ";
let Ppc = (parseInt(employee.productType) > 3 && employee.pkgUnit==='1')? `${types[employee.productType]} in Carton` : 'Pieces in Carton';

const steps = [
  {
    title: 'Product Details',
    content: <Form layout="vertical" hideRequiredMark form={form}>
                <Row gutter={16} className="mt-4">
                  <Col xs={1} sm={2} md={6}></Col>
                  <Col xs={codeDisplay.xs} sm={codeDisplay.sm} md={codeDisplay.md}>
                      <Form.Item name="productCode" label="Code" rules={[
                          {
                          required: false,
                          message: `code is required.`,
                          },
                      ]}>
                          <Input/>
                      </Form.Item>
                  </Col>
                  <Col xs={nameDisplay.xs} sm={nameDisplay.sm} md={nameDisplay.md}>
                      <Form.Item name="productName" label="Name" rules={[
                          {
                          required: true,
                          message: `name is required.`,
                          },
                      ]}>
                          <Input/>
                      </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={1} sm={2} md={6}></Col>
                  <Col xs={11} sm={10} md={6}>
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
                  <Col xs={11} sm={10} md={6}>
                      <Form.Item name="pkgUnit" label="Packaged in a carton with others?" rules={[
                          {
                          required: true,
                          message: `Information required.`,
                          },
                      ]}>
                          <Select
                              className="w-100"
                              defaultValue={''}
                              onChange={handlePkgChange}
                              >
                                  <Option value="1">Yes, More than one in a carton</Option>
                                  <Option value="0">No</Option>
                          </Select>
                      </Form.Item>
                  </Col>
                </Row>
                {byPiece && (<Row gutter={16}>
                <Col xs={1} sm={1} md={6}></Col>
                  <Col xs={23} sm={23} md={12}>
                    <Form.Item name="soldByPiece" label="Do you sell this product by whole piece or item?" rules={[
                          {
                          required: true,
                          message: `Information required.`,
                          },
                      ]}>
                          <Select
                              className="w-100"
                              defaultValue={''}
                              onChange={handlesoldByPiece}
                              >
                                  <Option value="1">Yes, We can also sell whole piece or item</Option>
                                  <Option value="0">No, We sell it by {measure[employee.productType]} only</Option>
                          </Select>
                      </Form.Item>
                  </Col>
                </Row>)}
                {(catsDisplay || brandDisplay) ? (<Row gutter={16}>
                  <Col xs={1} sm={2} md={6}></Col>
                  {catsDisplay && (
                  <Col xs={brandDisplay?8:16} sm={brandDisplay?8:16} md={brandDisplay?5:10}>
                    <Form.Item
                      name="category"
                      label="Category"
                      rules={[{ required: true, message: 'Please select a category' }]}
                    >
                      <Select placeholder="Select a category"
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
                  </Col>)}
                  {catsDisplay && (
                  <Col xs={brandDisplay?3:6} sm={brandDisplay?2:4} md={brandDisplay?1:2}>
                    <Form.Item label=" ">
                      <Tooltip title="Add new Category">
                        <Button type="primary" shape="circle" icon={<PlusOutlined />} size="small" onClick={showCatModal}/>
                      </Tooltip>
                    </Form.Item>
                  </Col>)}
                  {brandDisplay && (
                  <Col xs={catsDisplay?8:16} sm={catsDisplay?8:16} md={catsDisplay?5:10}>
                  <Form.Item
                      name="brand"
                      label="Brand"
                      rules={[{ required: true, message: 'Please choose Brand' }]}
                    >
                      <Select placeholder="Choose Brand"
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
                  </Col>)}
                  {brandDisplay && (
                  <Col xs={catsDisplay?3:6} sm={catsDisplay?2:4} md={catsDisplay?1:2}>
                  <Form.Item label=" ">
                      <Tooltip title="Add new Brand">
                        <Button type="primary" shape="circle" icon={<PlusOutlined />} size="small"  onClick={showBrandModal}/>
                      </Tooltip>
                    </Form.Item>
                  </Col>)}
                </Row>) : null}
              </Form>
  },
  {
    title: 'Prices',
    content: <Form layout="vertical" hideRequiredMark form={form}>
                <Row gutter={16} className="mt-4">
                  <Col xs={0} sm={6} md={6}></Col>
                  <Col xs={8} sm={4} md={4}>
                      <Form.Item name="qtyPkg" label={Ppc} rules={[
                          {
                          required: true,
                          message: `Pieces in carton is required.`,
                          },
                      ]}>
                          <InputNumber className="w-100" onChange={changeQtyPkg} min={0} disabled={employee.pkgUnit!=='1'}/>
                      </Form.Item>
                  </Col>
                  <Col xs={8} sm={4} md={4}>
                      <Form.Item name="ctnSqm" label={isMeasure} rules={[
                          {
                          required: true,
                          message: `This is required.`,
                          },
                      ]}>
                          <InputNumber className="w-100" onChange={changeCtnSqm} min={0} disabled={!parseInt(employee.productType) || parseInt(employee.productType)===5}/>
                      </Form.Item>
                  </Col>
                  <Col xs={8} sm={4} md={4}>
                      <Form.Item name="sqmPrice" label={isPrice} rules={[
                          {
                          required: true,
                          message: `This is required.`,
                          },
                      ]}>
                          <InputNumber className="w-100" min={0} disabled={(!priceDisplay && parseInt(employee.productType) > 3) || !parseInt(employee.productType)} addonAfter="Rwf" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                      </Form.Item>
                  </Col>
                  </Row>
                {employee.pkgUnit==='1' && (<Row gutter={16}>
                  <Col xs={1} sm={2} md={6}></Col>
                  <Col xs={11} sm={10} md={6}>
                      <Form.Item name="pkgPurchasePrice" label="Carton Purchase Price" rules={[
                          {
                          required: true,
                          message: `This field is required.`,
                          },
                      ]}>
                          <InputNumber className="w-100" min={0} disabled={!priceDisplay} addonAfter="Rwf" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                      </Form.Item>
                  </Col>
                  <Col xs={11} sm={10} md={6}>
                      <Form.Item name="pkgSalePrice" label="Carton Sale Price" rules={[
                          {
                          required: true,
                          message: `This field is required.`,
                          },
                      ]}>
                          <InputNumber className="w-100" min={0} disabled={!priceDisplay} addonAfter="Rwf" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                      </Form.Item>
                  </Col>
                </Row>)}
                {employee.soldByPiece===0 && (<Row gutter={16}>
                  <Col xs={1} sm={2} md={6}></Col>
                  <Col xs={11} sm={10} md={6}>
                    <Form.Item name="pcsPurchasePrice" label="Piece Purchase Price" rules={[
                        {
                        required: true,
                        message: `This field is required.`,
                        },
                    ]}>
                        <InputNumber className="w-100" 
                          onChange={purchasePrice}
                          min={0} 
                          addonAfter="Rwf" 
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                    </Form.Item>
                </Col>
                  <Col xs={11} sm={10} md={6}>
                    <Form.Item name="pcsSalePrice" label="Piece Sale Price" rules={[
                        {
                        required: true,
                        message: `This field is required.`,
                        },
                    ]}>
                        <InputNumber className="w-100" 
                            onChange={salePrice}
                            min={0} 
                            addonAfter="Rwf" 
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                    </Form.Item>
                  </Col>
                </Row>)}
                
              </Form>
  },
  {
    title: 'Stock Quantity',
    content: <Form layout="vertical" hideRequiredMark form={form}>
              {((!storesLoading && stores.docs.length > 0) || purchaseShare) ? (<Row gutter={16} className="mt-4">
                <Col xs={1} sm={2} md={6}></Col>
                <Col xs={22} sm={20} md={12}>
                  <Form.Item label="Safety Stock">
                    <Input.Group compact>
                      <Form.Item
                        name="safetyType"
                        noStyle
                        rules={[{ required: true, message: 'Safety Type is required.' }]}
                      >
                        <Select placeholder="Select type" style={{ width: '50%' }}>
                          {employee.productType === '5' && (<Option value='6' disabled={employee.productType !== '5'}>Dozen</Option>)}
                          {employee.productType === '4' && (<Option value='5' disabled={employee.productType !== '4'}>Packet</Option>)}
                          {employee.productType === '3' && (<Option value='4' disabled={employee.productType !== '3'}>Kilogram</Option>)}
                          {employee.productType === '1' && (<Option value='2' disabled={employee.productType !== '1'}>Square meter</Option>)}
                          {employee.productType === '2' && (<Option value='3' disabled={employee.productType !== '2'}>Meters</Option>)}
                          <Option value="0">Pieces</Option>
                          {employee.pkgUnit === '1' && (<Option value="1" disabled={employee.pkgUnit !=='1'}>Cartons</Option>)}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        name="safetyStock"
                        noStyle
                        rules={[{ required: true, message: 'Safety stock is required' }]}
                      >
                        <InputNumber style={{ width: '50%' }} placeholder="Minimum stock" min={0}/>
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                </Col>
              </Row>) : (!purchaseShare ? (<Row gutter={16} className="mt-4">
                <Col span={24} className="text-center">
                  <Title level={4}>
                    <WarningOutlined className="mr-2"/> 
                    No Stores Found, add a store to continue!
                  </Title>
                </Col>
              </Row>) : null)}
              {(!storesLoading && !purchaseShare)? stores.docs.map(store => (
                <Row gutter={16}>
                {stores.docs.length > 1 ? (<Col span={24} className="text-center">
                  <Title level={4}>
                    Quantity in {store.data().name}
                  </Title>
                </Col>) : 
                (<Col span={24} className="text-center mb-3">
                  <Title level={4}>
                    Store Quantity
                  </Title>
                </Col>)}
                <Col xs={employee.productType ? 0 : 1} sm={employee.productType ? 0 : 2} md={6} className={notSold[store.id] === true ? 'd-none': '' }></Col>
                <Col xs={employee.productType ? 8 : 11} sm={employee.productType ? 8 : 10} md={employee.productType ? 4 : 6} className={notSold[store.id] === true ? 'd-none': '' }>
                  <Form.Item name={`${store.id}sqmStock`} label={measure[employee.productType]} 
                  rules={[
                      {
                      required: notSold[store.id] !== true ? true : false,
                      message: `${measure[employee.productType]} in hand is required.`,
                      },
                  ]}>
                      <InputNumber className="w-100" min={0}/>
                  </Form.Item>
                </Col>
                <Col xs={employee.productType ? 8 : 11} sm={employee.productType ? 8 : 10} md={employee.productType ? 4 : 6} className={notSold[store.id] === true ? 'd-none': '' }>
                  <Form.Item name={`${store.id}pcsStock`} label="Pieces" 
                  rules={[
                      {
                      required: notSold[store.id] !== true ? true : false,
                      message: `Pieces in hand is required.`,
                      },
                  ]}>
                      <InputNumber className="w-100" min={0}/>
                  </Form.Item>
                </Col>
                <Col xs={employee.productType ? 8 : 11} sm={employee.productType ? 8 : 10} md={employee.productType ? 4 : 6} className={notSold[store.id] === true ? 'd-none': '' }>
                  <Form.Item name={`${store.id}pkgStock`} label="Cartons" 
                  rules={[
                      {
                      required: (employee.pkgUnit==='1' && notSold[store.id] !== true) ? true : false,
                      message: `Cartons in hand is required.`,
                      },
                  ]}>
                      <InputNumber className="w-100" min={0} disabled={employee.pkgUnit!=='1'}/>
                  </Form.Item>
                </Col>
                <Col span={24}></Col>
                <Col xs={1} sm={2} md={6}></Col>
                {stores.docs.length > 1 ? 
                    (<Col xs={22} sm={20} md={12} style={{marginTop:'-10px'}} className="mb-3">
                      <Checkbox onChange={checked => toggleQuantity(store.id,checked)}>
                        Not Sold In {store.data().name}
                      </Checkbox>
                    </Col>) 
                : null}
              </Row>
              
              )) : (!purchaseShare ? null : (<Row gutter={16} className="mt-3">
                <Col xs={employee.productType ? 0 : 1} sm={employee.productType ? 0 : 2} md={6}></Col>
                <Col xs={employee.productType ? 8 : 11} sm={employee.productType ? 8 : 10} md={employee.productType ? 4 : 6}>
                  <Form.Item name='sqmStock' label={measure[employee.productType]} 
                  rules={[
                      {
                      required: true,
                      message: `${measure[employee.productType]} in hand is required.`,
                      },
                  ]}>
                      <InputNumber className="w-100" min={0}/>
                  </Form.Item>
                </Col>
                <Col xs={employee.productType ? 8 : 11} sm={employee.productType ? 8 : 10} md={employee.productType ? 4 : 6}>
                  <Form.Item name='pcsStock' label="Pieces in hand" rules={[
                      {
                      required: true,
                      message: `Pieces in hand is required.`,
                      },
                  ]}>
                      <InputNumber className="w-100" min={0}/>
                  </Form.Item>
                </Col>
                <Col xs={employee.productType ? 8 : 11} sm={employee.productType ? 8 : 10} md={employee.productType ? 4 : 6}>
                  <Form.Item name='pkgStock' label="Cartons in hand" rules={[
                      {
                      required: employee.pkgUnit==='1',
                      message: `Cartons in hand is required.`,
                      },
                  ]}>
                      <InputNumber className="w-100" min={0} disabled={employee.pkgUnit!=='1'}/>
                  </Form.Item>
                </Col></Row>))}
            </Form>
  },
];


  return (
    <div className="w-100">
        <Steps current={states} progressDot>
          {steps.map(item => (
            <Step key={item.title} title={item.title}/>
          ))}
        </Steps>
        <div className="steps-content"><Form layout="vertical" hideRequiredMark form={form}>{steps[states].content}</Form></div>
        <div className="steps-action w-100">
        {states === 0 && (
            <Button onClick={onClose}>
              <CloseOutlined className="mr-1"/>Cancel
            </Button>
          )}
          {states > 0 && (
            <Button  onClick={prev}>
              Previous
            </Button>
          )}
          {states < steps.length - 1 && (
            <Button type="primary" className="pull-right float-right" onClick={next}>
              Next
            </Button>
          )}
          {states === steps.length - 1 && (
            <Button type="primary" className="pull-right float-right" 
                  disabled={!purchaseShare && ((!storesLoading && stores.docs.length === 0) 
                  || (stores.docs.length === counts))} 
                  onClick={saveEmployee} loading={buttonLoading}>
              Save
            </Button>
          )}
          
        </div>
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
          <Form layout="vertical" className="d-none" hideRequiredMark form={form}>
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
            <Col xs={6} sm={6} md={6}>
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
            <Col xs={6} sm={6} md={6}>
                <Form.Item name="pkgUnit" label="Packaged in a carton with others?" rules={[
                    {
                    required: true,
                    message: `Package Type is required.`,
                    },
                ]}>
                    <Select
                        className="w-100"
                        defaultValue={''}
                        onChange={handlePkgChange}
                        >
                            <Option value="1">Yes, More than one in a carton</Option>
                            <Option value="0">No</Option>
                    </Select>
                </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={1} sm={1} md={6}></Col>
              <Col xs={23} sm={23} md={12}>
                <Form.Item name="soldByPiece" label="Do you sell this product by whole piece or item?" rules={[
                      {
                      required: true,
                      message: `Information required.`,
                      },
                  ]}>
                      <Select
                          className="w-100"
                          defaultValue={''}
                          onChange={handlesoldByPiece}
                          >
                              <Option value="1">Yes, We can also sell whole piece or item</Option>
                              <Option value="0">No, We sell it by {measure[employee.productType]} only</Option>
                      </Select>
                  </Form.Item>
              </Col>
            </Row>
          <Row gutter={16}>
            <Col span={10}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: catsDisplay, message: 'Please select a category' }]}
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
                rules={[{ required: catsDisplay, message: 'Please choose Brand' }]}
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
            <Col xs={4} sm={4} md={4}>
                <Form.Item name="pkgStock" label="Cartons in hand" rules={[
                    {
                    required: employee.pkgUnit==='1' && purchaseShare,
                    message: `Cartons in hand is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0} disabled={employee.pkgUnit!=='1'}/>
                </Form.Item>
            </Col>
            <Col xs={4} sm={4} md={4}>
                <Form.Item name="pkgPurchasePrice" label="Carton Cost Price" rules={[
                    {
                    required: true,
                    message: `This field is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0} disabled={employee.pkgUnit!=='1'} addonAfter="Rwf" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                </Form.Item>
            </Col>
            <Col xs={4} sm={4} md={4}>
                <Form.Item name="pkgSalePrice" label="Carton Sale Price" rules={[
                    {
                    required: true,
                    message: `This field is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0} disabled={employee.pkgUnit!=='1'} addonAfter="Rwf" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                </Form.Item>
            </Col>
            <Col xs={4} sm={4} md={4}>
                <Form.Item name="qtyPkg" label={Ppc} rules={[
                    {
                    required: true,
                    message: `Pieces in carton is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0} disabled={employee.pkgUnit!=='1'}/>
                </Form.Item>
            </Col>
            <Col xs={4} sm={4} md={4}>
                <Form.Item name="ctnSqm" label={isMeasure} rules={[
                    {
                    required: true,
                    message: `This is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0} disabled={!parseInt(employee.productType) || parseInt(employee.productType)===5}/>
                </Form.Item>
            </Col>
            <Col xs={4} sm={4} md={4}>
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
            <Col xs={4} sm={4} md={4}>
                <Form.Item name="pcsStock" label="Pieces in hand" rules={[
                    {
                    required: purchaseShare,
                    message: `Pieces in hand is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0}/>
                </Form.Item>
            </Col>
            <Col xs={4} sm={4} md={4}>
                <Form.Item name="pcsPurchasePrice" label="Piece Cost Price" rules={[
                    {
                    required: true,
                    message: `This field is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0} addonAfter="Rwf" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                </Form.Item>
            </Col>
            <Col xs={4} sm={4} md={4}>
                <Form.Item name="pcsSalePrice" label="Piece Sale Price" rules={[
                    {
                    required: true,
                    message: `This field is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0} addonAfter="Rwf" formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/>
                </Form.Item>
            </Col>
            <Col xs={6} sm={6} md={6}>
                <Form.Item name="safetyStock" label="Safety stock" rules={[
                    {
                    required: true,
                    message: `Safety stock is required.`,
                    },
                ]}>
                    <InputNumber className="w-100" min={0}/>
                </Form.Item>
            </Col>
            <Col xs={6} sm={6} md={6}>
                <Form.Item name="safetyType" label="Of" rules={[
                    {
                    required: true,
                    message: `Safety Type is required.`,
                    },
                ]}>
                    <Select
                        className="w-100"
                        >
                          <Option value='6' disabled={employee.productType !== '5'}>Dozen</Option>
                          <Option value='5' disabled={employee.productType !== '4'}>Packet</Option>
                          <Option value='4' disabled={employee.productType !== '3'}>Kilogram</Option>
                          <Option value='2' disabled={employee.productType !== '1'}>Square meter</Option>
                          <Option value='3' disabled={employee.productType !== '2'}>Meters</Option>
                          <Option value="0">Pieces</Option>
                          <Option value="1" disabled={employee.pkgUnit!=='1'}>Cartons</Option>
                    </Select>
                </Form.Item>
            </Col>
          </Row>
        </Form>
        
      </div>  
  );
  
}

export default FormInDrawer;
