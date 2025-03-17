'use client';

import { useState, useEffect } from 'react';
import { CarTable } from './component/CarTable';
import { CarFormModal } from './component/CarFormModal';
import { CarDetailsDialog } from './component/CarDetailsDialog';
import { Button } from '@/components/ui/button';
import { PlusIcon, Loader } from 'lucide-react';
import { toast } from 'sonner'; 
import { convertToBase64 } from '@/utils/base64converter';

export default function CarManagement() {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);

  useEffect(() => {
    fetchCars();
    fetchBrands();
  }, []);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/carmanagement`);
      const data = await response.json();
      setCars(data.data);
    } catch (error) {
      toast.error('Failed to fetch cars');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(`/api/admin/brandmanagement`);
      const data = await response.json();
      console.log("Fetched brands are, ", data)
      setBrands(data.data);
    } catch (error) {
      toast.error('Failed to fetch brands');
    }
  };

  const handleAddCar = () => {
    setCurrentCar(null);
    setIsModalOpen(true);
  };

  const handleEditCar = (car) => {
    setCurrentCar(car);
    setIsModalOpen(true);
  };

  const handleViewCar = (car) => {
    setSelectedCar(car);
    setIsDetailsDialogOpen(true);
  };

  const handleDeleteCar = async (carId) => {
    try {
      setLoadingAction(carId);
      await fetch(`/api/admin/carmanagement/${carId}`, { method: 'DELETE' });
      toast.success('Car deleted successfully');
      fetchCars();
    } catch (error) {
      toast.error('Failed to delete car');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSubmit = async (formData, selectedImages, existingImages) => {
    try {
      setLoadingAction('form');
      const newImages = [...selectedImages];
      const base64Images = await Promise.all(newImages.map(async (img) => {
        const base64 = await convertToBase64(img.file);
        return { url: base64, type: img.type };
      }));

      const carData = {
        name: formData.get('name'),
        description: formData.get('description'),
        highlights: formData.get('highlights'),
        specs: formData.get('specs'),
        chasisNo: formData.get('chasisNo'),
        exterior: formData.get('exterior'),
        interior: formData.get('interior'),
        lotNo: formData.get('lotNo'),
        location: formData.get('location'),
        mileage: formData.get('mileage'),
        orientation: formData.get('orientation'),
        status: formData.get('status'),
        brandId: formData.get('brandId'),
        images: [
          ...existingImages,
          ...base64Images
        ],
      };

      if (currentCar) {
        await fetch(`$/admin/carmanagement/${currentCar.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(carData),
        });
        toast.success('Car updated successfully');
      } else {
        await fetch(`/api/admin/carmanagement`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(carData),
        });
        toast.success('Car added successfully');
      }

      fetchCars();
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      
      <h1 className="text-2xl font-bold mb-4">Car Management</h1>
      <Button onClick={handleAddCar} className="mb-4">
        <PlusIcon className="mr-2 h-4 w-4" /> Add New Car
      </Button>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-8 w-8" />
        </div>
      ) : (
        <CarTable
          cars={cars}
          onEdit={handleEditCar}
          onDelete={handleDeleteCar}
          onView={handleViewCar}
          loadingAction={loadingAction}
        />
      )}
      <CarFormModal
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        currentCar={currentCar}
        brands={brands}
        
        onSubmit={handleSubmit}
        loadingAction={loadingAction}
      />
      <CarDetailsDialog
        car={selectedCar}
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
      />
    </div>
  );
}

