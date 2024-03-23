import React from "react";
import { Row, Col, Card, Tag, Avatar, Badge, Dropdown, Menu, Table, Calendar } from 'antd';
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format';
import DataDisplayWidget from 'components/shared-components/DataDisplayWidget';

import List from './list'
import { 
	ArrowUpOutlined,
	ArrowDownOutlined,
	BarChartOutlined,
	FileDoneOutlined,
	AuditOutlined, 
	BankOutlined,
	LoadingOutlined
} from '@ant-design/icons';

import { 
	FileExcelOutlined, 
	PrinterOutlined, 
	EllipsisOutlined, 
	ReloadOutlined 
  } from '@ant-design/icons';

import { 
  	AnnualStatisticData, 
	RecentTransactionData 
} from './DefaultDashboardData';
import StatisticWidget from 'components/shared-components/StatisticWidget';

import utils from 'utils';
import moment from "moment";

const getListData = (value) => {
	let listData;
	switch (value.date()) {
	  case 8:
		listData = [
		  { type: "processing", content: "This is usual event." }
		];
		break;
	  case 10:
		listData = [
		  { type: "processing", content: "This is warning event." },
		];
		break;
	  case 15:
		listData = [
		  { type: "processing", content: "This is error event 4." }
		];
		break;
	  default:
	}
	return listData || [];
  }
  
  const dateCellRender = (value) => {
	const listData = getListData(value);
	return (
	  <span className="p-0 m-0" style={{position:"absolute", bottom: '-9px', right: '3px'}}>
		{listData.map(item => (
			<Badge status={item.type} className="p-0 m-0"/>
		))}
	  </span>
	);
  }
  
  const getMonthData = (value) => {
	if (value.month() === 8) {
	  return 1394;
	}
  }
  
  const monthCellRender = (value) => {
	const num = getMonthData(value);
	return num ? (
	  <div className="notes-month">
		<section>{num}</section>
		<span>Backlog number</span>
	  </div>
	) : null;
  }

const WeeklyRevenue = (props) => {
	const [state, setState] = React.useState({value: moment(),selectedValue: moment()})
	const { weekData, lastWeekData } = props;
	const weekTotal = weekData.reduce((accumulator, currentElement) => {
        return parseFloat(accumulator) + parseFloat(currentElement.data().amount);
    },0)
	const onPanelChange = value => {
		setState({ value });
	};
	const onSelect = value => {
		setState({
			value,
			selectedValue: value,
		});
	};  
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
						<h4 className="mb-0">Events Reminder</h4>
						<span className="text-muted">{state.selectedValue && state.selectedValue.format('DD MMMM, YYYY')}</span>
					</div>
					<div className="mb-4">
					<h1>Events</h1>
						<p className={pClass}>
							<span >
								{pClass === "text-success" ? (<ArrowUpOutlined />) : (<ArrowDownOutlined />)}
								<span> {perc} </span>
							</span>
							<span>{caption}</span>
						</p>
						<p>{`You selected: ${state.selectedValue && state.selectedValue.format('YYYY-MM-DD')}`}</p>
					</div>
				</Flex>
			</Col>
			<Col xs={24} sm={24} md={24} lg={16}>
				<Calendar 
				fullscreen={false} 
				value={state.value} 
				onSelect={onSelect}  
				onPanelChange={onPanelChange} 
				dateCellRender={dateCellRender}
        		monthCellRender={monthCellRender}
				style={{marginTop:"-10px", marginBottom:"-10px"}}/>
			</Col>
		</Row>
	</Card>)
}

  
  const latestTransactionOption = (
	<Menu>
	  <Menu.Item key="0">
		<span>
		  <div className="d-flex align-items-center">
			<ReloadOutlined />
			<span className="ml-2">Refresh</span>
		  </div>
		</span>
	  </Menu.Item>
	  <Menu.Item key="1">
		<span>
		  <div className="d-flex align-items-center">
			<PrinterOutlined />
			<span className="ml-2">Print</span>
		  </div>
		</span>
	  </Menu.Item>
	  <Menu.Item key="12">
		<span>
		  <div className="d-flex align-items-center">
			<FileExcelOutlined />
			<span className="ml-2">Export</span>
		  </div>
		</span>
	  </Menu.Item>
	</Menu>
  );
  
  const cardDropdown = (menu) => (
	<Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
	  <a href="/#" className="text-gray font-size-lg" onClick={e => e.preventDefault()}>
		<EllipsisOutlined />
	  </a>
	</Dropdown>
  )
  
  const tableColumns = [
	{
	  title: 'Customer',
	  dataIndex: 'name',
	  key: 'name',
	  render: (text, record) => (
		<div className="d-flex align-items-center">
		  <Avatar size={30} className="font-size-sm" style={{backgroundColor: record.avatarColor}}>
			{utils.getNameInitial(text)}
		  </Avatar>
		  <span className="ml-2">{text}</span>
		</div>
	  ),
	},
	{
	  title: 'Date',
	  dataIndex: 'date',
	  key: 'date',
	},
	{
	  title: 'Amount',
	  dataIndex: 'amount',
	  key: 'amount',
	},
	{
	  title: () => <div className="text-right">Status</div>,
	  key: 'status',
	  render: (_, record) => (
		<div className="text-right">
		  <Tag className="mr-0" color={record.status === 'Approved' ? 'cyan' : record.status === 'Pending' ? 'blue' : 'volcano'}>{record.status}</Tag>
		</div>
	  ),
	},
  ];


