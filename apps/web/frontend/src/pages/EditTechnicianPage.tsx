import { useParams } from 'react-router-dom';
import TechnicianForm from '../components/technicians/TechnicianForm';

const EditTechnicianPage = () => {
  const { id } = useParams<{ id: string }>();
  
  return <TechnicianForm {...(id !== undefined && id !== null ? { technicianId: id } : {})} isEdit={true} />;
};

export default EditTechnicianPage;

