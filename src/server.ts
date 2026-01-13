import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;

async function main() {
    try {
        await prisma.$connect();
        console.log("Connected to database successfull!");
        app.listen(PORT, () => {
            console.log("Server running at port ", PORT);
        })
    } catch (err) {
        console.log("An Error Occured!");
        prisma.$disconnect();
        process.exit(1);
    }
}

main();