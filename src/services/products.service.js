import { db as fire } from 'auth/FirebaseAuth';
import DB from './db';

const db = fire.collection("/products");
const offlineDB = new DB('products');
let productId = '';
let productproductName = '';
let productproductCode = '';
let productproductType = '';
let productctnSqm  = '';
let productsqmPrice  = '';
let productpkgUnit = '';
let productqtyPkg  = '';
let productpkgStock = '';
let productpcsStoc = '';
let productpkgPurchasePrice = '';
let productpcsPurchasePric = '';
let productpkgSalePrice = '';
let productpcsSalePric = '';
let productsafetyStock = '';
let productsafetyType = '';
let productcategory = '';
let productbrand = '';
let productChange = '';
const getAll = () => {
  return db;
};

const create = (data) => {
  let id = ''+new Date().getTime();
  data['_id'] = id;
  offlineDB.create(data);
  return db.doc(id).set(data);
};

const save = (change) => {
  if(productId === change.doc.data()._id && 
      productproductName === change.doc.data().productName&&
      productproductCode === change.doc.data().productCode&&
      productproductType === change.doc.data().productType&&
      productctnSqm  === change.doc.data().ctnSqm &&
      productsqmPrice  === change.doc.data().sqmPrice &&
      productpkgUnit === change.doc.data().pkgUnit&&
      productqtyPkg  === change.doc.data().qtyPkg &&
      productpkgStock === change.doc.data().pkgStock&&
      productpcsStoc === change.doc.data().pcsStoc&&
      productpkgPurchasePrice === change.doc.data().pkgPurchasePrice&&
      productpcsPurchasePric === change.doc.data().pcsPurchasePric&&
      productpkgSalePrice === change.doc.data().pkgSalePrice&&
      productpcsSalePric === change.doc.data().pcsSalePric&&
      productsafetyStock === change.doc.data().safetyStock&&
      productsafetyType === change.doc.data().safetyType&&
      productcategory === change.doc.data().category&&
      productbrand === change.doc.data().brand &&
      productChange === change.type) return;
    
    productId = change.doc.data()._id;
    productproductName = change.doc.data().productName;
    productproductCode = change.doc.data().productCode;
    productproductType = change.doc.data().productType;
    productctnSqm  = change.doc.data().ctnSqm ;
    productsqmPrice  = change.doc.data().sqmPrice ;
    productpkgUnit = change.doc.data().pkgUnit;
    productqtyPkg  = change.doc.data().qtyPkg ;
    productpkgStock = change.doc.data().pkgStock;
    productpcsStoc = change.doc.data().pcsStoc;
    productpkgPurchasePrice = change.doc.data().pkgPurchasePrice;
    productpcsPurchasePric = change.doc.data().pcsPurchasePric;
    productpkgSalePrice = change.doc.data().pkgSalePrice;
    productpcsSalePric = change.doc.data().pcsSalePric;
    productsafetyStock = change.doc.data().safetyStock;
    productsafetyType = change.doc.data().safetyType;
    productcategory = change.doc.data().category;
    productbrand = change.doc.data().brand;
    productChange = change.type;
  if (change.type === 'added') {
    offlineDB.create(change.doc.data()).catch(()=>{});;
  }
  if (change.type === 'modified') {
    offlineDB.update(change.doc.data()._id,change.doc.data()).catch(()=>{});
  }
  if (change.type === 'removed') {
    offlineDB.delete(change.doc.data()._id).catch(()=>{});
  }
};

const update = (id, value) => {
  offlineDB.update(id,value).catch(()=>{});
  return db.doc(id).update(value);
};

const remove = (id) => {
  offlineDB.delete(id).catch(()=>{});
  return db.doc(id).delete();
};

const getRow = (id) => {
  return db.doc(id).get();
};

export const DataService = {
  getAll,
  getRow,
  create,
  save,
  update,
  remove
};