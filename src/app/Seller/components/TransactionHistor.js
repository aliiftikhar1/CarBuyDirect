"use client";

import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography } from "@mui/material";

const transactions = [
    { id: "TXN001", date: "2025-03-10", amount: 250, type: "Deposit", status: "Completed" },
    { id: "TXN002", date: "2025-03-09", amount: 150, type: "Withdrawal", status: "Pending" },
    { id: "TXN003", date: "2025-03-08", amount: 500, type: "Deposit", status: "Failed" },
    { id: "TXN004", date: "2025-03-07", amount: 120, type: "Withdrawal", status: "Completed" },
];

const TransactionHistory = () => {
    return (
        <div className="container mx-auto p-6">
            <Typography variant="h5" className="font-semibold mb-4">
                Transaction History
            </Typography>

            <TableContainer component={Paper} className="shadow-lg">
                <Table>
                    <TableHead className="bg-gray-100">
                        <TableRow>
                            <TableCell className="font-bold">Transaction ID</TableCell>
                            <TableCell className="font-bold">Date</TableCell>
                            <TableCell className="font-bold">Amount ($)</TableCell>
                            <TableCell className="font-bold">Type</TableCell>
                            <TableCell className="font-bold">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((txn) => (
                            <TableRow key={txn.id}>
                                <TableCell>{txn.id}</TableCell>
                                <TableCell>{txn.date}</TableCell>
                                <TableCell className="font-semibold">${txn.amount}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={txn.type}
                                        color={txn.type === "Deposit" ? "primary" : "secondary"}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={txn.status}
                                        color={txn.status === "Completed" ? "success" : txn.status === "Pending" ? "warning" : "error"}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default TransactionHistory;
