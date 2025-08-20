import { createBoard } from '@wixc3/react-board';
import Dashboard from '../../../routes/Dashboard';

export default createBoard({
  name: 'Dashboard',
  Board: () => <Dashboard />,
});
