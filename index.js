const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Auth routes
app.use("/api/auth/register", require("./src/routes/authentication/registeration/index"));
app.use("/api/auth/login", require("./src/routes/authentication/login/index"));
app.use("/api/auth/forgot-password", require("./src/routes/authentication/forgot-password/index"));
app.use("/api/auth/logout", require("./src/routes/authentication/logout/index"));
app.use("/api/auth/refresh-token", require("./src/routes/authentication/refresh-token/index"));
app.use("/api/auth/reset-password", require("./src/routes/authentication/reset-password/index"));
app.use("/api/auth/verify-otp", require("./src/routes/authentication/verify-otp/index"));

// Employee management routes
app.use("/api/employe/all", require("./src/routes/employes/all/index"));
app.use("/api/employe/add", require("./src/routes/employes/add"));
app.use("/api/employe/delete", require("./src/routes/employes/delete/index"));
app.use("/api/employe", require("./src/routes/employes/update/index"));
app.use("/api/employe", require("./src/routes/employes/update/index"));


// Department routes
app.use("/api/department/all", require("./src/routes/department/all/index"));
app.use("/api/department/add", require("./src/routes/department/add"));
app.use("/api/department/delete", require("./src/routes/department/delete/index"));
app.use("/api/department", require("./src/routes/department/update/index"));
app.use("/api/department", require("./src/routes/department/update/index"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
