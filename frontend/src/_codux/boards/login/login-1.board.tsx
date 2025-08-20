import { createBoard } from '@wixc3/react-board';
import Login from '../../../routes/Login';

export default createBoard({
  name: 'Login 1',
  Board: () => <Login />,
});
