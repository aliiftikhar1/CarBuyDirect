import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';

export function CarTable({ cars, onEdit, onDelete, onView }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Chasis No</TableHead>
          <TableHead>Mileage</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cars.map((car) => (
          <TableRow key={car.id}>
            <TableCell>{car.name}</TableCell>
            <TableCell>{car.Brand?.name || 'N/A'}</TableCell>
            <TableCell>{car.chasisNo}</TableCell>
            <TableCell>{car.mileage}</TableCell>
            <TableCell>{car.status}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => onView(car)}>
                  <EyeIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onEdit(car)}>
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDelete(car.id)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

