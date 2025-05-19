import express from "express";
import router from "./routes/index.ts";
import bodyParser from "body-parser";

const app = express();

app.use(express.json());
app.use(router);

app.listen(5000, () => {
  console.log("servier is running on port 5000");
});
