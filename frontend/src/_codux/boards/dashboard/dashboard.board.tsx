import { createBoard } from '@wixc3/react-board';
import Dashboard from '../../../ui-dashboard/Dashboard.jsx';

export default createBoard({
  name: 'Dashboard',
  Board: () => <Dashboard />,
});
