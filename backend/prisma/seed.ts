import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.employee.deleteMany();
  await prisma.employee.createMany({
    data: [
      { firstName: "Anna",  lastName: "Kowalska",   position: "Backend Dev",  project: "Acme Corp", hourlyRate: "85.00",  status: "ACTIVE" },
      { firstName: "Piotr", lastName: "Nowak",      position: "Frontend Dev", project: "Acme Corp", hourlyRate: "70.50",  status: "ACTIVE" },
      { firstName: "Marek", lastName: "Wiśniewski", position: "QA Engineer",  project: "Acme Corp", hourlyRate: "60.00",  status: "INACTIVE" },
      { firstName: "Ewa",   lastName: "Wójcik",     position: "DevOps",       project: "Globex",    hourlyRate: "95.25",  status: "ACTIVE" },
      { firstName: "Jan",   lastName: "Lewandowski",position: "Backend Dev",  project: "Globex",    hourlyRate: "80.00",  status: "ACTIVE" },
      { firstName: "Karol", lastName: "Zieliński",  position: "PM",           project: "Initech",   hourlyRate: "110.00", status: "ACTIVE" },
      { firstName: "Zofia", lastName: "Szymańska",  position: "Designer",     project: "Initech",   hourlyRate: "65.00",  status: "INACTIVE" },
    ],
  });
  console.log("Seeded 7 employees across 3 projects.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
