import { createBoard } from '@wixc3/react-board';
import DispatcherDashboard from '../../../components/DispatcherDashboard';

export default createBoard({
  name: 'DispatcherDashboard',
  Board: () => <DispatcherDashboard />,
});
