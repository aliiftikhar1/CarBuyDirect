// // "use client";

// // import React, { useState } from 'react';
// // import {
// //     Dialog,
// //     DialogContent,
// //     DialogDescription,
// //     DialogHeader,
// //     DialogTitle,
// // } from "@/components/ui/dialog"
// // import { useSelector } from 'react-redux';
// // import BalanceOverview from '../../components/BalanceOverview';
// // import TransactionHistory from '../../components/TransactionHistor';
// // function Page() {
// //     const user = useSelector((data) => data.CarUser.userDetails)
// //     console.log(user)
// //     const [showForm, setShowForm] = useState(false);
// //     const [formaData, setFormData] = useState({
// //         userId: user.id,
// //         fullName,
// //         email,
// //         businessType,
// //         country,
// //         phoneNumber,
// //     })


// //     const handleSubmit = async (e) => {
// //         e.preventDefault();

// //         const formData = {
// //             userId: user.id,
// //             fullName,
// //             email,
// //             businessType,
// //             country,
// //             phoneNumber,
// //         };

// //         console.log("formData", formData)
// //         // const response = await fetch("/api/create-stripe-account", {
// //         //     method: "POST",
// //         //     headers: { "Content-Type": "application/json" },
// //         //     body: JSON.stringify(formData),
// //         // });

// //         // const data = await response.json();
// //         // if (data.success) {
// //         //     window.location.href = data.accountLink.url;  // Redirect to Stripe onboarding
// //         // } else {
// //         //     alert(data.error);
// //         // }
// //     };

// //     return (
// //         <>
// //             <div className="container mx-auto p-6">
// //                 <div className="bg-white shadow-lg rounded-lg p-6">
// //                     <div className='flex items-center justify-between'>
// //                         <h5 className="text-xl font-semibold mb-4">Payment Setup</h5>
// //                         <button
// //                             className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
// //                             onClick={() => setShowForm(true)}
// //                         >
// //                             Setup Payment Account
// //                         </button>
// //                         <Dialog open={showForm} onOpenChange={setShowForm} className="p-4">
// //                             <DialogContent className="max-w-xs md:max-w-sm p-4">
// //                                 <DialogHeader>
// //                                     <DialogDescription className="text-center">
// //                                         <DialogTitle className="text-center text-2xl">Set Up Your Payment</DialogTitle>
// //                                         <DialogDescription className="text-center">
// //                                             Please provide the necessary details to set up your Stripe Express account for receiving payments.
// //                                         </DialogDescription>
// //                                     </DialogDescription>
// //                                 </DialogHeader>
// //                                 <div className="mt-6">
// //                                     <form className="space-y-4" onSubmit={handleSubmit}>
// //                                         <div>
// //                                             <label className="block text-gray-700">Full Name</label>
// //                                             <input
// //                                                 type="text"
// //                                                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
// //                                                 placeholder="Enter full name"
// //                                                 required
// //                                                 onChange={(e)=>{setFormData({})}}
// //                                             />
// //                                         </div>
// //                                         <div>
// //                                             <label className="block text-gray-700">Email</label>
// //                                             <input
// //                                                 type="email"
// //                                                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
// //                                                 placeholder="Enter email"
// //                                                 required
// //                                             />
// //                                         </div>
// //                                         <div>
// //                                             <label className="block text-gray-700">Business Type</label>
// //                                             <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black" required>
// //                                                 <option value='individual'>Individual</option>
// //                                                 <option value='company'>Company</option>
// //                                             </select>
// //                                         </div>
// //                                         <div>
// //                                             <label className="block text-gray-700">Country</label>
// //                                             <input
// //                                                 type='text'
// //                                                 className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-black'
// //                                                 placeholder='Enter country'
// //                                                 required
// //                                             />
// //                                         </div>
// //                                         <div>
// //                                             <label className="block text-gray-700">Phone Number</label>
// //                                             <input
// //                                                 type="tel"
// //                                                 className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
// //                                                 placeholder="Enter phone number"
// //                                                 required
// //                                             />
// //                                         </div>
// //                                         <div className="flex justify-end space-x-2">
// //                                             <button
// //                                                 type='button'
// //                                                 className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
// //                                                 onClick={() => setShowForm(false)}
// //                                             >
// //                                                 Cancel
// //                                             </button>
// //                                             <button
// //                                                 type='submit'
// //                                                 className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
// //                                             >
// //                                                 Submit
// //                                             </button>
// //                                         </div>
// //                                     </form>
// //                                 </div>
// //                             </DialogContent>
// //                         </Dialog>
// //                     </div>
// //                 </div>
// //             </div>
// //             <BalanceOverview />
// //             <TransactionHistory />
// //         </>
// //     );
// // }

