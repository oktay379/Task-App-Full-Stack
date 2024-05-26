import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// db
import "./db.js";

// routes
import authRouter from "./routes/auth.js";
import taskRouter from "./routes/todos.js";

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:4000"],
    credentials: true
}));
app.use(express.static("public")) // img map etmek icin kullanildi.


app.use("/auth", authRouter);
app.use("/tasks", taskRouter);



app.listen(process.env.PORT, () => {
    console.log("Todo Running...");
})