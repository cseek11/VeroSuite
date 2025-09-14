import React from 'react';
import { useParams } from 'react-router-dom';
import TechnicianForm from '../components/technicians/TechnicianForm';

const EditTechnicianPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return <TechnicianForm technicianId={id} isEdit={true} />;
};

export default EditTechnicianPage;

