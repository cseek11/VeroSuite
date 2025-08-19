import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmApi } from '@/lib/api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputMask from 'react-input-mask';

const AccountSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  account_type: z.enum(['commercial', 'residential']),
});

type AccountForm = z.infer<typeof AccountSchema>;

export default function Customers() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['crm', 'accounts', search],
    queryFn: () => crmApi.accounts(search || undefined),
  });

  const createAccount = useMutation({
    mutationFn: crmApi.createAccount,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crm', 'accounts'] });
      reset();
    },
  });

  const createLocation = useMutation({
    mutationFn: crmApi.createLocation,
    onSuccess: (_d, vars: any) => qc.invalidateQueries({ queryKey: ['crm', 'account', vars.account_id, 'locations'] }),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<AccountForm>({
    resolver: zodResolver(AccountSchema),
    defaultValues: { name: '', account_type: 'commercial' },
  });

  const onSubmit = (values: AccountForm) => createAccount.mutate(values);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Customers</h1>
      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
        <label className="sr-only" htmlFor="search">Search</label>
        <input id="search" className="border rounded p-2" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={() => qc.invalidateQueries({ queryKey: ['crm', 'accounts', search] })}>Search</button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded p-4 space-y-3 max-w-md" aria-labelledby="new-account">
        <h2 id="new-account" className="text-lg font-medium">New Account</h2>
        <div>
          <label className="block text-sm text-gray-600" htmlFor="name">Name</label>
          <input id="name" className="mt-1 w-full border rounded p-2" {...register('name')} />
          {errors.name && <div className="text-sm text-red-600">{errors.name.message}</div>}
        </div>
        <div>
          <label className="block text-sm text-gray-600" htmlFor="phone">Phone</label>
          <InputMask id="phone" mask="(999) 999-9999" className="mt-1 w-full border rounded p-2" placeholder="(555) 123-4567" />
        </div>
        <div>
          <label className="block text-sm text-gray-600" htmlFor="postal">Postal Code</label>
          <InputMask id="postal" mask="99999" className="mt-1 w-full border rounded p-2" placeholder="15222" />
        </div>
        <div>
          <label className="block text-sm text-gray-600" htmlFor="type">Type</label>
          <select id="type" className="mt-1 w-full border rounded p-2" {...register('account_type')}>
            <option value="commercial">Commercial</option>
            <option value="residential">Residential</option>
          </select>
          {errors.account_type && <div className="text-sm text-red-600">{errors.account_type.message as string}</div>}
        </div>
        <button disabled={isSubmitting} className="bg-green-600 text-white px-3 py-2 rounded disabled:opacity-50">Create</button>
      </form>

      {isLoading && <div role="status" aria-live="polite">Loading accounts...</div>}
      {isError && <div className="text-red-600" role="alert">Failed to load accounts</div>}
      {Array.isArray(data) && (
        <div className="space-y-3">
          {data.map((acc: any) => (
            <div key={acc.id} className="bg-white shadow rounded p-4">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{acc.name}</div>
                  <div className="text-sm text-gray-600">Locations: {acc.locations?.length || 0}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => qc.invalidateQueries({ queryKey: ['crm', 'account', acc.id, 'locations'] })}>Refresh Locations</button>
                  <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => createLocation.mutate({ account_id: acc.id, name: 'New Site', address_line1: '100 Test St', city: 'Pittsburgh', state: 'PA', postal_code: '15222' })}>+ Location</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
