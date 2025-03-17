import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
  import Image from "next/image";
  
  export function CarDetailsDialog({ car, isOpen, onClose }) {
    if (!car) return null;
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{car.name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Car Images Section */}
            <div>
              <h3 className="font-semibold mb-2">Car Images</h3>
              <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-auto">
                {car.Images &&
                  car.Images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={`data:image/jpeg;base64,${image.url}`}
                        alt={`Car image ${index + 1}`}
                        width={1000}
                        height={1000}
                        className="object-cover rounded"
                      />
                      <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-br">
                        {image.type}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
  
            {/* Car Details Section */}
            <div>
              <h3 className="font-semibold mb-2">Car Details</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Attribute</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { label: "Brand", value: car.Brand?.name },
                    { label: "Chasis No", value: car.chasisNo },
                    { label: "Exterior", value: car.exterior },
                    { label: "Interior", value: car.interior },
                    { label: "Lot No", value: car.lotNo },
                    { label: "Location", value: car.location },
                    { label: "Mileage", value: car.mileage },
                    { label: "Orientation", value: car.orientation },
                    { label: "Status", value: car.status },
                  ].map((item) => (
                    <TableRow key={item.label}>
                      <TableCell>{item.label}</TableCell>
                      <TableCell>{item.value || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
  
          {/* Description, Highlights, and Specs */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Description</h3>
            <p>{car.description}</p>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Highlights</h3>
            <p>{car.highlights}</p>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Specs</h3>
            <p>{car.specs}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  