import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import api from "./api/index";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api", api);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

declare global {
  namespace Express {
    interface Response {
      paginatedResults?: {
        next?: { page: number; limit: number };
        previous?: { page: number; limit: number };
        results: any[];
      };
    }
  }
}
