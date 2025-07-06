import cron from "node-cron";
import Task from "../models/task.model";

// // ⏰ Run every day at 2 AM (server time)
// cron.schedule("0 2 * * *", async () => {
//   try {
//     // const thresholdDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
//     const thresholdDate = new Date(Date.now() - 1 * 60 * 1000); // 1 minute ago

//     const result = await Task.deleteMany({
//       isDeleted: true,
//       deletedAt: { $lte: thresholdDate },
//     });

//     console.log(`🧹 Auto-deleted ${result.deletedCount} tasks from trash.`);
//   } catch (err) {
//     console.error("❌ Error during auto-delete cron:", err);
//   }
// });


// ⏰ Run every 10 seconds
cron.schedule("*/60 * * * * *", async () => {
  try {
    const thresholdDate = new Date(Date.now() - 1 * 60 * 1000); // 1 min ago

    const result = await Task.deleteMany({
      isDeleted: true,
      deletedAt: { $lte: thresholdDate },
    });

    console.log(`🧹 Auto-deleted ${result.deletedCount} tasks from trash.`);
  } catch (err) {
    console.error("❌ Error during auto-delete cron:", err);
  }
});
