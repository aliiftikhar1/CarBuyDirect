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
  
  export function ProductDetailsDialog({ product, isOpen, onClose }) {
    if (!product) return null;
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {/* Product Images Section */}
            <div>
              {/* <h3 className="font-semibold mb-2">Product Images</h3> */}
              <div className="grid grid-cols-1 max-h-[60vh] overflow-auto">
                {product.ProductImages &&
                  product.ProductImages.map((image, index) => (
                    <>
                    <h2 className="capitalize">{image.type} image</h2>
                    <Image
                      key={index}
                      src={image.image}
                      alt={`Product image ${index + 1}`}
                      width={1000}
                      height={1000}
                      className="object-cover rounded"
                    />
                    </>
                  ))}
              </div>
            </div>
  
          
            <div>
              <h3 className="font-semibold mb-2">Product Details</h3>
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Attribute</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Price</TableCell>
                    <TableCell>${product.price}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>{product.status}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell className="line-clamp-2">{product.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>{product.Category?.name || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Subcategory</TableCell>
                    <TableCell>{product.Subcategory?.name || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Featured</TableCell>
                    <TableCell>{product.isfeatured ? "Yes" : "No"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Top Rated</TableCell>
                    <TableCell>{product.istoprated ? "Yes" : "No"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Top Selling</TableCell>
                    <TableCell>{product.istopselling ? "Yes" : "No"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Discounted</TableCell>
                    <TableCell>{product.isdiscounted ? "Yes" : "No"}</TableCell>
                  </TableRow>
                  {product.isdiscounted && (
                    <TableRow>
                      <TableCell>Discount</TableCell>
                      <TableCell>{product.discount}%</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  