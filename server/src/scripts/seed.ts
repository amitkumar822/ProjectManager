import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model";
import Project from "../models/project.model";
import Task from "../models/task.model";

dotenv.config();

const mongoUri = `${process.env.MONGODB_URI}/${process.env.DB_NAME}`;

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI || !process.env.DB_NAME) {
      throw new Error("Missing MongoDB connection environment variables.");
    }

    await mongoose.connect(mongoUri);
    console.log("🟢 Connected to MongoDB");

    // Clean up
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log("🧹 Cleared existing data");

    // 1️⃣ Create user
    const user = await User.create({
      email: "ak7772100@gmail.com",
      password: "1234",
    });
    console.log("👤 User created:", user.email);

    const projectTitles = ["Project Alpha", "Project Beta"];

    // 2️⃣ Create 2 projects
    const createdProjects = await Promise.all(
      projectTitles.map((title, i) =>
        Project.create({
          title,
          description: `This is ${title}`,
          status: i === 0 ? "active" : "completed",
          user: user._id,
        })
      )
    );

    console.log("📁 Projects created");

    // 3️⃣ Create 3 tasks for each project
    for (const project of createdProjects) {
      const taskStatus: ("todo" | "in-progress" | "done")[] = [
        "todo",
        "in-progress",
        "done",
      ];

      await Promise.all(
        taskStatus.map((status, i) =>
          Task.create({
            title: `Task ${i + 1} for ${project.title}`,
            description: `Auto-generated task ${i + 1}`,
            status,
            dueDate: new Date(Date.now() + i * 86400000), // today + i days
            project: project._id,
            user: user._id,
          })
        )
      );
      console.log(`✅ Tasks created for ${project.title}`);
    }

    console.log("🌱 Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();
