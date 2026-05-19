import express from "express";
import cors from "cors";
import { env } from "./env";
import { employeeRouter } from "./employees/employee.routes";
import { errorHandler } from "./error-handler";

const app = express();
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use("/api/employees", employeeRouter);
app.use((_req, res) => res.status(404).json({ error: { message: "Not found" } }));
app.use(errorHandler);

app.listen(env.PORT, () => console.log(`API listening on http://localhost:${env.PORT}`));
