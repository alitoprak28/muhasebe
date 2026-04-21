import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { app } from "./app.js";

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`Server ${env.port} portunda calisiyor.`);
    });
  } catch (error) {
    console.error("Server baslatilamadi:", error.message);
    process.exit(1);
  }
};

startServer();

