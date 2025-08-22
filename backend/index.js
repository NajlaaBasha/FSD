const express =require( "express");
const morgan = require("morgan");
const cors =require( "cors");
const cookieParser =require( "cookie-parser");
const dotenv =require( "dotenv");
const connectDB =require("./db.js")
const authRoutes =require( "./Routes/auth.js");
const noteRoutes =require( "./Routes/note.js");

dotenv.config();
console.log("DEBUG JWT_SECRET:", process.env.JWT_SECRET);
const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "notes-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/note", noteRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((e) => {
  console.error("Failed to connect DB", e);
  process.exit(1);
});
