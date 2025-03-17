// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
// };

// export const handler = NextAuth(authOptions);

// // ✅ Next.js App Router requires named exports for HTTP methods
// export { handler as GET, handler as POST };



// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaClient } from "@prisma/client"; // ✅ Prisma ya jo bhi DB use kar rahe ho

// const prisma = new PrismaClient();

// const authOptions = {
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         }),
//     ],
//     callbacks: {
//         async signIn({ user }) {
//             try {
//                 // ✅ Check karo ke user pehle se hai ya nahi
//                 const existingUser = await prisma.user.findUnique({
//                     where: { email: user.email },
//                 });

//                 // ✅ Agar user nahi mila, to naya user create karo
//                 if (!existingUser) {
//                     await prisma.user.create({
//                         data: {
//                             name: user.name,
//                             email: user.email,
//                             image: user.image,
//                         },
//                     });
//                 }

//                 return true; // Allow sign-in
//             } catch (error) {
//                 console.error("Error saving user to DB:", error);
//                 return false; // Reject sign-in if error occurs
//             }
//         },

//         async session({ session, token }) {
//             // ✅ Google User ID session me add karna
//             session.user.id = token.sub;
//             return session;
//         },
//     },
//     secret: process.env.NEXTAUTH_SECRET,
// };

// export const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
    debug: true, // Debugging enabled
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        // async signIn({ user }) {
        //     try {
        //         // ✅ Check karo ke user pehle se exist karta hai ya nahi
        //         const existingUser = await prisma.user.findUnique({
        //             where: { email: user.email },
        //         });
        //         const userType = account.userType || "customer"; // Default "customer"
        //         // ✅ Agar user nahi mila, to naya user create karo
        //         if (!existingUser) {
        //             await prisma.user.create({
        //                 data: {
        //                     name: user.name,
        //                     email: user.email,
        //                     image: user.image,
        //                     type: userType,
        //                 },
        //             });
        //         }

        //         return true; // Allow sign-in
        //     } catch (error) {
        //         console.error("Error saving user to DB:", error);
        //         return false; // Sign-in reject if error occurs
        //     }
        // },

        async signIn({ user, account, profile }) {
            try {
                // const existingUser = await prisma.user.findUnique({
                //     where: { email: user.email },
                // });

                // const userType = account.userType || "customer"; // Default "customer"

                // if (!existingUser) {
                //     await prisma.user.create({
                //         data: {
                //             name: user.name,
                //             email: user.email,
                //             image: user.image,
                //             type: userType, // ✅ Save Type
                //         },
                //     });
                // }

                return true; // Allow sign-in
            } catch (error) {
                console.error("Error saving user:", error.message);
                return false;
            }
        },

        async session({ session, token }) {
            // ✅ Fetch user from DB to get the correct ID
            // const dbUser = await prisma.user.findUnique({
            //     where: { email: session.user.email },
            // });

            // if (dbUser) {
            //     session.user.id = dbUser.id; // ✅ Add user ID to session
            // }
            console.log("Session:", session);
            return session;
        },
        // async redirect({ url, baseUrl }) {
        //     // Check user role and redirect accordingly
        //     const sessionUser = await prisma.user.findUnique({
        //         where: { email: url.email }, // Get user data from database
        //     });

        //     if (sessionUser?.type === "seller") {
        //         return `${baseUrl}/Seller`; // Redirect to seller panel
        //     } else {
        //         return `${baseUrl}/buyer-dashboard`; // Redirect to buyer dashboard
        //     }
        // },
    },

    // callbacks: {
    //     async signIn({ user, account, profile }) {
    //         try {
    //             // 🔹 Get user type from URL query parameter
    //             const url = new URL(account?.redirect_uri || "");
    //             const type = url.searchParams.get("type") || "buyer"; // Default: buyer

    //             // 🔹 Check if user exists
    //             const existingUser = await prisma.user.findUnique({
    //                 where: { email: user.email },
    //             });

    //             if (!existingUser) {
    //                 // 🔹 Create new user with type
    //                 await prisma.user.create({
    //                     data: {
    //                         name: user.name,
    //                         email: user.email,
    //                         image: user.image,
    //                         type: type, // 👈 Store user type
    //                     },
    //                 });
    //             }

    //             return true;
    //         } catch (error) {
    //             console.error("Error saving user to DB:", error);
    //             return false;
    //         }
    //     },

    //     async session({ session }) {
    //         if (!session?.user?.email) return session;

    //         const dbUser = await prisma.user.findUnique({
    //             where: { email: session.user.email },
    //         });

    //         if (dbUser) {
    //             session.user.id = dbUser.id;
    //             session.user.type = dbUser.type; // 👈 Add user type to session
    //         }

    //         return session;
    //     },
    // },



    secret: process.env.NEXTAUTH_SECRET,
};

// ✅ Correctly Export the API routes for Next.js App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
