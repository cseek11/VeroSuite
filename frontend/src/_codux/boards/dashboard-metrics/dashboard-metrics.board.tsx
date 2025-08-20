import { createBoard } from '@wixc3/react-board';
import DashboardMetrics from '../../../components/dashboard/DashboardMetrics';
import { Users, TrendingUp, ShoppingCart, Eye } from 'lucide-react';

export default createBoard({
  name: 'DashboardMetrics',
  Board: () => (
    <DashboardMetrics
      metrics={[
        {
          title: 'Users',
          value: 1200,
          change: 5,
          changeType: 'increase',
          icon: Users,
          color: '#4CAF50',
        },
        {
          title: 'Sales',
          value: 300,
          change: -2,
          changeType: 'decrease',
          icon: ShoppingCart,
          color: '#F44336',
        },
        {
          title: 'Views',
          value: 1500,
          icon: Eye,
          color: '#2196F3',
        },
      ]}
    />
  ),
});
