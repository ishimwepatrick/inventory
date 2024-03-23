import { db as fire } from 'auth/FirebaseAuth';
import DB from './db';

const db = fire.collection("/records");
const offlineDB = new DB('records');
let recordsId = '';
let recordsdate = '';
let recordsamount = '';
let recordsmethod = '';
let recordstype = '';
let recordscustomerName = '';
let recordscustomerNumber = '';
let recordsuserId  = '';
let recordsbackupUser = '';
let recordssource = '';
let recordsbackupSource = '';
let recordsbackupLocation = '';
let recordsChange = '';
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
  if(recordsId === change.doc.data()._id &&
  recordsdate === change.doc.data().date &&
  recordsamount === change.doc.data().amount &&
  recordsmethod === change.doc.data().method &&
  recordstype === change.doc.data().type &&
  recordscustomerName === change.doc.data().customerName &&
  recordscustomerNumber === change.doc.data().customerNumber &&
  recordsuserId  === change.doc.data().userId  &&
  recordsbackupUser === change.doc.data().backupUser &&
  recordssource === change.doc.data().source &&
  recordsbackupSource === change.doc.data().backupSource &&
  recordsbackupLocation === change.doc.data().backupLocation &&
  recordsChange === change.type) return;

  recordsId = change.doc.data()._id;
  recordsdate = change.doc.data().date;
  recordsamount = change.doc.data().amount;
  recordsmethod = change.doc.data().method;
  recordstype = change.doc.data().type;
  recordscustomerName = change.doc.data().customerName;
  recordscustomerNumber = change.doc.data().customerNumber;
  recordsuserId  = change.doc.data().userId ;
  recordsbackupUser = change.doc.data().backupUser;
  recordssource = change.doc.data().source;
  recordsbackupSource = change.doc.data().backupSource;
  recordsbackupLocation = change.doc.data().backupLocation;
  recordsChange = change.type;
  
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