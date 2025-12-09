const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyAppleToken } = require("../../utils/appleAuth");
const sendEmail = require("../../utils/email");

// Helper: Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" }
  );
};

// ======================= REGISTER =======================
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check duplicate phone
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      email,
      phone,
      passwordHash: hashedPassword,
      auth_provider: "local"
    });

    const savedUser = await newUser.save();
    const token = generateToken(savedUser);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        role: savedUser.role
      },
      token
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// ======================= LOGIN =======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Compare password with passwordHash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// ======================= GET PROFILE =======================
exports.getProfile = async (req, res) => {
  try {
    // req.user is already set by the auth middleware with the full user object
    // Just return it directly
    if (!req.user) return res.status(404).json({ message: "User not found" });

    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: "Failed to get profile", error: err.message });
  }
};

// ======================= UPDATE PROFILE =======================
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const userId = req.user._id;

    // Check duplicate email
    if (email) {
      const exists = await User.findOne({ email, _id: { $ne: userId } });
      if (exists) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Check duplicate phone
    if (phone) {
      const exists = await User.findOne({ phone, _id: { $ne: userId } });
      if (exists) {
        return res.status(400).json({ message: "Phone already exists" });
      }
    }

    // Handle profile image upload
    const updateData = { name, email, phone };
    if (req.file) {
      updateData.profile_image = req.file.filename;
    }

    // Handle address update - support both object and bracket notation from FormData
    if (address) {
      if (typeof address === 'object') {
        updateData.address = address;
      } else if (typeof address === 'string') {
        // If address is a JSON string, parse it
        try {
          updateData.address = JSON.parse(address);
        } catch (e) {
          // If not JSON, ignore
        }
      }
    } else {
      // Check for bracket notation fields (from FormData)
      const addressFields = {};
      if (req.body['address[street]']) addressFields.street = req.body['address[street]'];
      if (req.body['address[city]']) addressFields.city = req.body['address[city]'];
      if (req.body['address[state]']) addressFields.state = req.body['address[state]'];
      if (req.body['address[zip]']) addressFields.zip = req.body['address[zip]'];
      if (req.body['address[country]']) addressFields.country = req.body['address[country]'];
      if (req.body['address[phone]']) addressFields.phone = req.body['address[phone]'];
      
      if (Object.keys(addressFields).length > 0) {
        updateData.address = addressFields;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-passwordHash");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

// ======================= CHANGE PASSWORD =======================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare old password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashed;
    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch (err) {
    res.status(500).json({ message: "Failed to change password", error: err.message });
  }
};

// ======================= GOOGLE LOGIN =======================
exports.googleLogin = async (req, res) => {
  try {
    const { google_id, email, name, profile_image } = req.body;

    if (!google_id || !email) {
      return res.status(400).json({ message: "Google ID and email are required" });
    }

    // Check if user exists with this google_id
    let user = await User.findOne({ google_id });

    // If not found, check by email
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        // Update existing user with google_id
        user.google_id = google_id;
        user.auth_provider = "google";
        if (profile_image) user.profile_image = profile_image;
        await user.save();
      }
    }

    // Create new user if doesn't exist
    if (!user) {
      user = new User({
        name: name || email.split("@")[0],
        email,
        phone: `+1${Math.floor(Math.random() * 10000000000)}`, // Temporary phone
        google_id,
        auth_provider: "google",
        profile_image: profile_image || null,
        isEmailVerified: true
      });
      await user.save();
    }

    const token = generateToken(user);

    res.json({
      message: "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Google login failed", error: err.message });
  }
};

// ======================= APPLE LOGIN =======================
exports.appleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Apple ID token is required" });
    }

    // Verify Apple token
    const appleData = await verifyAppleToken(idToken);
    const { sub: apple_id, email, name } = appleData;

    // Check if user exists with this apple_id
    let user = await User.findOne({ apple_id });

    // If not found, check by email
    if (!user && email) {
      user = await User.findOne({ email });
      if (user) {
        // Update existing user with apple_id
        user.apple_id = apple_id;
        user.auth_provider = "apple";
        await user.save();
      }
    }

    // Create new user if doesn't exist
    if (!user) {
      user = new User({
        name: name || email?.split("@")[0] || "Apple User",
        email: email || `${apple_id}@apple.privaterelay.app`,
        phone: `+1${Math.floor(Math.random() * 10000000000)}`, // Temporary phone
        apple_id,
        auth_provider: "apple",
        isEmailVerified: true
      });
      await user.save();
    }

    const token = generateToken(user);

    res.json({
      message: "Apple login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (err) {
    console.error("Apple login error:", err);
    res.status(500).json({ message: "Apple login failed", error: err.message });
  }
};

// ======================= FORGOT PASSWORD =======================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists for security
      return res.json({ message: "If email exists, password reset link has been sent" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otp_expiry = otp_expiry;
    await user.save();

    // Send email with OTP
    try {
      await sendEmail(
        user.email,
        "Password Reset OTP",
        `Your password reset OTP is: ${otp}. This OTP will expire in 10 minutes.`
      );
    } catch (emailErr) {
      console.error("Email sending error:", emailErr);
      // Continue even if email fails
    }

    res.json({ message: "If email exists, password reset OTP has been sent" });

  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Failed to process request", error: err.message });
  }
};

// ======================= RESET PASSWORD =======================
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check OTP expiry
    if (!user.otp_expiry || new Date() > user.otp_expiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashedPassword;
    user.otp = null;
    user.otp_expiry = null;
    await user.save();

    res.json({ message: "Password reset successfully" });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Failed to reset password", error: err.message });
  }
};

// ======================= LOGOUT =======================
exports.logout = async (req, res) => {
  try {
    // Logout is typically handled client-side by removing the token
    // But we can add server-side token blacklisting here if needed
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};
