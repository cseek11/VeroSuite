import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/lib/user-api';
import { Search, Eye, Pencil, Plus, User as UserIcon, Mail, Phone } from 'lucide-react';
import { logger } from '@/utils/logger';
import { User } from '@/types/enhanced-types';

interface UserListProps {
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onCreateUser: () => void;
}

export default function UserList({ onViewUser, onEditUser, onCreateUser }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('first_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 20;

  // Fetch users from backend API
  const { data: usersResponse, isLoading, error, refetch: _refetch } = useQuery<{ users: User[] }>({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const response = await userApi.getUsers();
        const normalizedUsers: User[] = (response?.users || []).map((user: any) => ({
          ...user,
          roles: Array.isArray(user.roles) ? user.roles : [],
          status: user.status ?? 'inactive',
          tenant_id: user.tenant_id ?? '',
          password_hash: user.password_hash ?? '',
          created_at: user.created_at ?? new Date().toISOString(),
          updated_at: user.updated_at ?? new Date().toISOString(),
        }));
        return { users: normalizedUsers };
      } catch (error) {
        logger.error('Error fetching users', error, 'UserList');
        throw error;
      }
    },
  });

  const allUsers = usersResponse?.users || [];

  // Apply client-side filtering and sorting
  const users = useMemo(() => {
    let filteredUsers = [...allUsers];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.toLowerCase().includes(searchLower) ||
        user.employee_id?.toLowerCase().includes(searchLower)
      );
    }

    // Apply role filter
    if (selectedRole !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        user.roles?.includes(selectedRole)
      );
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        user.status === selectedStatus
      );
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
      let aValue: any = '';
      let bValue: any = '';

      if (sortBy === 'name') {
        aValue = `${a.first_name} ${a.last_name}`;
        bValue = `${b.first_name} ${b.last_name}`;
      } else {
        aValue = a[sortBy as keyof typeof a] || '';
        bValue = b[sortBy as keyof typeof b] || '';
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Apply pagination
    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage;
    return filteredUsers.slice(from, to);
  }, [allUsers, searchTerm, selectedRole, selectedStatus, sortBy, sortOrder, currentPage, itemsPerPage]);

  const totalCount = useMemo(() => {
    let filteredUsers = [...allUsers];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.toLowerCase().includes(searchLower) ||
        user.employee_id?.toLowerCase().includes(searchLower)
      );
    }

    if (selectedRole !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        user.roles?.includes(selectedRole)
      );
    }

    if (selectedStatus !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        user.status === selectedStatus
      );
    }

    return filteredUsers.length;
  }, [allUsers, searchTerm, selectedRole, selectedStatus]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'admin': 'bg-purple-100 text-purple-800',
      'dispatcher': 'bg-blue-100 text-blue-800',
      'technician': 'bg-green-100 text-green-800',
      'owner': 'bg-yellow-100 text-yellow-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : status === 'inactive'
      ? 'bg-gray-100 text-gray-800'
      : 'bg-red-100 text-red-800';
  };

  // Get unique roles from all users
  const availableRoles = useMemo(() => {
    const roles = new Set<string>();
    allUsers.forEach(user => {
      user.roles?.forEach(role => roles.add(role));
    });
    return Array.from(roles).sort();
  }, [allUsers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">
          Error loading users: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Users</h2>
            <p className="text-sm text-gray-600">
              {totalCount} total users
            </p>
          </div>
          <button
            onClick={onCreateUser}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, phone, or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="sm:w-48">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
            >
              <option value="all">All Roles</option>
              {availableRoles.map((role: string) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('name')}
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Name
                  {sortBy === 'name' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th
                onClick={() => handleSort('roles')}
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Role
                  {sortBy === 'roles' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee ID
              </th>
              <th
                onClick={() => handleSort('status')}
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center">
                  Status
                  {sortBy === 'status' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-sm text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="h-3 w-3 mr-1 text-gray-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {user.phone ? (
                      <div className="flex items-center text-sm text-gray-900">
                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                        {user.phone}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.map((role: string) => (
                        <span
                          key={role}
                          className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getRoleColor(role)}`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {user.employee_id || '—'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status ?? '')}`}>
                      {user.status ?? '—'}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onViewUser(user)}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                        title="View User"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditUser(user)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Edit User"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'text-white bg-purple-600 border border-purple-600'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





