import { createBoard } from '@wixc3/react-board';
import Chart from '../../../components/ui/Chart';

export default createBoard({
  name: 'Chart',
  Board: () => (
    <Chart
      data={[
        { name: 'January', value: 30 },
        { name: 'February', value: 20 },
        { name: 'March', value: 50 },
      ]}
      type='line'
      title='Monthly Sales'
      height={400}
      width={600}
      className='custom-chart'
      color='#4f46e5'
      showGrid={true}
      showLegend={true}
    />
  ),
});
