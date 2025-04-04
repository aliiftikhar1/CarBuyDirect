import { PrismaClient } from "@prisma/client";

let prisma;

// Prevent multiple instances of PrismaClient in development
if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export default prisma;
