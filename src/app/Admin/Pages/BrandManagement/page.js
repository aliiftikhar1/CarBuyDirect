'use client';

import { toast, ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';
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
import Image from 'next/image';
import { uploadfiletoserver } from '@/app/Actions';



export default function BrandManagement() {
  const [brands, setBrands] = useState([]);
  const [filteredbrands, setFilteredbrands] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentbrand, setCurrentbrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);

  // Fetch all brands
  const fetchBrands = async () => {
    const response = await fetch(`/api/admin/brandmanagement`);
    if (!response.ok) {
      throw new Error('Failed to fetch brands');
    }
    const data = await response.json();
    return data.data;
  };

  // Add a new brand
  const addBrand = async (brand) => {
    const response = await fetch(`/api/admin/brandmanagement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brand),
    });
    if (!response.ok) {
      throw new Error('Failed to add brand');
    }
    return response.json();
  };

  const handleUpdateBrand = (brand) => {
    setCurrentbrand(brand); // Set the selected brand as the current one
    setIsModalOpen(true); // Open the modal for editing
  };

  // Update an existing brand
  const updateBrand = async (brand) => {
    const response = await fetch(`/api/admin/brandmanagement/${brand.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(brand),
    });
    if (!response.ok) {
      throw new Error('Failed to update brand');
    }
    return response.json();
  };

  // Delete a brand
  const deleteBrand = async (id) => {
    const response = await fetch(`/api/admin/brandmanagement/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error('Failed to delete brand');
    }
    return true;
  };


useEffect(() => {
  fetchBrands()
    .then(setBrands)
    .catch((err) => toast.error(err.message))
    .finally(() => setIsLoading(false));
}, []);

useEffect(() => {
  setFilteredbrands(
    brands.filter((brand) =>
      [brand.name, brand.description].some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  );
}, [brands, searchTerm]);

const handleAddBrand = () => {
  setCurrentbrand(null);
  setIsModalOpen(true);
};

const handleDeleteBrand = async (id) => {
  if (window.confirm('Are you sure you want to delete this brand?')) {
    setLoadingAction(id);
    try {
      await deleteBrand(id);
      const updatedBrands = await fetchBrands();
      setBrands(updatedBrands);
      toast.success('Brand deleted successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingAction(null);
    }
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoadingAction('image');

  const formData = new FormData(e.target);
  const selectedImage = formData.get('image'); // Get the selected image file

  try {
    let imageUrl = '';

    // If there's a selected image, upload it to the server
    if (selectedImage) {
      imageUrl = await uploadfiletoserver(selectedImage); // Get the uploaded image URL
    }

    const brandData = {
      name: formData.get('name'),
      description: formData.get('description'),
      image: imageUrl, // Use the uploaded image URL
    };

    setLoadingAction('form');
    if (currentbrand) {
      await updateBrand({ ...currentbrand, ...brandData });
      toast.success('Brand updated successfully');
    } else {
      await addBrand(brandData);
      toast.success('Brand added successfully');
    }

    const updatedBrands = await fetchBrands();
    setBrands(updatedBrands);
    setIsModalOpen(false);
  } catch (err) {
    toast.error(err.message);
  } finally {
    setLoadingAction(null);
  }
};

  return (
    <div>
      <ToastContainer />
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <Input
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-auto"
          />
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddBrand} className="bg-indigo-600">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Brand
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl ">
              <DialogHeader>
                <DialogTitle>
                  {currentbrand ? 'Update Brand' : 'Add Brand'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {['name', 'description'].map((field) => (
                    <div key={field} className="relative">
                      <label
                        htmlFor={field}
                        className="block text-sm font-medium"
                      >
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <Input
                        type="text"
                        name={field}
                        defaultValue={currentbrand?.[field]}
                      />
                    </div>
                  ))}

                  <div key="image" className="relative">
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium"
                    >
                      Image
                    </label>
                    <Input type="file" name="image" />
                  </div>

                </div>
                <Button type="submit" className="w-full" disabled={loadingAction === 'form' || loadingAction === 'image'}>
                  {(loadingAction === 'form' || loadingAction === 'image') && <Loader className="mr-2 animate-spin" />}
                  {currentbrand ? 'Update' : 'Add'} Brand
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

                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredbrands.map((brand, index) => (
                  <TableRow key={brand.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <img
                        width={1000}
                        height={1000}
                        src={brand.image || '/placeholder.jpg'}
                        alt="Brand"
                        className="max-h-32 max-w-36 object-contain"
                      />
                    </TableCell>

                    <TableCell>{brand.name}</TableCell>
                    <TableCell>{brand.description}</TableCell>
                    <TableCell>
                      {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      }).format(new Date(brand.createdAt))}
                    </TableCell>
                    <TableCell>
                      {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      }).format(new Date(brand.updatedAt))}
                    </TableCell>

                    <TableCell>
                      <Button
                        onClick={() => handleUpdateBrand(brand)}
                        variant="ghost"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteBrand(brand.id)}
                        variant="ghost"
                        className="text-red-600"
                        disabled={loadingAction === brand.id}
                      >
                        {loadingAction === brand.id ? (
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
