import { db as fire } from 'auth/FirebaseAuth';
import DB from './db';

const db = fire.collection("/products_record");
const offlineDB = new DB('products_record');
let sourceId = '';
let sourcedate = '';
let sourceproduct  = '';
let sourcecostPrice  = '';
let sourcesellPrice   = '';
let sourcetotal  = '';
let sourcequantity  = '';
let sourcepkgUnit  = '';
let sourcectnSqm  = '';
let sourceqtyPkg  = '';
let sourceproductType  = '';
let sourcepurchasedType  = '';
let sourceproductName  = '';
let sourceuserId  = '';
let sourcesaleId = '';
let sourcepurchase = '';
let sourcesales = '';
let sourcemove = '';
let sourcedamaged = '';
let sourcerefunded = '';
let sourcesource = '';
let sourcebackupSource = '';
let sourcebackupLocation = '';
let sourcebackupUser = '';
let sourceChange = '';
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
  if(sourceId === change.doc.data()._id &&
  sourcedate === change.doc.data().date &&
  sourceproduct  === change.doc.data().product  &&
  sourcecostPrice  === change.doc.data().costPrice  &&
  sourcesellPrice   === change.doc.data().sellPrice   &&
  sourcetotal  === change.doc.data().total  &&
  sourcequantity  === change.doc.data().quantity  &&
  sourcepkgUnit  === change.doc.data().pkgUnit  &&
  sourcectnSqm  === change.doc.data().ctnSqm  &&
  sourceqtyPkg  === change.doc.data().qtyPkg  &&
  sourceproductType  === change.doc.data().productType  &&
  sourcepurchasedType  === change.doc.data().purchasedType  &&
  sourceproductName  === change.doc.data().productName  &&
  sourceuserId  === change.doc.data().userId  &&
  sourcesaleId === change.doc.data().saleId &&
  sourcepurchase === change.doc.data().purchase &&
  sourcesales === change.doc.data().sales &&
  sourcemove === change.doc.data().move &&
  sourcedamaged === change.doc.data().damaged &&
  sourcerefunded === change.doc.data().refunded &&
  sourcesource === change.doc.data().source &&
  sourcebackupSource === change.doc.data().backupSource &&
  sourcebackupLocation === change.doc.data().backupLocation &&
  sourcebackupUser === change.doc.data().backupUser &&
  sourceChange === change.type) return;

    sourceId = change.doc.data()._Id;
    sourcedate = change.doc.data().date;
    sourceproduct  = change.doc.data().product ;
    sourcecostPrice  = change.doc.data().costPrice ;
    sourcesellPrice   = change.doc.data().sellPrice  ;
    sourcetotal  = change.doc.data().total ;
    sourcequantity  = change.doc.data().quantity ;
    sourcepkgUnit  = change.doc.data().pkgUnit ;
    sourcectnSqm  = change.doc.data().ctnSqm ;
    sourceqtyPkg  = change.doc.data().qtyPkg ;
    sourceproductType  = change.doc.data().productType ;
    sourcepurchasedType  = change.doc.data().purchasedType ;
    sourceproductName  = change.doc.data().productName ;
    sourceuserId  = change.doc.data().userId ;
    sourcesaleId = change.doc.data().saleId;
    sourcepurchase = change.doc.data().purchase;
    sourcesales = change.doc.data().sales;
    sourcemove = change.doc.data().move;
    sourcedamaged = change.doc.data().damaged;
    sourcerefunded = change.doc.data().refunded;
    sourcesource = change.doc.data().source;
    sourcebackupSource = change.doc.data().backupSource;
    sourcebackupLocation = change.doc.data().backupLocation;
    sourcebackupUser = change.doc.data().backupUser;
    sourceChange = change.type;

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