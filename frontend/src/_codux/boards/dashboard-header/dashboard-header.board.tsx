import { createBoard } from '@wixc3/react-board';
import DashboardHeader from '../../../components/dashboard/DashboardHeader';

export default createBoard({
  name: 'DashboardHeader',
  Board: () => (
    <DashboardHeader
      user={{
        id: '1',
        email: 'john.doe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        roles: ['admin'],
        status: 'active',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      }}
      sidebarOpen={false}
      onSidebarToggle={() => console.log('Sidebar toggled')}
      onLogout={() => console.log('Logged out')}
    />
  ),
});