// // export default Page;

// "use client";

// import React, { useState } from 'react';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import { useSelector } from 'react-redux';
// import BalanceOverview from '../../components/BalanceOverview';
// import TransactionHistory from '../../components/TransactionHistor';

// function Page() {
//     const user = useSelector((data) => data.CarUser.userDetails);
//     console.log(user);

//     const [showForm, setShowForm] = useState(false);
//     const [formData, setFormData] = useState({
//         userId: user?.id || "",
//         fullName: "",
//         email: "",
//         businessType: "individual",
//         country: "",
//         phoneNumber: "",
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         console.log("formData", formData);

//         try {
//             const response = await fetch("/api/user/create-stripe-account", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(formData),
//             });

//             const data = await response.json();
//             if (data.success) {
//                 window.location.href = data.accountLink.url;  // Redirect to Stripe onboarding
//             } else {
//                 alert(data.error);
//             }
//         } catch (error) {
//             console.error("Error submitting form:", error);
//         }
//     };

//     return (
//         <>
//             <div className="container-fluid w-100 w-full mx-auto p-6">
//                 <div className="bg-white shadow-lg rounded-lg p-6">
//                     <div className='flex items-center justify-between'>
//                         <h5 className="text-xl font-semibold mb-4">Payment Setup</h5>
//                         <button
//                             className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
//                             onClick={() => setShowForm(true)}
//                         >
//                             Setup Payment Account
//                         </button>
//                     </div>
//                     <Dialog open={showForm} onOpenChange={setShowForm} className="p-4">
//                         <DialogContent className="max-w-xs md:max-w-sm p-4">
//                             <DialogHeader>
//                                 <DialogTitle className="text-center text-2xl">Set Up Your Payment</DialogTitle>
//                                 <DialogDescription className="text-center">
//                                     Please provide the necessary details to set up your Stripe Express account for receiving payments.
//                                 </DialogDescription>
//                             </DialogHeader>
//                             <div className="mt-6">
//                                 <form className="space-y-4" onSubmit={handleSubmit}>
//                                     <div>
//                                         <label className="block text-gray-700">Full Name</label>
//                                         <input
//                                             type="text"
//                                             name="fullName"
//                                             value={formData.fullName}
//                                             onChange={handleChange}
//                                             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
//                                             placeholder="Enter full name"
//                                             required
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-gray-700">Email</label>
//                                         <input
//                                             type="email"
//                                             name="email"
//                                             value={formData.email}
//                                             onChange={handleChange}
//                                             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
//                                             placeholder="Enter email"
//                                             required
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-gray-700">Business Type</label>
//                                         <select
//                                             name="businessType"
//                                             value={formData.businessType}
//                                             onChange={handleChange}
//                                             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
//                                             required
//                                         >
//                                             <option value='individual'>Individual</option>
//                                             <option value='company'>Company</option>
//                                         </select>
//                                     </div>
//                                     <div>
//                                         <label className="block text-gray-700">Country</label>
//                                         <select
//                                             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
//                                             required
//                                             onChange={(e) => setFormData({ ...formData, country: e.target.value })}
//                                         >
//                                             <option value="PK">Pakistan</option>
//                                             <option value="US">United States</option>
//                                             <option value="GB">United Kingdom</option>
//                                             <option value="IN">India</option>
//                                             <option value="CA">Canada</option>
//                                             <option value="AU">Australia</option>
//                                         </select>
//                                     </div>

//                                     <div>
//                                         <label className="block text-gray-700">Phone Number</label>
//                                         <input
//                                             type="tel"
//                                             name="phoneNumber"
//                                             value={formData.phoneNumber}
//                                             onChange={handleChange}
//                                             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
//                                             placeholder="Enter phone number"
//                                             required
//                                         />
//                                     </div>
//                                     <div className="flex justify-end space-x-2">
//                                         <button
//                                             type='button'
//                                             className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
//                                             onClick={() => setShowForm(false)}
//                                         >
//                                             Cancel
//                                         </button>
//                                         <button
//                                             type='submit'
//                                             className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
//                                         >
//                                             Submit
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </DialogContent>
//                     </Dialog>
//                 </div>
//             </div>
//             {user.type == 'seller' && user.stripeAccountId ?
//                 (
//                     <>
//                         <BalanceOverview />
//                         <TransactionHistory />
//                     </>

//                 ) : (
//                     <>
//                     <p>Not Payment Method Add </p>
//                     </>
//                 )
//             }
//         </>
//     );
// }

// export default Page;


"use client";

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useSelector } from 'react-redux';
import BalanceOverview from '../../components/BalanceOverview';
import TransactionHistory from '../../components/TransactionHistor';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import UserProfile from '../../components/UserProfile';

