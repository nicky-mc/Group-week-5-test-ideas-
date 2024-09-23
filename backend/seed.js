import { db } from "./server.js";
async function seedDatabase() {
  try {
    const subjects = ["general", "technology", "sports"];

    for (const subject of subjects) {
      const { data, error } = await supabase.from(subject).insert([
        { content: "Welcome to the " + subject + " board!", likes: 0 },
        { content: "Feel free to share your thoughts on " + subject, likes: 0 },
      ]);

      if (error) {
        console.error("Error seeding " + subject + " table:", error);
      } else {
        console.log("Seeded " + subject + " table:", data);
      }
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();
