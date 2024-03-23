import { db as fire } from 'auth/FirebaseAuth';
import DB from './db';

const db = fire.collection("/sales");
const offlineDB = new DB('sales');
let salesId = '';
let salesdate = '';
let salesdebt = '';
let salescomment = '';
let salesproducts = '';
let salesamount = '';
let salespaid = '';
let salescustomerName = '';
let salescustomerNumber = '';
let salesuserId  = '';
let salesrefunded = '';
let salespayCounter = '';
let salessource = '';
let salesbackupSource = '';
let salesbackupLocation = '';
let salesbackupUser = '';
let salesChange = '';
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
  if(salesId === change.doc.data()._id && 
  salesdate === change.doc.data().date &&
  salesdebt === change.doc.data().debt &&
  salescomment === change.doc.data().comment &&
  salesproducts === change.doc.data().products &&
  salesamount === change.doc.data().amount &&
  salespaid === change.doc.data().paid &&
  salescustomerName === change.doc.data().customerName &&
  salescustomerNumber === change.doc.data().customerNumber &&
  salesuserId  === change.doc.data().userId  &&
  salesrefunded === change.doc.data().refunded &&
  salespayCounter === change.doc.data().payCounter &&
  salessource === change.doc.data().source &&
  salesbackupSource === change.doc.data().backupSource &&
  salesbackupLocation === change.doc.data().backupLocation &&
  salesbackupUser === change.doc.data().backupUser &&
  salesChange === change.type) return;

  salesId = change.doc.data()._id;
  salesdate = change.doc.data().date;
  salesdebt = change.doc.data().debt;
  salescomment = change.doc.data().comment;
  salesproducts = change.doc.data().products;
  salesamount = change.doc.data().amount;
  salespaid = change.doc.data().paid;
  salescustomerName = change.doc.data().customerName;
  salescustomerNumber = change.doc.data().customerNumber;
  salesuserId  = change.doc.data().userId ;
  salesrefunded = change.doc.data().refunded;
  salespayCounter = change.doc.data().payCounter;
  salessource = change.doc.data().source;
  salesbackupSource = change.doc.data().backupSource;
  salesbackupLocation = change.doc.data().backupLocation;
  salesbackupUser = change.doc.data().backupUser;
  salesChange = change.type;

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