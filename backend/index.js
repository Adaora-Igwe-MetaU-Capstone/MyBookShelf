const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
const session = require("express-session");
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
require("dotenv").config();
app.use(cors({origin:"http://localhost:5173", credentials:true}));
app.use(express.json());
app.use(
  session({
    secret: "keep it  a secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 }, // 1-hour session
  })
);
app.use("/", authRoutes);
app.use("/", bookRoutes);
app.use("/", bookShelfRoutes)


app.listen(PORT, () => {
  console.log(`Running on port http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.json("Welcome!");
});
