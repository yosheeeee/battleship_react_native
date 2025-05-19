import express from "express";
import router from "./routes/index.ts";
import cors from "cors"


const app = express();

app.use(express.json());
app.use(router);
app.use(cors())


app.listen(5000, () => {
  console.log("servier is running on port 5000");
});
