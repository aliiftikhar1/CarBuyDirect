'use client';

import { toast, ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon,PlusIcon,EyeIcon } from 'lucide-react';
import { EyeOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader } from 'lucide-react'; 
import 'react-toastify/dist/ReactToastify.css';

// Fetch all accounts
const fetchAccounts = async () => {
  const response = await fetch(`/api/admin/bankaccountmanagement`);
  if (!response.ok) {
    throw new Error('Failed to fetch accounts');
  }
  const data = await response.json();
  console.log("data",data.data)
  return data.data;
};

// Add a new account
const addAccount = async (account) => {
  const response = await fetch(`/api/admin/bankaccountmanagement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account),
  });
  if (!response.ok) {
    throw new Error('Failed to add account');
  }
  return response.json();
};

// Update an existing account
const updateAccount = async (account) => {
  const response = await fetch(`/api/admin/bankaccountmanagement/${account.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account),
  });
  if (!response.ok) {
    throw new Error('Failed to update account');
  }
  return response.json();
};

// Delete a account
const deleteAccount = async (id) => {
  const response = await fetch(`/api/admin/bankaccountmanagement/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to delete account');
  }
  return true;
};

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Track password visibility


  useEffect(() => {
    fetchAccounts()
      .then(setAccounts)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setFilteredAccounts(
      accounts.filter(
        (account) =>
          account.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.bank_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.account_number.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [accounts, searchTerm]);

  const handleAddAccount = () => {
    setCurrentAccount(null);
    setIsModalOpen(true);
  };

  const handleUpdateAccount = (account) => {
    setCurrentAccount(account);
    setIsModalOpen(true);
  };

  const handleDeleteAccount = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      setLoadingAction(id);
      try {
        await deleteAccount(id);
        const updatedAccounts = await fetchAccounts();
        setAccounts(updatedAccounts);
        toast.success('Account deleted successfully');
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const accountData = Object.fromEntries(formData.entries());

    setLoadingAction('form');
    try {
      if (currentAccount) {
        const updatedAccount = await updateAccount({ ...currentAccount, ...accountData });
        toast.success('Account updated successfully');
      } else {
        const newAccount = await addAccount(accountData);
        toast.success('Account added successfully');
      }
      // Fetch updated account list
      const updatedAccounts = await fetchAccounts();
      setAccounts(updatedAccounts);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const approveAccount = async (id) => {
    const response = await fetch(`/api/admin/account/approve/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Failed to approve account');
    }
    return response.json();
  };

  return (
    <div>
      <ToastContainer />
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <Input
            type="text"
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-auto"
          />
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddAccount} className="bg-indigo-600">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl ">
              <DialogHeader>
                <DialogTitle>{currentAccount ? 'Update Account' : 'Add Account'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="">
                <div className='grid grid-cols-2 gap-4 mb-4'>
                  {['title','bank_name', 'account_number'].map((field) => (
                    <div key={field} className='relative'>
                      <label htmlFor={field} className="block text-sm font-medium">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <Input
                        type='text'
                        name={field}
                        defaultValue={currentAccount?.[field]}
                      />
                    </div>
                  ))}


                </div>
                <Button type="submit" className="w-full" disabled={loadingAction === 'form'}>
                  {loadingAction === 'form' && <Loader className="mr-2 animate-spin" />}
                  {currentAccount ? 'Update' : 'Add'} Account
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="overflow-auto max-h-[72vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Bank Name</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account, index) => (
                  <TableRow key={account.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{account.title} {account.lastname}</TableCell>
                    <TableCell>{account.bank_name}</TableCell>
                    <TableCell>{account.account_number}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleUpdateAccount(account)} variant="ghost">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteAccount(account.id)}
                        variant="ghost"
                        className="text-red-600"
                        disabled={loadingAction === account.id}
                      >
                        {loadingAction === account.id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <TrashIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
