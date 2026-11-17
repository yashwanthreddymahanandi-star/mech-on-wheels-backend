import mongoose from "mongoose";
import ServiceRequest from "../models/ServiceRequest.js";
import asyncHandler from "../utils/asyncHandler.js";

const validStatuses = [
  "Requested", "Quotes received", "Mechanic assigned",
  "On the way", "Repairing", "Completed", "Cancelled"
];

export const createRequest = asyncHandler(async (req, res) => {
  const fields = ["customerName", "phone", "vehicle", "issue", "location"];
  const missing = fields.filter((field) => !String(req.body[field] ?? "").trim());

  if (missing.length) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missing.join(", ")}`
    });
  }

  const request = await ServiceRequest.create({
    customerName: req.body.customerName,
    phone: req.body.phone,
    vehicle: req.body.vehicle,
    issue: req.body.issue,
    location: req.body.location
  });

  res.status(201).json(request);
});

export const getRequests = asyncHandler(async (_req, res) => {
  const requests = await ServiceRequest.find().sort({ createdAt: -1 }).limit(100);
  res.json(requests);
});

export const getRequestById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid request ID." });
  }

  const request = await ServiceRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ success: false, message: "Request not found." });

  res.json(request);
});

export const addQuote = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid request ID." });
  }

  const { mechanicName, price, etaMinutes, rating, message } = req.body;
  if (!String(mechanicName ?? "").trim() ||
      price === undefined || !Number.isFinite(Number(price)) || Number(price) < 0 ||
      !Number.isFinite(Number(etaMinutes)) || Number(etaMinutes) < 1) {
    return res.status(400).json({
      success: false,
      message: "mechanicName, a non-negative price, and etaMinutes (at least 1) are required."
    });
  }

  const request = await ServiceRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ success: false, message: "Request not found." });

  request.quotes.push({
    mechanicName,
    price: Number(price),
    etaMinutes: Number(etaMinutes),
    ...(rating !== undefined ? { rating: Number(rating) } : {}),
    message: message || ""
  });
  request.status = "Quotes received";
  await request.save();

  res.status(201).json(request);
});

export const updateRequestStatus = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid request ID." });
  }

  const { status, selectedMechanic } = req.body;
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `status must be one of: ${validStatuses.join(", ")}`
    });
  }

  const update = { status };
  if (selectedMechanic !== undefined) update.selectedMechanic = selectedMechanic;

  const request = await ServiceRequest.findByIdAndUpdate(
    req.params.id,
    { $set: update },
    { new: true, runValidators: true }
  );

  if (!request) return res.status(404).json({ success: false, message: "Request not found." });
  res.json(request);
});
