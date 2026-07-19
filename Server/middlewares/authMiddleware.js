const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Seller = require("../models/Seller");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const verifyAdmin = async (req, res, next) => {
  await verifyToken(req, res, async () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admin role required" });
    }
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(403).json({ message: "Admin account not found" });
    }
    next();
  });
};

const verifySeller = async (req, res, next) => {
  await verifyToken(req, res, async () => {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Access denied: Seller role required" });
    }
    const seller = await Seller.findById(req.user.id);
    if (!seller) {
      return res.status(403).json({ message: "Seller account not found" });
    }
    if (!seller.isApproved) {
      return res.status(403).json({ message: "Access denied: Seller not approved by admin" });
    }
    next();
  });
};

const verifyUser = async (req, res, next) => {
  await verifyToken(req, res, async () => {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Access denied: User role required" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(403).json({ message: "User account not found" });
    }
    next();
  });
};

module.exports = {
  verifyAdmin,
  verifySeller,
  verifyUser,
  verifyToken
};
