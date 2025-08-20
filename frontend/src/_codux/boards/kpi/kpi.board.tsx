import { createBoard } from '@wixc3/react-board';
import { KPI } from '../../../components/KPI';
import { CheckCircle } from 'lucide-react';

export default createBoard({
  name: 'KPI',
  Board: () => (
    <KPI
      icon={<CheckCircle />}
      label='Completed Tasks'
      value={42}
      color='#4CAF50'
      tooltip='Number of tasks completed successfully'
    />
  ),
});
