"use client";

import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const BalanceOverview = () => {
  return (
    <div className="container mx-auto p-6">
      {/* Withdraw Button */}
      <div className="flex justify-between items-center mb-6">
      <Typography variant="h5" className="font-semibold mb-4">
        Balance Overview
      </Typography>
        <Button
          variant="contained"
          color="primary"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Withdraw Funds
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available Balance */}
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-center text-center">
            <AccountBalanceWalletIcon className="text-green-600 mb-2" fontSize="large" />
            <Typography variant="h6">Available Balance</Typography>
            <Typography variant="h5" className="font-bold">$1,250.00</Typography>
          </CardContent>
        </Card>

        {/* Pending Balance */}
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-center text-center">
            <HourglassBottomIcon className="text-yellow-600 mb-2" fontSize="large" />
            <Typography variant="h6">Pending Balance</Typography>
            <Typography variant="h5" className="font-bold">$320.00</Typography>
          </CardContent>
        </Card>

        {/* Total Earnings */}
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-center text-center">
            <MonetizationOnIcon className="text-blue-600 mb-2" fontSize="large" />
            <Typography variant="h6">Total Earnings</Typography>
            <Typography variant="h5" className="font-bold">$5,780.00</Typography>
          </CardContent>
        </Card>
      </div>

      
    </div>
  );
};

export default BalanceOverview;