const DisplayDataSet = (props) => {
	let {loading, todayData, credits, customer} = props;
	const amountTotal = todayData.reduce((accumulator, currentElement) => {
        return parseFloat(accumulator) + parseFloat(currentElement.data().amount);
    },0)
	return (
	<Row gutter={16}>
		<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
			<DataDisplayWidget 
				icon={!loading ? <BankOutlined /> : <LoadingOutlined/>} 
				value={(<NumberFormat displayType={'text'} value={todayData.length} thousandSeparator={true}/>)}
				title="Account Balance"	
				color="cyan"
				vertical={true}
				avatarSize={55}
			/>
			<DataDisplayWidget 
				icon={!loading ? <AuditOutlined /> : <LoadingOutlined/>} 
				value={(<NumberFormat displayType={'text'} value={amountTotal} thousandSeparator={true}/>)}
				title="Penalties"	
				color="volcano"
				vertical={true}
				avatarSize={55}
			/>
		</Col>
		<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
			<DataDisplayWidget 
				icon={!loading ? <FileDoneOutlined /> : <LoadingOutlined/>}
				value={(<NumberFormat displayType={'text'} value={credits} thousandSeparator={true}/>)}
				title="Entry Fees"	
				color="blue"
				vertical={true}
				avatarSize={55}
			/>
			<DataDisplayWidget 
				icon={<BarChartOutlined />} 
				value={customer}
				title="Share Value"	
				color="gold"
				vertical={true}
				avatarSize={55}
			/>
		</Col>
	</Row>
)}


const SalesDashboard = ({systemData}) => {
	const {sales, salesLoading, shops, shopsLoading, categories, mondy, lmondy, sundy, lsundy, findSeries, methodColors} = systemData;
  	const [recentTransactionData] = React.useState(RecentTransactionData)
	const [annualStatisticData] = React.useState(AnnualStatisticData);

	let credits = 0;	
	new Promise(function(myResolve, myReject) {
		credits = salesLoading ? 0 : sales.docs.filter(x=> x.data().amount > x.data().paid).reduce((accumulator, currentElement) => {
			let balance = currentElement.data().amount - currentElement.data().paid;
			return parseFloat(accumulator) + parseFloat(balance)
		},0)
	});
	let TotalCredits = 0;
	new Promise(function(myResolve, myReject) {
		let customersCredits = []
		TotalCredits = salesLoading ? 0 : sales.docs.filter(x=> x.data().amount > x.data().paid).reduce((accumulator, currentElement) => {
			let balance = customersCredits[currentElement.data().customerNumber] ? 0 : 1;
			customersCredits[currentElement.data().customerNumber] = true;
			return parseFloat(accumulator) + parseFloat(balance)
		},0)
	});

	return (
		<>
			<Row gutter={16}>
				<Col xs={24} sm={24} md={24} lg={16} xl={15} xxl={14}>
					<WeeklyRevenue categories={categories} weekData = {salesLoading ? [] : sales.docs.filter(x=> x.data().date >= mondy && x.data().date <= sundy)} lastWeekData = {salesLoading ? [] : sales.docs.filter(x=> x.data().date >= lmondy && x.data().date <= lsundy)} findSeries={findSeries}/>
				</Col>
				<Col xs={24} sm={24} md={24} lg={8} xl={9} xxl={10}>
					<DisplayDataSet credits={credits} customer={TotalCredits} loading={salesLoading} todayData = {salesLoading ? [] : sales.docs.filter(x=> x.data().date >= new Date().setHours(0,0,0,0))} />
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
							/>
					</Card>
				</Col>
			</Row>
			<Row gutter={16}>
				<Col xs={24} sm={24} md={24} lg={7}>
					<Row gutter={16}>
						<Col xs={24} sm={24} md={24} lg={24}>
						<Row gutter={16}>
							{
							annualStatisticData.map((elm, i) => (
								<Col xs={24} sm={24} md={24} lg={24} xl={24} key={i}>
								<StatisticWidget 
									title={elm.title} 
									value={elm.value}
								/>
								</Col>
							))
							}
						</Row>
						</Col>
					</Row>
				</Col>
				<Col xs={24} sm={24} md={24} lg={17}>
				<Card title="Latest Transactions" extra={cardDropdown(latestTransactionOption)}>
					<Table 
					className="no-border-last" 
					columns={tableColumns} 
					dataSource={recentTransactionData} 
					rowKey='id' 
					pagination={false}
					/>
				</Card>
				</Col>
			</Row>
		</>
	)
}

export default SalesDashboard
