'use client';

import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon, EyeOffIcon, Loader } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Label } from '@radix-ui/react-label';
import { uploadfiletoserver } from '@/app/Actions';

// Fetch all users
const fetchUsers = async () => {
  const response = await fetch(`/api/admin/usermanagement`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  const data = await response.json();
  return data.data;
};

// Add a new user
const addUser = async (user) => {
  const response = await fetch(`/api/admin/usermanagement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return response.json();
};

// Update an existing user
const updateUser = async (user) => {
  const response = await fetch(`/api/admin/usermanagement/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return response.json();
};

// Delete a user
const deleteUser = async (id) => {
  const response = await fetch(`/api/admin/usermanagement/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  return true;
};

export default function UserManagement() {
  // const CurrentUserDetails = localStorage.getItem("adminDetails")
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [image, setimage] = useState()


  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [users, searchTerm]);

  const handleAddUser = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleUpdateUser = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoadingAction(id);
      try {
        await deleteUser(id);
        const updatedUsers = await fetchUsers();
        setUsers(updatedUsers);
        toast.success('User deleted successfully');
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoadingAction(null);
      }
    }
  };

  // Image change handler with Base64 conversion
  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setimage(reader.result); // Set the base64 string
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleImageChange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setLoadingAction('Image')
        const result = await uploadfiletoserver(file)
          setimage(result); 
          setLoadingAction(null)
      }
    };

  // Submit handler with image as base64
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());

    // Include the base64 image in the userData object
    if (image) {
      userData.image = image;
    }

    setLoadingAction('form');
    // try {
    if (currentUser) {
      const response = await updateUser({ ...currentUser, ...userData });
      const data = response
      if (data.success) {
        toast.success('User Updated successfully');
        const updatedUsers = await fetchUsers();
        setUsers(updatedUsers);
        setIsModalOpen(false);
      }
      else {
        toast.error(data.message);
      }
    } else {
      const response = await addUser(userData);
      const data = response
      if (data.success) {
        toast.success('User added successfully');
        const updatedUsers = await fetchUsers();
        setUsers(updatedUsers);
        setIsModalOpen(false);
      }
      else {
        toast.error(data.message);
      }
    }

    setLoadingAction(null)
    // } catch (err) {
    //   toast.error(err.message);
    // } finally {
    //   setLoadingAction(null);
    // }
  };


  return (
    <div>

      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-auto"
          />
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddUser} className="bg-indigo-600">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{currentUser ? 'Update User' : 'Add User'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-3 gap-4 mb-4">

                  {['name', 'username', 'email', 'password', 'bio', 'phoneNo', 'country', 'province', 'city', 'zipcode', 'address'].map((field) => (
                    <div key={field} className="relative">
                      <label htmlFor={field} className="block text-sm font-medium">
                        {field === 'province' ? 'State/Province' : field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <Input
                        type={field === 'password' && !showPassword ? 'password' : field === 'phoneNo' ? 'number' : 'text'}
                        name={field}
                        defaultValue={field === 'password' ? '' : currentUser?.[field] || ''}
                      />
                      {field === 'password' && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="btn btn-icon absolute top-[50%] right-4"
                        >
                          {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="col-span-1">
                    <Label htmlFor="type" className="block text-sm font-medium text-gray-800">
                      Select Role
                    </Label>
                    <Select name="type" defaultValue={currentUser?.type || 'customer'} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                      {currentUser?.type==='admin'?<SelectItem value="admin">Admin</SelectItem>:<>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="seller">Seller</SelectItem>
                      </>}
                       
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='flex col-span-1 flex-col justify-end'>
                    <label htmlFor='image' className="block text-sm font-medium">Profile Image</label>
                    <Input
                      type='file'
                      accept='image/*'
                      name='image'
                      onChange={handleImageChange}
                      placeholder='Choose Profile Picture'
                    />

                    <div className='size-40  border-2 border-dashed '>
                      {loadingAction==='Image'?<>Uploading<Loader className='animate-spin ml-1'/></>:image ? (
                        <img
                          src={image}
                          alt="Profile Preview"
                          className="w-full h-full object-cover "
                        />
                      ) : (
                        <div className="flex w-full text-center h-full justify-center items-center text-gray-500">No image selected</div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-1">
                    <Label htmlFor="status" className="block text-sm font-medium text-gray-800">
                      Select Status
                    </Label>
                    <Select name="status" defaultValue={currentUser?.status || 'pending'} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="deactive">De-Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-start mt-6 space-x-2">
                    <Input
                      type="checkbox"
                      id="verified"
                      name="verified"
                      defaultChecked={currentUser?.verified || false}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="verified"
                      className="text-sm font-medium flex items-center text-gray-800"
                    >
                      Verified
                    </label>
                  </div>

                </div>
                <Button type="submit" className="w-full" disabled={loadingAction === 'form'||loadingAction==='Image'}>
                  {loadingAction === 'form' && <Loader className="mr-2 animate-spin" />}
                  {currentUser ? 'Update' : 'Add'} User
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
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell><img src={user.image} className='h-12' /> </TableCell>
                    <TableCell>{user.name} </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.type}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleUpdateUser(user)} variant="ghost">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteUser(user.id)}
                        variant="ghost"
                        className="text-red-600"
                        disabled={loadingAction === user.id}
                      >
                        {loadingAction === user.id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                          {user.type==='admin'?'':<TrashIcon className="h-4 w-4" />}
                          </>                          
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
