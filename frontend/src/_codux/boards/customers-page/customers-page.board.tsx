import { createBoard } from '@wixc3/react-board';
import CustomersPage from '../../../components/CustomersPage';

export default createBoard({
  name: 'CustomersPage',
  Board: () => <CustomersPage />,
});
