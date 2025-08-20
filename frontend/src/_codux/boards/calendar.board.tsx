import { createBoard } from '@wixc3/react-board';
import JobsCalendar from '../../components/JobsCalendar';

export default createBoard({
  name: 'Calendar',
  Board: () => (
    <div>
      <JobsCalendar />
    </div>
  ),
});
