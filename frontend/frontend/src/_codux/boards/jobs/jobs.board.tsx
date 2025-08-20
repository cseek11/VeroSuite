import { createBoard } from '@wixc3/react-board';
import Jobs from '../../../routes/Jobs';

export default createBoard({
  name: 'Jobs',
  Board: () => <Jobs />,
});
