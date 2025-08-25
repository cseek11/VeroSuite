import { createBoard } from '@wixc3/react-board';
import DashboardSidebar from '../../../components/dashboard/DashboardSidebar';

export default createBoard({
  name: 'DashboardSidebar',
  Board: () => (
    <DashboardSidebar
      isOpen={true}
      onClose={() => console.log('Sidebar closed')}
    />
  ),
});
