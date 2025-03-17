export default function OverviewSection({ data }) {
    return (
      <div className="space-y-8 mb-4">
        {/* Added Services Section */}
        <div className="bg-gray-100 md:p-4 p-2 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Added Services</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium">Delivery Services</h3>
              <a href="#" className="text-blue-600 hover:underline">
                View options
              </a>
            </div>
            <div>
              <h3 className="font-medium">Vehicle inspections by NAS</h3>
              <a href="#" className="text-blue-600 hover:underline">
                Book an inspection
              </a>
            </div>
            <div>
              <h3 className="font-medium">Get a report on this car</h3>
              <a href="#" className="text-blue-600 hover:underline">
                Buy car history report for $25
              </a>
            </div>
          </div>
        </div>
  
        {/* Vehicle Details Section */}
        <div className="text-sm md:text-base">
          <h2 className="text-lg font-bold text-gray-900 mb-4">VEHICLE DETAILS</h2>
          <div className="grid grid-cols-1 border rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 border-b">
              <div className="p-4 bg-gray-100 font-medium">Make</div>
              <div className="p-4">{data.CarSubmission.vehicleMake}</div>
              <div className="p-4 bg-gray-100 font-medium">Engine</div>
              <div className="p-4">{data.CarSubmission.engineCapacity}</div>
            </div>
  
            <div className="grid grid-cols-2 md:grid-cols-4 border-b">
              <div className="p-4 bg-gray-100 font-medium">Model</div>
              <div className="p-4">{data.CarSubmission.vehicleModel}</div>
              <div className="p-4 bg-gray-100 font-medium">Fuel Type</div>
              <div className="p-4">{data.CarSubmission.fuelType}</div>
            </div>
  
            <div className="grid grid-cols-2 md:grid-cols-4 border-b">
              <div className="p-4 bg-gray-100 font-medium">Mileage</div>
              <div className="p-4">
                {data.CarSubmission.mileage} {data.CarSubmission.mileageUnit}
              </div>
              <div className="p-4 bg-gray-100 font-medium">Transmission</div>
              <div className="p-4">{data.CarSubmission.transmission}</div>
            </div>
  
            <div className="grid grid-cols-2 md:grid-cols-4 border-b">
              <div className="p-4 bg-gray-100 font-medium">VIN</div>
              <div className="p-4">{data.CarSubmission.vin}</div>
              <div className="p-4 bg-gray-100 font-medium">Body Style</div>
              <div className="p-4">{data.CarSubmission.bodyType}</div>
            </div>
  
            <div className="grid grid-cols-2 md:grid-cols-4 border-b">
              <div className="p-4 bg-gray-100 font-medium">Title Status</div>
              <div className="p-4">{data.CarSubmission.condition}</div>
              <div className="p-4 bg-gray-100 font-medium">Exterior Color</div>
              <div className="p-4">{data.CarSubmission.exteriorColor}</div>
            </div>
  
            <div className="grid grid-cols-2 md:grid-cols-4 border-b">
              <div className="p-4 bg-gray-100 font-medium">Location</div>
              <div className="p-4">{data.location}</div>
              <div className="p-4 bg-gray-100 font-medium">Status</div>
              <div className="p-4">{data.status}</div>
            </div>
  
            <div className="grid grid-cols-2 md:grid-cols-4">
              <div className="p-4 bg-gray-100 font-medium">Seller</div>
              <div className="p-4">
              {data.CarSubmission.firstname} {data.CarSubmission.lastname}
                <a href={`mailto:${data.CarSubmission.email}`} className="text-blue-600 ml-1 hover:underline p-1 bg-gray-200 rounded border">
                  Contact
                </a>
              </div>
              <div className="p-4 bg-gray-100 font-medium">Seller Type</div>
              <div className="p-4">Private Party</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  