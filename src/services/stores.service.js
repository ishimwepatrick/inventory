import { db as fire } from 'auth/FirebaseAuth';
import DB from './db';

const db = fire.collection("/stores");
const offlineDB = new DB('stores');
let storeId = '';
let storeName = '';
let storeLocation = '';
let storeChange = '';
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
  if(storeId === change.doc.data()._id && 
    storeName === change.doc.data().name && 
    storeLocation === change.doc.data().location && 
    storeChange === change.type) return;
  storeId = change.doc.data()._id
  storeName = change.doc.data().name 
  storeLocation = change.doc.data().location 
  storeChange = change.type  
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