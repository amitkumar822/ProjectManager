import app from "./app";
import connectDB from "./config/db";
import cluster from "cluster";
import os from "os";
import "../src/utils/autoDeleteCron";

const totalCPUs = os.cpus().length;

const PORT = process.env.PORT || 4001;

app.get("/", (_, res) => {
  res.send(`Welcome to Project Manager - PID: ${process.pid}`);
});

if (cluster.isPrimary) {
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Spawning a new one...`);
    cluster.fork();
  });
} else {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error(err.message);
    });
}

