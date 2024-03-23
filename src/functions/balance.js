import { Timeline } from 'antd';
import NumberFormat from 'react-number-format';

const findMonths = (settings,shares) => {
  let data = settings['startDate'].value;
  let monthly = settings['monthlyPrice'].value;
  let lMonth = new Date(data).getMonth();
  let lYear = new Date(data).getFullYear();
  let dates = new Date().getDate();
  let month = new Date().getMonth();
  let year = new Date().getFullYear(); 
  let counter = 0;
  for(let j = lYear; j <= year; j++){
    let limiter = (lYear === year || j === year) ? month : 11;
    let starter = (lYear === year || j === lYear) ? lMonth : 0;
    for(let i = starter; i<= limiter; i++){
      counter += (j === year && i === month && dates < 5) ? 0 : 1;
    }
  }
  return (
    <Timeline className="text-left pt-2">
      <Timeline.Item>
        <NumberFormat displayType={'text'} 
                      value={counter*shares*monthly} 
                      suffix={'Rwf monthly savings'} 
                      thousandSeparator={true}/>
      </Timeline.Item>
    </Timeline>
  );
}

const unpaidPenalty = (member) => {
  return member
}

const paidPenalty = (member) => {
  return member
}

export const Balance = {
  findMonths,
  unpaidPenalty,
  paidPenalty
};