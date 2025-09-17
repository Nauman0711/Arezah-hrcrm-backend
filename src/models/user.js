const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const userSchema = new mongoose.Schema({
    // Basic user fields
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    fcmToken: { type: String },
    type: {
        type: String,
        enum: ["ceo", "employee", "manager", "admin"],
        default: "ceo",
    },
    profilePhoto: { type: String },

    // OTP fields
    otp: String,
    otpExpires: Date,

    // Employee-specific fields
    employeeId: { type: String }, // custom Employee ID
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    designation: { type: String },
    isVerified: { type: Boolean },
    address: { type: String },
    cnicNumber: { type: String },
    contactNumber: { type: String },
    emergencyContactNumber: { type: String },

    joiningDate: { type: Date },
    leavingDate: { type: Date },

    status: {
        type: String,
        enum: ["active", "probation", "on_leave", "terminated", "resigned"],
        default: "active",
    },

    accountNumber: { type: String },
    branchCode: { type: String },
    gender: { type: String },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    // Departments (reference IDs)
    departments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }],
}, { timestamps: true });

// 🔑 Hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// 🔑 Compare password method
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
