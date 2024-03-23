import React, { Component } from 'react'
import LoginOne from '../login-1'
import { db } from 'auth/FirebaseAuth';
import DB from 'services/db';

export class Login extends Component {
	state = {
		brandsDB: new DB('brands'),
		categoryDB: new DB('category'),
		customersDB: new DB('customers'),
		employeesDB: new DB('employees'),
		paymentsDB: new DB('payments'),
		productsDB: new DB('products'),
		purchasesDB: new DB('purchases'),
		refillDB: new DB('move'),
		recordsDB: new DB('records'),
		salesDB: new DB('sales'),
		sourcesDB: new DB('products_record'),
		storesDB: new DB('stores'),
		settingsDB: new DB('settings'),
		usersDB: new DB('users'),
	  };
	render() {
		const { brandsDB, categoryDB, customersDB, employeesDB, productsDB, purchasesDB, recordsDB, refillDB, salesDB, sourcesDB, storesDB, paymentsDB, settingsDB } =  this.state;
		// db.disableNetwork()
		// .then(() => {
		  
		//   async function getBrands() {      
		// 	let brands = await db.collection('brands').get();
		// 	if (brands.docs.length === 0) {
		// 	  let offlineproducts = await brandsDB.getAllRows();
		// 	  offlineproducts.forEach(function(product) {
		// 		//   brandsDB.delete(product.id)
		// 		db.collection('brands').doc(product.id).set(product.doc);
		// 	  });
		// 	}
		//   }
		//   async function getCategory(){      
		// 	let categories = await db.collection('category').get();
		// 	if (categories.docs.length === 0) {
		// 	  let offlineproducts = await categoryDB.getAllRows();
		// 	  offlineproducts.forEach(function(product) {
		// 		//   categoryDB.delete(product.id)
		// 		db.collection('category').doc(product.id).set(product.doc);
		// 	  });
		// 	}
		//   }
		//   async function getCustomers(){      
		// 	let customers = await db.collection('customers').get();
		// 	if (customers.docs.length === 0) {
		// 	  let offlineproducts = await customersDB.getAllRows();
		// 	  offlineproducts.forEach(function(product) {
		// 		//   customersDB.delete(product.id)
		// 		db.collection('customers').doc(product.id).set(product.doc);
		// 	  });
		// 	}
		//   }
		//   async function getEmployees() {      
		// 	let employees = await db.collection('employees').get();
		// 	if (employees.docs.length === 0) {
		// 	  let offlineproducts = await employeesDB.getAllRows();
		// 	  offlineproducts.forEach(function(product) {
		// 		  // employeesDB.delete(product.id)
		// 		db.collection('employees').doc(product.id).set(product.doc);
		// 	  });
		// 	}
		//   }
		//   async function getProducts() {      
		// 	let products = await db.collection('products').get();
		// 	if (products.docs.length === 0) {
		// 	  let offlineproducts = await productsDB.getAllRows();
		// 	  offlineproducts.forEach(function(product) {
		// 		//   productsDB.delete(product.id)
		// 		db.collection('products').doc(product.id).set(product.doc);
		// 	  });
		// 	}
		//   }
		//   async function getPurchases() {      
		// 	let products = await db.collection('purchases').get();
		// 	if (products.docs.length === 0) {
		// 	  let offlineproducts = await purchasesDB.getAllRows();
		// 	  offlineproducts.forEach(function(product) {
		// 		//   purchasesDB.delete(product.id)
		// 		db.collection('purchases').doc(product.id).set(product.doc);
		// 	  });
		// 	}
		//   }
		//   async function getSales() {      
		// 	let products = await db.collection('sales').get();
		// 	if (products.docs.length === 0) {
		// 	  let offlineproducts = await salesDB.getAllRows();
		// 	  offlineproducts.forEach(function(product) {
		// 		//   salesDB.delete(product.id)
		// 		db.collection('sales').doc(product.id).set(product.doc);
		// 	  });
		// 	}
		//   }
		//   async function getRefill() {      
		// 	let products = await db.collection('move').get();
		// 	if (products.docs.length === 0) {
		// 	  let offlineproducts = await refillDB.getAllRows();
		// 	  offlineproducts.forEach(function(product) {
		// 		//   refillDB.delete(product.id)
		// 		db.collection('move').doc(product.id).set(product.doc);
		// 	  });
		// 	}
		//   }
		//   async function getRecords() {      
		// 	let products = await db.collection('records').get();
		// 	if (products.docs.length === 0) {
		// 	  let offlineproducts = await recordsDB.getAllRows();
		// 	  offlineproducts.forEach(function(product) {
		// 		//   recordsDB.delete(product.id)
		// 		db.collection('records').doc(product.id).set(product.doc);
		// 	  });
		// 	}
		//   }
		//   async function getSources() {      
		// 	let products = await db.collection('products_record').get();
		// 	if (products.docs.length === 0) {
		// 	  let offlineproducts = await sourcesDB.getAllRows();
		// 	  offlineproducts.forEach(function(product) {
		// 		//   sourcesDB.delete(product.id)
		// 		db.collection('products_record').doc(product.id).set(product.doc);
		// 	  });
		// 	}
		//   }
		//   async function getStores(){      
		// 	let categories = await db.collection('stores').get();
		// 	if (categories.docs.length === 0) {
		// 	  let offlineproducts = await storesDB.getAllRows();
		// 	  offlineproducts.forEach(function(product) {
		// 		//   storesDB.delete(product.id)
		// 		db.collection('stores').doc(product.id).set(product.doc);
		// 	  });
		// 	}
		//   }
		//   async function getPayments(){      
		// 	let payments = await db.collection('payments').get();
		// 	if (payments.docs.length === 0) {
		// 	  let offlineproducts = await paymentsDB.getAllRows();
		// 	  offlineproducts.forEach(function(product) {
		// 		//   paymentsDB.delete(product.id)
		// 		db.collection('payments').doc(product.id).set(product.doc);
		// 	  });
		// 	}
		//   }
		//   async function getSettings(){      
		// 	let settings = await db.collection('settings').get();
		// 	if (settings.docs.length === 0) {
		// 	  let offlineproducts = await settingsDB.getAllRows();
		// 	  offlineproducts.forEach(function(product) {
		// 		//   settingsDB.delete(product.id)
		// 		db.collection('settings').doc(product.id).set(product.doc);
		// 	  });
		// 	}
		//   }
		//   getBrands();
		//   getCategory();
		//   getCustomers();
		//   getEmployees();
		//   getProducts();
		//   getPurchases();
		//   getRefill();
		//   getRecords();
		//   getSales();
		//   getSources();
		//   getStores();
		//   getSettings();
		//   getPayments();
		//   db.enableNetwork()
		// });
		return (
			<LoginOne allowRedirect={true} />
		)
	}
}

export default Login
