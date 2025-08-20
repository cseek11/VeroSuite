import { createBoard } from '@wixc3/react-board';
import DashboardSidebar from '../../../components/dashboard/DashboardSidebar';

export default createBoard({
  name: 'DashboardSidebar',
  Board: () => (
    <DashboardSidebar
      isOpen={true}
      activeTab='dashboard'
      onTabChange={tab => console.log(`Tab changed to: ${tab}`)}
      onClose={() => console.log('Sidebar closed')}
    />
  ),
});
