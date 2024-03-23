import { db as fire } from 'auth/FirebaseAuth';
import DB from './db';

const db = fire.collection("/purchases");
const offlineDB = new DB('purchases');
let purchaseId = '';
let purchasedate = '';
let purchasedebt = '';
let purchasecomment = '';
let purchaseproducts = '';
let purchasepaid = '';
let purchaserefunded = '';
let purchasepayCounter = '';
let purchaseuserId  = '';
let purchaseamount = '';
let purchasebackupUser = '';
let purchasesupplierName = '';
let purchasesupplierNumber = '';
let purchaseChange = '';
const getAll = () => {
  return db;
};

const create = (data,id) => {
  id = ''+id;
  data['_id'] = id;
  offlineDB.create(data);
  return db.doc(id).set(data);
};

const save = (change) => {
  if(purchaseId === change.doc.data()._id &&
  purchasedate === change.doc.data().date &&
  purchasedebt === change.doc.data().debt &&
  purchasecomment === change.doc.data().comment &&
  purchaseproducts === change.doc.data().products &&
  purchasepaid === change.doc.data().paid &&
  purchaserefunded === change.doc.data().refunded &&
  purchasepayCounter === change.doc.data().payCounter &&
  purchaseuserId  === change.doc.data().userId  &&
  purchaseamount === change.doc.data().amount &&
  purchasebackupUser === change.doc.data().backupUser &&
  purchasesupplierName === change.doc.data().supplierName &&
  purchasesupplierNumber === change.doc.data().supplierNumber &&
  purchaseChange === change.type) return;
  purchaseId = change.doc.data()._id;
  purchasedate = change.doc.data().date;
  purchasedebt = change.doc.data().debt;
  purchasecomment = change.doc.data().comment;
  purchaseproducts = change.doc.data().products;
  purchasepaid = change.doc.data().paid;
  purchaserefunded = change.doc.data().refunded;
  purchasepayCounter = change.doc.data().payCounter;
  purchaseuserId  = change.doc.data().userId ;
  purchaseamount = change.doc.data().amount;
  purchasebackupUser = change.doc.data().backupUser;
  purchasesupplierName = change.doc.data().supplierName;
  purchasesupplierNumber = change.doc.data().supplierNumber;
  purchaseChange = change.type;
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