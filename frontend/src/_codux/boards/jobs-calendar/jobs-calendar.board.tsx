import { createBoard } from '@wixc3/react-board';
import JobsCalendar from '../../../components/JobsCalendar';

export default createBoard({
  name: 'JobsCalendar',
  Board: () => <JobsCalendar />,
  environmentProps: {
    windowWidth: 770.3333333333334,
  },
});
