import { createBoard } from '@wixc3/react-board';
import { Dashboard } from '../../../routes/lazy';

export default createBoard({
  name: 'Dashboard 1',
  Board: () => <Dashboard />,
  isSnippet: true,
});
