import { createBoard } from '@wixc3/react-board';
import JobsScheduler from '../../../components/JobsScheduler';

export default createBoard({
  name: 'JobsScheduler',
  Board: () => <JobsScheduler />,
});
