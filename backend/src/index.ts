import express from "express";
import router from "./routes/index.ts";
import cors from "cors";
import path from "path";

const app = express();

app.use(express.json());
app.use(router);
app.use(cors());
app.use("/static", express.static(path.join(__dirname, "../static")));

app.listen(5000, () => {
  console.log("servier is running on port 5000");
});
