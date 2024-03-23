import { db as fire } from 'auth/FirebaseAuth';
import DB from './db';

const db = fire.collection("/category");
const offlineDB = new DB('category');
let categoryId = '';
let categoryName = '';
let categoryChange = '';
const getAll = () => {
  return db;
};

const create = (data,id) => {
  id = (id) ? ''+id : ''+new Date().getTime();
  data['_id'] = id;
  offlineDB.create(data);
  return db.doc(id).set(data);
};

const save = (change) => {
  if(categoryId === change.doc.data()._id && categoryName === change.doc.data().name && categoryChange === change.type) return;
  categoryId = change.doc.data()._id;
  categoryName = change.doc.data().name;
  categoryChange = change.type;
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