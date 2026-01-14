import { prisma } from "../lib/prisma";
import { userRole } from "../middlewares/auth";

async function seedAdmin() {
    try {
        const adminData = {
            email: "admin@gmail.com",
            name: "Admin Saheb",
            role: userRole.ADMIN,
            password: "prapya@prisma",
        };
        // check user exists on db or not
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        });
        if (existingUser) {
            throw new Error("User already exists in db!");
        }
        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "origin": "http://localhost:4000"
            },
            body: JSON.stringify(adminData)
        });

        if (signUpAdmin.ok) {
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            });
        }

    } catch (error) {
        console.error(error);
    }
}

seedAdmin();