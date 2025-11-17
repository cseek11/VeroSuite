import { useState } from 'react';
import { ModalState, GroupDeleteModalState } from '../types/dashboard.types';

export const useModalManagement = () => {
  const [alertModal, setAlertModal] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const [confirmModal, setConfirmModal] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning'
  });

  const [promptModal, setPromptModal] = useState<ModalState<string> & { placeholder: string; defaultValue: string }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: (value: string) => {},
    placeholder: '',
    defaultValue: '',
    type: 'info'
  });

  const [groupDeleteModal, setGroupDeleteModal] = useState<GroupDeleteModalState>({
    isOpen: false,
    groupId: '',
    groupName: ''
  });

  return {
    alertModal,
    setAlertModal,
    confirmModal,
    setConfirmModal,
    promptModal,
    setPromptModal,
    groupDeleteModal,
    setGroupDeleteModal
  };
};
