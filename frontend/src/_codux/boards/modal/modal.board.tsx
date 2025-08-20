import { createBoard } from '@wixc3/react-board';
import Modal from '../../../components/ui/Modal';

export default createBoard({
  name: 'Modal',
  Board: () => (
    <Modal
      open={true}
      onClose={() => console.log('Modal closed')}
      title='Sample Modal'
      children={<div>Modal Content</div>}
      size='md'
      closeOnOverlayClick={true}
      closeOnEscape={true}
      showCloseButton={true}
      className='custom-modal-class'
    />
  ),
});
