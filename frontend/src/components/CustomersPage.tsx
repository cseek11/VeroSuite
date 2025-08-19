import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const mockCustomers = [
  { id: '1', name: 'Acme Corp', locations: [
    { id: 'loc1', name: 'HQ', lat: 40.44, lng: -79.99 },
    { id: 'loc2', name: 'Branch', lat: 40.45, lng: -79.98 }
  ], history: ['Job 1', 'Job 2'] },
  { id: '2', name: 'Beta LLC', locations: [
    { id: 'loc3', name: 'Main', lat: 40.46, lng: -79.97 }
  ], history: ['Job 3'] }
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', locations: [] });
  const [showHistory, setShowHistory] = useState(false);

  const handleAdd = () => {
    setFormData({ name: '', locations: [] });
    setShowForm(true);
    setSelectedCustomer(null);
  };
  const handleEdit = (customer: any) => {
    setFormData({ name: customer.name, locations: customer.locations });
    setShowForm(true);
    setSelectedCustomer(customer);
  };
  const handleSave = () => {
    if (selectedCustomer) {
      setCustomers(customers.map(c => c.id === selectedCustomer.id ? { ...selectedCustomer, ...formData } : c));
    } else {
      setCustomers([...customers, { id: Date.now().toString(), ...formData, history: [] }]);
    }
    setShowForm(false);
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={handleAdd}>Add Customer</button>
      <table className="w-full mb-6 border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Locations</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.locations.map((l:any) => l.name).join(', ')}</td>
              <td className="p-2">
                <button className="text-blue-600 mr-2" onClick={() => handleEdit(c)}>Edit</button>
                <button className="text-green-600 mr-2" onClick={() => { setSelectedCustomer(c); setShowHistory(true); }}>View History</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Map Integration */}
      <div className="mb-6">
        <MapContainer center={[40.44, -79.99]} zoom={12} style={{ height: '300px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {customers.flatMap(c => c.locations).map((loc:any) => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]}>
              <Popup>{loc.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {/* Add/Edit Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">{selectedCustomer ? 'Edit' : 'Add'} Customer</h2>
            <input className="border p-2 w-full mb-2" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            {/* Location management simplified for demo */}
            <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setFormData({ ...formData, locations: [...formData.locations, { id: Date.now().toString(), name: 'New Location', lat: 40.44, lng: -79.99 }] })}>Add Location</button>
            <div className="mt-2">
              {formData.locations.map((loc:any, idx:number) => (
                <div key={loc.id} className="flex items-center gap-2 mb-1">
                  <input className="border p-1" value={loc.name} onChange={e => {
                    const updated = [...formData.locations];
                    updated[idx].name = e.target.value;
                    setFormData({ ...formData, locations: updated });
                  }} />
                  <button className="text-red-500" onClick={() => {
                    setFormData({ ...formData, locations: formData.locations.filter((_:any,i:number) => i!==idx) });
                  }}>Remove</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleSave}>Save</button>
              <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* View History */}
      {showHistory && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">History for {selectedCustomer.name}</h2>
            <ul className="mb-4">
              {selectedCustomer.history.map((h:string,i:number) => <li key={i}>{h}</li>)}
            </ul>
            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setShowHistory(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
