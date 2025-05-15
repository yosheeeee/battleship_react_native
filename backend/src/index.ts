import express from "express";
import router from "./routes/index.ts";

const app = express();

app.use(router);
app.use(express.json());

app.listen(5000, () => {
  console.log("servier is running on port 5000");
});
