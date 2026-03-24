import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
      required: true,
    },

    googleId: {
      type: String,
      index: true,
      sparse: true, // allows many docs with no googleId, but indexes those that have it
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },

    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // good practice so it doesn't leak in queries
    },

    isNewUser: {
      type: Boolean,
      default: true,
    },

    weight: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    goal: {
      type: String,
      enum: ["Strength", "Hypertrophy", "Endurance", "General"],
      default: "General",
    },
    targets: { type: String, maxLength: 250 },
    unitPreference: {
      weight: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("bmi").get(function () {
  if (!this.weight || !this.height) return 0;

  // BMI Formula: weight (kg) / [height (m)]²
  const heightInMeters = this.height / 100;
  const bmi = this.weight / (heightInMeters * heightInMeters);

  return parseFloat(bmi.toFixed(1)); // Return to 1 decimal place (e.g., 24.5)
});

// Login match
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
