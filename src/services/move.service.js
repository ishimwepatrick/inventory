import { db as fire } from 'auth/FirebaseAuth';
import DB from './db';

const db = fire.collection("/move");
const offlineDB = new DB('move');
let moveId = '';
let moveAmount = '';
let moveDate = '';
let moveProducts = '';
let moveSource = '';
let moveUserId =  '';
let moveChange = '';
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
  if(moveId === change.doc.data()._id && 
    moveAmount === change.doc.data().amount && 
    moveDate === change.doc.data().date && 
    moveProducts === change.doc.data().products && 
    moveSource === change.doc.data().source && 
    moveUserId === change.doc.data().userId && 
    moveChange === change.type) return;
  moveId = change.doc.data()._id
  moveAmount = change.doc.data().amount 
  moveDate = change.doc.data().date 
  moveProducts = change.doc.data().products 
  moveSource = change.doc.data().source 
  moveUserId = change.doc.data().userId 
  moveChange = change.type  
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