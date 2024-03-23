import React, { useState } from 'react'
import { Card } from 'antd';
import Flex from 'components/shared-components/Flex'
import { Typography } from "antd";
import List from './list';

const { Title } = Typography;
const Quantity = ({systemData}) => {
	const [brandloading, setBrandLoading] = useState(true);
	let {products, productsLoading, records, recordsLoading, shortTypes, rounder, roundPoints } = systemData;
	records = recordsLoading ? [] : records.docs.filter(x => x.data().refunded === false && x.data().date < +(new Date().getTime()));
	let productRecords = [];
	if(!productsLoading && !recordsLoading){
	  let allRecords = [];
	  products.docs.map(doc => {
		let sqmQty = !doc.data().sqmStock ? 0 : doc.data().productType === '0' ? 0 : ((parseInt(doc.data().productType) > 3 ? parseInt(doc.data().sqmStock * doc.data().ctnSqm) :(doc.data().pkgUnit === '1' ? parseFloat(doc.data().sqmStock * (doc.data().qtyPkg/doc.data().ctnSqm)) : parseFloat(doc.data().sqmStock / doc.data().ctnSqm))));
		let pkgQty = doc.data().pkgUnit === '1' ? doc.data().pkgStock * doc.data().qtyPkg : 0;
		let stockQuantity = parseFloat(pkgQty) + parseFloat(doc.data().pcsStock) + parseFloat(sqmQty);
		let body = [...records]; 
		let {pkgUnit,qtyPkg,pkgSalePrice,pcsSalePrice,ctnSqm,productType,sqmPrice} = doc.data();
		body = body.filter(x => x.data().productName === doc.data()._id && x.data().sales === false && x.data().damaged === false);
		const stockTotal = body.reduce((accumulator, currentElement) => {
			let quantity = currentElement.data().purchasedType === '0' ? currentElement.data().quantity : (currentElement.data().purchasedType === '1' ? currentElement.data().quantity * currentElement.data().qtyPkg : (parseInt(currentElement.data().purchasedType) > 4 ? parseInt(currentElement.data().quantity * currentElement.data().ctnSqm) :(currentElement.data().pkgUnit === '1' ? parseFloat(currentElement.data().quantity * (currentElement.data().qtyPkg/currentElement.data().ctnSqm)) : parseFloat(currentElement.data().quantity / currentElement.data().ctnSqm))));
		  return currentElement.data().move === true ? parseFloat(accumulator) - parseFloat(quantity) : parseFloat(accumulator) + parseFloat(quantity);
		},stockQuantity)
		let sqMeters = (productType ===  '1' && pkgUnit ===  '1') ? stockTotal*(ctnSqm/qtyPkg): (productType ===  '1' && pkgUnit ===  '0') ? stockTotal*ctnSqm : 0;
		let meters = (productType ===  '2' && pkgUnit ===  '1') ? stockTotal*ctnSqm*qtyPkg: (productType ===  '2' && pkgUnit ===  '0') ? stockTotal*ctnSqm : 0;
		let kilos = (productType ===  '3' && pkgUnit ===  '1') ? stockTotal*ctnSqm*qtyPkg: (productType ===  '3' && pkgUnit ===  '0') ? stockTotal*ctnSqm : 0;
		let cartons = pkgUnit ===  '1' ? parseInt(stockTotal/qtyPkg) : 0;
		let remaining = stockTotal - (cartons * qtyPkg);
		let others = parseInt(productType) > 3 ? parseInt(remaining / ctnSqm) + ' ' + shortTypes[productType] + ' ': '';
		others = (parseInt(productType) > 3 && pkgUnit ===  '1') ? 'and ' + others: others;
		let pieces = parseInt(productType) > 3 ? parseInt(remaining % ctnSqm) : parseInt(remaining);
		let result = pkgUnit ===  '1' ? `${cartons} Cts ${others}and ${pieces} ${shortTypes[0]}` : `${others}${pieces} ${shortTypes[0]}`;
		let meter = productType === '2' ? ' and ' + parseInt(meters % ctnSqm) +' '+ shortTypes[productType] : ''; 
		let kg = productType === '3' ? ' and ' + parseInt(kilos % ctnSqm) +' '+ shortTypes[productType] : ''; 
		let sqMeter = (productType === '1' && pkgUnit ===  '0') ? ' and ' + roundPoints(parseFloat(sqMeters % ctnSqm)) +' '+ shortTypes[productType] : ''; 
		result +=  meter + sqMeter + kg;
		let pkgValue = parseInt(cartons) * parseInt(pkgSalePrice);
		let pcsValue = parseInt(pieces) * parseInt(pcsSalePrice);
		let stockValue = parseInt(pcsValue) + parseInt(pkgValue);
		let piecesValue = pcsSalePrice * stockTotal;
		sqMeters = roundPoints(sqMeters);
		let tempPrice = (parseInt(productType) > 1 && pkgUnit ===  '1') ? (ctnSqm/qtyPkg) * sqmPrice : (parseInt(productType) > 1 && pkgUnit ===  '0') ? qtyPkg * sqmPrice : 0
		stockValue = parseInt(productType) === 1 ? parseInt(sqMeters * sqmPrice) : parseInt(productType) === 1 ? meters * tempPrice : piecesValue;
		allRecords = {
		  ...allRecords,
		  [doc.data()._id] : {'currentStock': result, 'cartons': cartons, 'pieces': pieces, 'pkgPrice': pkgSalePrice, 'pcsPrice':pcsSalePrice, 'stockValue': stockValue, 'sqMeters': sqMeters, 'meters': meters},
		}
		return true;
	  })
	  productRecords = allRecords;
	  if(brandloading){
	  	setBrandLoading(false);
	  }
	}
		
		return (
			<Card>
				<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
					<Flex className="mb-1" mobileFlex={false}>
						<div className="mr-md-3">
							<Title level={4}>Quantity on hand</Title>
						</div>
					</Flex>
				</Flex>
				<List products={productsLoading ? [] : products.docs} loading={productsLoading} brandloading={brandloading} productRecords={productRecords}/>
			</Card>
		)
}

export default Quantity
