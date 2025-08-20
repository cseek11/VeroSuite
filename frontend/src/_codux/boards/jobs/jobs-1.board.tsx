import { createBoard } from '@wixc3/react-board';
import { Jobs } from '../../../routes/lazy';

export default createBoard({
  name: 'Jobs 1',
  Board: () => <Jobs />,
});
