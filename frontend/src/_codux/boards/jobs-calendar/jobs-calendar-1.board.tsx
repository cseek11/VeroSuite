import { createBoard } from '@wixc3/react-board';
import { JobsCalendar } from '../../../routes/lazy';

export default createBoard({
  name: 'JobsCalendar 1',
  Board: () => (
    <JobsCalendar
      events={[
        {
          id: '1',
          title: 'Meeting with Client',
          start: '2023-10-10T10:00:00',
          end: '2023-10-10T11:00:00',
          allDay: false,
          color: '#FF5733',
          extendedProps: {
            technician: 'John Doe',
            status: 'Confirmed',
          },
        },
      ]}
      height='600px'
      view='month'
      onEventClick={event => console.log('Event clicked:', event)}
      onEventDrop={info => console.log('Event dropped:', info)}
      onEventResize={info => console.log('Event resized:', info)}
      onDateSelect={selectInfo => console.log('Date selected:', selectInfo)}
    />
  ),
});
