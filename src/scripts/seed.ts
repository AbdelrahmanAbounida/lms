const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    const data = [
      { name: "Computer Science" },
      { name: "Math" },
      { name: "Artificial Intelligence" },
      { name: "Game Development" },
      { name: "Model Design" },
      { name: "Software Development" },
      { name: "Robotics" },
      { name: "Fitness" },
      { name: "Language" },
    ];

    await database.category.createMany({
      data,
    });
    console.log("Categories have been created successfully");
  } catch (error) {
    console.log({ error });
  } finally {
    await database.$disconnect();
  }
}

main();
