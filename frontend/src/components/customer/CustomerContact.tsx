import { useState } from 'react';
import { Phone, Mail, User, Edit2, Plus, Trash2 } from 'lucide-react';
import { Button, Input, Typography } from '@/components/ui';

interface CustomerContactProps {
  customerId: string;
}

const CustomerContact: React.FC<CustomerContactProps> = ({ customerId: _customerId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'John Smith',
      title: 'Primary Contact',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@email.com',
      type: 'primary'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      title: 'Billing Contact',
      phone: '+1 (555) 987-6543',
      email: 'billing@company.com',
      type: 'billing'
    }
  ]);

  const [newContact, setNewContact] = useState({
    name: '',
    title: '',
    phone: '',
    email: '',
    type: 'additional'
  });

  const handleSave = () => {
    if (newContact.name && newContact.phone) {
      setContacts([...contacts, { ...newContact, id: Date.now() }]);
      setNewContact({ name: '', title: '', phone: '', email: '', type: 'additional' });
    }
    setIsEditing(false);
  };

  const handleDelete = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Typography variant="h3" className="text-lg font-semibold text-gray-900">
          Contact Information
        </Typography>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2"
        >
          <Edit2 className="w-4 h-4" />
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      {/* Primary Contact */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Primary Contact</h4>
            <p className="text-sm text-gray-600">Main point of contact</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">john.smith@email.com</span>
          </div>
        </div>
      </div>

      {/* Additional Contacts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Typography variant="h4" className="text-md font-medium text-gray-900">
            Additional Contacts
          </Typography>
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Contact
            </Button>
          )}
        </div>

        {contacts.filter(c => c.type !== 'primary').map((contact) => (
          <div key={contact.id} className="bg-white rounded-lg p-3 border border-gray-200/50">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h5 className="font-medium text-gray-900">{contact.name}</h5>
                <p className="text-xs text-gray-500">{contact.title}</p>
              </div>
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(contact.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600">{contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600">{contact.email}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Contact Form */}
        {isEditing && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200/50">
            <h5 className="font-medium text-gray-900 mb-3">Add New Contact</h5>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <Input
                 placeholder="Name"
                 value={newContact.name}
                 onChange={(value) => setNewContact({ ...newContact, name: value })}
                 className="text-sm"
               />
               <Input
                 placeholder="Title"
                 value={newContact.title}
                 onChange={(value) => setNewContact({ ...newContact, title: value })}
                 className="text-sm"
               />
               <Input
                 placeholder="Phone"
                 value={newContact.phone}
                 onChange={(value) => setNewContact({ ...newContact, phone: value })}
                 className="text-sm"
               />
               <Input
                 placeholder="Email"
                 value={newContact.email}
                 onChange={(value) => setNewContact({ ...newContact, email: value })}
                 className="text-sm"
               />
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={handleSave}>
                Save Contact
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewContact({ name: '', title: '', phone: '', email: '', type: 'additional' })}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerContact;
