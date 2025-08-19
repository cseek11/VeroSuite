import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/jobs" className="p-4 bg-white shadow rounded hover:bg-gray-50">Jobs</Link>
        <Link to="/customers" className="p-4 bg-white shadow rounded hover:bg-gray-50">Customers</Link>
        <Link to="/routing" className="p-4 bg-white shadow rounded hover:bg-gray-50">Routing</Link>
      </div>
    </div>
  );
}
