import { db as fire } from 'auth/FirebaseAuth';
import DB from './db';

const db = fire.collection("/employees");
const offlineDB = new DB('employees');
let employeeId = '';
let employeeIdNumber = '';
let employeeName = '';
let employeePhoneNumber = '';
let employeeEmail = '';
let employeeUserRole = '';
let employeeUserStore = '';
let employeeGender = '';
let employeeChange = '';
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
  if(employeeId === change.doc.data()._id && 
    employeeName === change.doc.data().name && 
    employeeEmail === change.doc.data().email && 
    employeePhoneNumber === change.doc.data().phoneNumber && 
    employeeIdNumber === change.doc.data().idNumber && 
    employeeUserRole === change.doc.data().userRole && 
    employeeUserStore === change.doc.data().userStore && 
    employeeGender === change.doc.data().gender && 
    employeeChange === change.type) return;

    employeeId = change.doc.data()._id;
    employeeName = change.doc.data().name;
    employeeEmail = change.doc.data().email;
    employeePhoneNumber = change.doc.data().phoneNumber;
    employeeIdNumber = change.doc.data().idNumber;
    employeeUserRole = change.doc.data().userRole;
    employeeUserStore = change.doc.data().userStore;
    employeeGender = change.doc.data().gender;
    employeeChange = change.type;

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