function Page() {
    const user = useSelector((data) => data.CarUser.userDetails);
    console.log(user)
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        userId: user?.id || "",
        fullName: "",
        email: "",
        businessType: "individual",
        country: "",
        phoneNumber: "",
        cardName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });
    const [loading, setLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        const { fullName, email, country, phoneNumber, cardNumber, expiryDate, cvv } = formData;
        const isValid = fullName && email && country && phoneNumber && cardNumber && expiryDate && cvv;
        setIsFormValid(isValid);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            // Step 1: Create Stripe Account
            const accountResponse = await fetch("/api/stripe/create-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user?.id,
                    email: formData?.email,
                    businessType: formData?.businessType,
                    country: formData?.country
                }),
            });

            const accountData = await accountResponse.json();

            if (!accountData.success) {
                toast.error("Failed to create Stripe account");
                return;
            }

            const userUpdateResponse = await fetch("/api/user/update-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user?.id,
                    stripeAccountId: accountData.accountId,
                    cardNumber: formData?.cardNumber,
                    cardName: formData?.cardName,
                    cardExpiry: formData?.expiryDate,
                    cardCvc: formData?.cvv,
                    businessType: formData?.businessType,
                }),
            });
            const res = await userUpdateResponse.json()
            // Step 2: Get Onboarding Link
            const onboardingResponse = await fetch("/api/stripe/onboarding-link", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountId: accountData.accountId }),
            });

            const onboardingData = await onboardingResponse.json();

            if (onboardingData.success) {
                setLoading(false)
                window.location.href = onboardingData.url; // Redirect to Stripe onboarding
            } else {
                setLoading(false)
                toast.error("Failed to generate onboarding link");
            }
        } catch (error) {
            setLoading(false)
            console.error("Error:", error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false)
        }
    };

    return (
        <>
            <div className="container-fluid w-100 w-full mx-auto p-6">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className='flex items-center justify-between'>
                        <h5 className="text-xl font-semibold mb-4">Payment Setup</h5>
                        <button
                            className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
                            onClick={() => setShowForm(true)}
                        >
                            Setup Payment Account
                        </button>
                    </div>
                    <Dialog open={showForm} onOpenChange={setShowForm} className="p-4">
                        <DialogContent className="max-w-xs md:max-w-sm p-4 h-[600px] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-center text-2xl">Set Up Your Payment</DialogTitle>
                                <DialogDescription className="text-center">
                                    Please provide the necessary details to set up your Stripe Express account for receiving payments.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="mt-6">
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
                                            placeholder="Enter full name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
                                            placeholder="Enter email"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Business Type</label>
                                        <select
                                            name="businessType"
                                            value={formData.businessType}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
                                            required
                                        >
                                            <option value='individual'>Individual</option>
                                            <option value='company'>Company</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Country</label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
                                            required
                                        >
                                            <option value="">Select Country</option>
                                            <option value="PK">Pakistan</option>
                                            <option value="US">United States</option>
                                            <option value="GB">United Kingdom</option>
                                            <option value="IN">India</option>
                                            <option value="CA">Canada</option>
                                            <option value="AU">Australia</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
                                            placeholder="Enter phone number"
                                            required
                                        />
                                    </div>
                                    <h4>Card Details</h4>
                                    {/* ✅ Card Details Section */}
                                    <div>
                                        <label className="block text-gray-700">Card Name</label>
                                        <input
                                            type="text"
                                            name="cardName"
                                            value={formData.cardName}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
                                            placeholder="Enter card number"
                                            maxLength={16}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700">Card Number</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
                                            placeholder="Enter card number"
                                            maxLength={16}
                                            required
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <div className="w-1/2">
                                            <label className="block text-gray-700">Expiry Date</label>
                                            <input
                                                type="text"
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                required
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-gray-700">CVV</label>
                                            <input
                                                type="password"
                                                name="cvv"
                                                value={formData.cvv}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-black"
                                                placeholder="CVV"
                                                maxLength={3}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type='button'
                                            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
                                            onClick={() => setShowForm(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type='submit'
                                            className={`py-2 px-4 rounded-lg transition ${isFormValid ? "bg-black text-white hover:bg-gray-800" : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                }`}
                                            disabled={!isFormValid}
                                        >
                                            {loading ? <Loader className="animate-spin" /> : "Submit"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            {user.type === 'seller' && user.stripeAccountId ? (
                <>
                    <UserProfile userId={user.id} />
                    <BalanceOverview />
                    <TransactionHistory />
                </>
            ) : (
                <p className='text-center'>No Payment Method Added</p>
            )}
        </>
    );
}

export default Page;
