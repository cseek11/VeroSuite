import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Input, 
  Textarea, 
  Select, 
  Status, 
  Container, 
  Grid, 
  Heading, 
  Text, 
  Badge, 
  Divider,
  Spinner,
  Skeleton
} from '@/components/ui/CRMComponents';
import { 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  Plus, 
  Search, 
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Save
} from 'lucide-react';

export default function CRMDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    description: ''
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <Container>
      <div className="crm-fade-in-up">
        {/* Page Header */}
        <div className="mb-8">
          <Heading level={1}>CRM Component Demo</Heading>
          <Text variant="secondary">
            Showcasing the new productivity-focused CRM design system
          </Text>
        </div>

        {/* Typography Showcase */}
        <Card
          header={
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <Heading level={3}>Typography System</Heading>
            </div>
          }
        >
          <div className="space-y-4">
            <Heading level={1}>Heading Level 1</Heading>
            <Heading level={2}>Heading Level 2</Heading>
            <Heading level={3}>Heading Level 3</Heading>
            <Heading level={4}>Heading Level 4</Heading>
            <Text variant="body">This is body text with good readability and proper line height.</Text>
            <Text variant="secondary">This is secondary text for supporting information.</Text>
            <Text variant="small">This is small text for captions and metadata.</Text>
          </div>
        </Card>

        <div className="mt-8">
          <Grid cols={2}>
            {/* Button Showcase */}
            <Card
              header={
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-purple-600" />
                  <Heading level={3}>Button System</Heading>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="danger">Danger</Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" size="sm">Small</Button>
                  <Button variant="primary" size="md">Medium</Button>
                  <Button variant="primary" size="lg">Large</Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" disabled>Disabled</Button>
                  <Button variant="primary">
                    <Plus className="w-4 h-4" />
                    With Icon
                  </Button>
                </div>
              </div>
            </Card>

            {/* Status & Badge Showcase */}
            <Card
              header={
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <Heading level={3}>Status & Badges</Heading>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Status variant="success">Active</Status>
                  <Status variant="warning">Pending</Status>
                  <Status variant="error">Error</Status>
                  <Status variant="info">Info</Status>
                  <Status variant="neutral">Neutral</Status>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="success">Completed</Badge>
                  <Badge variant="warning">In Progress</Badge>
                  <Badge variant="error">Failed</Badge>
                  <Badge variant="info">New</Badge>
                </div>
              </div>
            </Card>
          </Grid>
        </div>

        <div className="mt-8">
          <Grid cols={2}>
            {/* Form Components */}
            <Card
              header={
                <div className="flex items-center gap-3">
                  <Edit className="w-5 h-5 text-purple-600" />
                  <Heading level={3}>Form Components</Heading>
                </div>
              }
            >
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                />
                <Select
                  label="Role"
                  options={[
                    { value: 'admin', label: 'Administrator' },
                    { value: 'manager', label: 'Manager' },
                    { value: 'technician', label: 'Technician' },
                    { value: 'dispatcher', label: 'Dispatcher' }
                  ]}
                  value={formData.role}
                  onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                />
                <Textarea
                  label="Description"
                  placeholder="Enter a description..."
                  value={formData.description}
                  onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                  rows={3}
                />
              </div>
            </Card>

            {/* Loading States */}
            <Card
              header={
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <Heading level={3}>Loading States</Heading>
                </div>
              }
            >
              <div className="space-y-6">
                <div className="space-y-3">
                  <Text variant="body" className="font-medium">Spinners</Text>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      <Text variant="small">Small</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Spinner size="md" />
                      <Text variant="small">Medium</Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <Spinner size="lg" />
                      <Text variant="small">Large</Text>
                    </div>
                  </div>
                </div>
                <Divider />
                <div className="space-y-3">
                  <Text variant="body" className="font-medium">Skeleton Loading</Text>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Divider />
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Submit Form</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </Grid>
        </div>

        {/* Data Table Example */}
        <div className="mt-8">
          <Card
            header={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <Heading level={3}>Customer Management</Heading>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                  <Button variant="primary" size="sm">
                    <Plus className="w-4 h-4" />
                    Add Customer
                  </Button>
                </div>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Last Visit</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div>
                        <Text variant="body" className="font-medium">John Smith</Text>
                        <Text variant="small" className="text-slate-500">+1 (555) 123-4567</Text>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Text variant="body">john.smith@email.com</Text>
                    </td>
                    <td className="py-3 px-4">
                      <Status variant="success">Active</Status>
                    </td>
                    <td className="py-3 px-4">
                      <Text variant="secondary">2 days ago</Text>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="secondary" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="danger" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div>
                        <Text variant="body" className="font-medium">Sarah Johnson</Text>
                        <Text variant="small" className="text-slate-500">+1 (555) 987-6543</Text>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Text variant="body">sarah.johnson@email.com</Text>
                    </td>
                    <td className="py-3 px-4">
                      <Status variant="warning">Pending</Status>
                    </td>
                    <td className="py-3 px-4">
                      <Text variant="secondary">1 week ago</Text>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="secondary" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="danger" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Grid Layout Example */}
        <div className="mt-8">
          <Card
            header={
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <Heading level={3}>Dashboard Grid</Heading>
              </div>
            }
          >
            <Grid cols={4}>
              <Card>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <Heading level={4}>Total Customers</Heading>
                  <Text variant="body" className="text-2xl font-bold text-purple-600">1,234</Text>
                  <Text variant="small" className="text-green-600">+12% from last month</Text>
                </div>
              </Card>
              <Card>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <Heading level={4}>Active Jobs</Heading>
                  <Text variant="body" className="text-2xl font-bold text-blue-600">89</Text>
                  <Text variant="small" className="text-green-600">+5% from last week</Text>
                </div>
              </Card>
              <Card>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <Heading level={4}>Revenue</Heading>
                  <Text variant="body" className="text-2xl font-bold text-green-600">$45,678</Text>
                  <Text variant="small" className="text-green-600">+8% from last month</Text>
                </div>
              </Card>
              <Card>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Settings className="w-6 h-6 text-orange-600" />
                  </div>
                  <Heading level={4}>Pending</Heading>
                  <Text variant="body" className="text-2xl font-bold text-orange-600">23</Text>
                  <Text variant="small" className="text-red-600">-3% from last week</Text>
                </div>
              </Card>
            </Grid>
          </Card>
        </div>
      </div>
    </Container>
  );
}
