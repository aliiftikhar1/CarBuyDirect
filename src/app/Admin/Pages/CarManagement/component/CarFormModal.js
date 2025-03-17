import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import dynamic from "next/dynamic"
const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
});

export function CarFormModal({ isOpen, setIsModalOpen, currentCar, cars, brands }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loadingAction, setLoadingAction] = useState(null);
  const [editorContent, setEditorContent] = useState({
    description: currentCar?.description || '',
    highlights: currentCar?.highlights || '',
    specs: currentCar?.specs || '',
  });

  useEffect(() => {
    if (currentCar) {
      setExistingImages(currentCar.Images || []);
      setEditorContent({
        description: currentCar.description || '',
        highlights: currentCar.highlights || '',
        specs: currentCar.specs || '',
      });
    } else {
      setExistingImages([]);
      setEditorContent({
        description: '',
        highlights: '',
        specs: '',
      });
    }
    setSelectedImages([]);
  }, [currentCar]);

  const handleImageSelect = (e, type) => {
    const files = Array.from(e.target.files);
    setSelectedImages([...selectedImages, ...files.map((file) => ({ file, type }))]);
  };

  const handleRemoveSelectedImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const newImages = [...selectedImages];
      const base64Images = await Promise.all(newImages.map(async (img) => {
        const base64 = await convertToBase64(img.file);
        return { url: base64, type: img.type };
      }));

      const carData = {
        name: formData.get('name'),
        description: editorContent.description,
        highlights: editorContent.highlights,
        specs: editorContent.specs,
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

      setLoadingAction('form');
      if (currentCar) {
        await fetch(`/api/admin/carmanagement/${currentCar.id}`, {
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

      // const response = await fetch('/api/admin/carmanagement');
      // const updatedCars = await response.json();
      // setCars(updatedCars);
      setIsModalOpen(false);
      setSelectedImages([]);
      setExistingImages([]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className=" max-w-5xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{currentCar ? 'Edit Car' : 'Add New Car'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="gap-4 grid grid-cols-4">
        {['name', 'chasisNo', 'exterior', 'interior'].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input
                id={field}
                name={field}
                defaultValue={currentCar?.[field] || ''}
              />
            </div>
          ))}
          {['description', 'highlights', 'specs'].map((field) => (
            <div key={field} className="col-span-4">
              <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <JoditEditor
                value={editorContent[field]}
                config={{
                  readonly: false,
                  height: 300,
                }}
                onBlur={(newContent) => setEditorContent(prev => ({ ...prev, [field]: newContent }))}
              />
            </div>
          ))}
          {[ 'lotNo', 'location', 'mileage', 'orientation', 'status'].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input
                id={field}
                name={field}
                defaultValue={currentCar?.[field] || ''}
              />
            </div>
          ))}
          <div>
            <Label htmlFor="brandId">Brand</Label>
            <Select name="brandId" defaultValue={currentCar?.brandId || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {["EXTERIOR", "INTERIOR", "MECHANICAL", "DOCUMENTATION", "OTHER"].map((type) => (
            <div key={type} className="mt-2">
              <Label htmlFor={`images-${type}`}>{type} Images</Label>
              <Input
                id={`images-${type}`}
                type="file"
                onChange={(e) => handleImageSelect(e, type)}
                multiple
              />
            </div>
          ))}
         
          <Button type="submit" disabled={loadingAction === 'form'}>
            {loadingAction === 'form' ? 'Saving...' : 'Save'}
          </Button>
        </form>
        <div className="mt-2 flex flex-wrap gap-2">
            {existingImages.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={`data:image/jpeg;base64,${image.url}`}
                  alt={`Existing image ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-cover rounded"
                />
                <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-br">
                  {image.type}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        <div className='flex gap-4'>
        {selectedImages.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={URL.createObjectURL(image.file) || "/placeholder.svg"}
                  alt={`Selected image ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-cover rounded"
                />
                <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-br">
                  {image.type}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveSelectedImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}  
        </div>
      </DialogContent>
    </Dialog>
  );
}

