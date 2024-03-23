import React from "react";
import { Row, Col, Button, Card } from 'antd';
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format';
import DataDisplayWidget from 'components/shared-components/DataDisplayWidget';
import List from './list'
import { 
	CloudDownloadOutlined, 
	ArrowUpOutlined,
	ArrowDownOutlined,
	UserSwitchOutlined,
	FileDoneOutlined,
	DollarOutlined,
	BarChartOutlined,
	LoadingOutlined
} from '@ant-design/icons';
import ChartWidget from 'components/shared-components/ChartWidget';
import { COLORS } from 'constants/ChartConstant';

import { useSelector } from 'react-redux'

const WeeklyRevenue = (props) => {
	const { categories, weekly, weekData, lastWeekData, findSeries } = props;
	const { direction } = useSelector(state => state.theme)
	const weekTotal = weekData.reduce((accumulator, currentElement) => {
        return parseFloat(accumulator) + parseFloat(currentElement.data().amount);
    },0)
	const lastWeekTotal = lastWeekData.reduce((accumulator, currentElement) => {
        return parseFloat(accumulator) + parseFloat(currentElement.data().amount);
    },0)
	const pClass = weekTotal > lastWeekTotal ? "text-success" : weekTotal < lastWeekTotal ? "text-danger" : "d-none";
	const diff = Math.abs(weekTotal - lastWeekTotal);
	let perc = '';
	let caption = '';
	if(weekTotal > 0 && lastWeekTotal === 0){
		perc = weekTotal+'%';
		caption = "growth from last week";
	}
	else if(weekTotal === 0 && lastWeekTotal > 0){
		perc = lastWeekTotal+'%';
		caption = "reduction from last week";
	}
	else if(weekTotal > 0 && lastWeekTotal > 0){
		perc = Math.round((diff / lastWeekTotal) * 100)+"%";
		caption = weekTotal > lastWeekTotal ? "growth from last week" : weekTotal < lastWeekTotal ? "reduction from last week" : "same income as last week";
	}
	return (<Card>
		<Row gutter={16}>
			<Col xs={24} sm={24} md={24} lg={8}>
				<Flex className="h-100" flexDirection="column" justifyContent="between">
					<div>
						<h4 className="mb-0">Weekly Revenue</h4>
						<span className="text-muted">{weekly}</span>
					</div>
					<div className="mb-4">
						<h1 className="font-weight-bold">{(<NumberFormat displayType={'text'} value={weekTotal} thousandSeparator={true} suffix={'Rwf'} />)}</h1>
						<p className={pClass}>
							<span >
								{pClass === "text-success" ? (<ArrowUpOutlined />) : (<ArrowDownOutlined />)}
								<span> {perc} </span>
							</span>
							<span>{caption}</span>
						</p>
						<p>Total gross income figure based from the date range given above.</p>
					</div>
				</Flex>
			</Col>
			<Col xs={24} sm={24} md={24} lg={16}>
				<div className="mb-3 text-right">
					<Button icon={<CloudDownloadOutlined/>}>Download Report</Button>
				</div>
				<ChartWidget 
					card={false}
					series={findSeries(weekData)} 
					xAxis={categories} 
					title="This week Income"
					height={250}
					type="bar"
					customOptions={{colors: COLORS}}
					direction={direction}
				/>
			</Col>
		</Row>
	</Card>)
}

const DisplayDataSet = (props) => {
	let {loading, todayData, credits, customer} = props;
	const amountTotal = todayData.reduce((accumulator, currentElement) => {
        return parseFloat(accumulator) + parseFloat(currentElement.data().amount);
    },0)
	return (
	<Row gutter={16}>
		<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
			<DataDisplayWidget 
				icon={!loading ? <FileDoneOutlined /> : <LoadingOutlined/>} 
				value={(<NumberFormat displayType={'text'} value={todayData.length} thousandSeparator={true}/>)}
				title="Today's order"	
				color="cyan"
				vertical={true}
				avatarSize={55}
			/>
			<DataDisplayWidget 
				icon={!loading ? <BarChartOutlined /> : <LoadingOutlined/>} 
				value={(<NumberFormat displayType={'text'} value={amountTotal} thousandSeparator={true}/>)}
				title="Today's Revenue"	
				color="gold"
				vertical={true}
				avatarSize={55}
			/>
		</Col>
		<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
			<DataDisplayWidget 
				icon={<DollarOutlined />} 
				value={(<NumberFormat displayType={'text'} value={credits} thousandSeparator={true}/>)}
				title="Total Credits"	
				color="blue"
				vertical={true}
				avatarSize={55}
			/>
			<DataDisplayWidget 
				icon={<UserSwitchOutlined />} 
				value={customer}
				title="Cash In"	
				color="volcano"
				vertical={true}
				avatarSize={55}
			/>
		</Col>
	</Row>
)}


const SalesDashboard = ({systemData}) => {
	const {sales, salesLoading, shops, shopsLoading, categories, weekly, mondy, lmondy, sundy, lsundy, findSeries, methodColors, statusColors, avatarColors,  payments, paymentsLoading} = systemData;

	let credits = 0;	
	new Promise(function(myResolve, myReject) {
		credits = salesLoading ? 0 : sales.docs.filter(x=> x.data().amount > x.data().paid).reduce((accumulator, currentElement) => {
			let balance = currentElement.data().amount - currentElement.data().paid;
			return parseFloat(accumulator) + parseFloat(balance)
		},0)
	});
	let TodayCash = 0;
	new Promise(function(myResolve, myReject) {
		TodayCash = paymentsLoading ? 0 : payments.docs.filter(x=> x.data().date >= new Date().setHours(0,0,0,0)  && x.data().type === 1).reduce((accumulator, currentElement) => {
			return parseFloat(accumulator) + parseFloat(currentElement.data().amount);
		},0)
	});

	return (
		<>
			<Row gutter={16}>
				<Col xs={24} sm={24} md={24} lg={16} xl={15} xxl={14}>
					<WeeklyRevenue categories={categories} weekly={weekly} weekData = {salesLoading ? [] : sales.docs.filter(x=> x.data().date >= mondy && x.data().date <= sundy)} lastWeekData = {salesLoading ? [] : sales.docs.filter(x=> x.data().date >= lmondy && x.data().date <= lsundy)} findSeries={findSeries}/>
				</Col>
				<Col xs={24} sm={24} md={24} lg={8} xl={9} xxl={10}>
					<DisplayDataSet credits={credits} customer={TodayCash} loading={salesLoading} todayData = {salesLoading ? [] : sales.docs.filter(x=> x.data().date >= new Date().setHours(0,0,0,0))} />
				</Col>
			</Row>
			<Row gutter={16}>
				<Col xs={24} sm={24} md={24} lg={24}>
					<Card title="Recent Orders">
						<List 
							products={salesLoading ? [] : sales.docs.reverse().slice(0,9)} 
							loading={salesLoading} 
							stores={shops} 
							sloading={shopsLoading} 
							methodColors={methodColors}
							statusColors={statusColors}
							avatarColors={avatarColors}
							/>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default SalesDashboard
