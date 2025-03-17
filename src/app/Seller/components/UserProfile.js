"use client"
import { useEffect, useState } from "react";

const UserProfile = ({ userId }) => {
    const [userStatus, setUserStatus] = useState("");
    const [stripeVerificationStatus, setStripeVerificationStatus] = useState("");
    const [cardDetails, setCardDetails] = useState(null);

    useEffect(() => {
        // Fetch User Status & Stripe Verification Status
        const fetchUserStatus = async () => {
            const response = await fetch(`/api/user/${userId}/status`);
            const data = await response.json();
            if (data.success) {
                setUserStatus(data.userStatus);
                setStripeVerificationStatus(data.stripeVerificationStatus);
            }
        };

        // Fetch Stripe Card Details
        const fetchCardDetails = async () => {
            const response = await fetch(`/api/user/${userId}/cards`);
            const data = await response.json();
            if (data.success) {
                setCardDetails(data.cardDetails);
            }
        };

        fetchUserStatus();
        fetchCardDetails();
    }, [userId]);

    return (
        <div>
            <h1>User Profile</h1>
            <div>
                <strong>Status:</strong> {userStatus}
            </div>
            <div>
                <strong>Stripe Verification Status:</strong> {stripeVerificationStatus}
            </div>

            {cardDetails ? (
                <div>
                    <h3>Card Details</h3>
                    <p><strong>Brand:</strong> {cardDetails.brand}</p>
                    <p><strong>Last 4 Digits:</strong> {cardDetails.last4}</p>
                    <p><strong>Expiration:</strong> {cardDetails.exp_month}/{cardDetails.exp_year}</p>
                </div>
            ) : (
                <p>No card details available.</p>
            )}
        </div>
    );
};

export default UserProfile;
