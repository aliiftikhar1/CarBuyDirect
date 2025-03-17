import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function AdminHomePage() {
    return (
        <div className=" bg-white p-6 h-[70vh] flex justify-center items-center">
            <Head>
                <title>Admin Panel - Home</title>
            </Head>

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Welcome to Admin Panel</h1>
                <p className="text-gray-600">Manage your eCommerce website efficiently</p>
            </header>

            {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <Card>
                    <CardHeader>
                        <CardTitle>Website Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Visitors</p>
                                <p className="text-xl font-bold">12,345</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Sales</p>
                                <p className="text-xl font-bold">$45,678</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Orders</p>
                                <p className="text-xl font-bold">789</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableCaption>A list of your recent invoices.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Invoice</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">INV001</TableCell>
                                        <TableCell>Paid</TableCell>
                                        <TableCell>Credit Card</TableCell>
                                        <TableCell className="text-right">$250.00</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <Button className="w-full">Add New Product</Button>
                            <Button className="w-full">Manage Categories</Button>
                            <Button className="w-full">View Reports</Button>
                        </div>
                    </CardContent>
                </Card>
            </div> */}
        </div>
    );
}
