import { createBoard } from '@wixc3/react-board';
import JobsCalendar from '../../components/JobsCalendar';

export default createBoard({
  name: 'Calendar',
  Board: () => <JobsCalendar events={[]} />,
  environmentProps: {
    windowWidth: 1024,
    windowHeight: 768,
    windowBackgroundColor: '#ffffff',
  },
  isSnippet: false,
});
