import { createBoard } from '@wixc3/react-board';
import { Login } from '../../../components/Login';

export default createBoard({
  name: 'Login',
  Board: () => <Login />,
});
