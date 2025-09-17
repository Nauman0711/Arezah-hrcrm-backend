const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
