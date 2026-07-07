const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const { UserController } = require('./controllers/UserController');
const { CompanyController } = require('./controllers/CompanyController');
const { ProductController } = require('./controllers/ProductController');
const { SellController } = require('./controllers/SellController');
const { ServiceController } = require('./controllers/ServiceController');

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length
    ? (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
      }
    : true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/api/uploads', express.static(uploadsDir));

// ✅ All routes first
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});
//user
app.post("/api/user/signin", UserController.signIn);
app.get("/api/user/info", UserController.info);
app.put("/api/user/update", UserController.update);
app.get("/api/user/list", UserController.list);
app.post("/api/user/create", UserController.create);
app.put("/api/user/update/:id", UserController.updateRow);
app.delete("/api/user/remove/:id", UserController.remove);
//company
app.post("/api/company/create", CompanyController.create);
app.get("/api/company/list", CompanyController.list);

//product
app.get("/api/buy/list/:page", ProductController.list);
app.put("/api/buy/update/:id", ProductController.update);
app.delete("/api/buy/remove/:id", ProductController.remove);
app.post("/api/buy/create", ProductController.create);
app.post("/api/buy/export", ProductController.exportToExcel);

//sell
app.post("/api/sell/create", SellController.create);
app.get("/api/sell/list", SellController.list);
app.delete("/api/sell/remove/:id", SellController.remove);
app.get("/api/sell/confirm", SellController.confirm);
app.get("/api/sell/dashboard", SellController.dashboard);
app.get("/api/sell/dashboard/:year", SellController.dashboard);
app.get("/api/sell/history", SellController.history);
app.get("/api/sell/info/:id", SellController.info);
//service
app.post("/api/service/create", ServiceController.create);
app.get("/api/service/list", ServiceController.list);
app.put("/api/service/update/:id", ServiceController.update);
app.delete("/api/service/remove/:id", ServiceController.remove);
// ✅ listen() always last
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
