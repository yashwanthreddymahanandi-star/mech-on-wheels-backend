import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
  mechanicName: { type: String, required: true, trim: true, maxlength: 80 },
  price: { type: Number, required: true, min: 0 },
  etaMinutes: { type: Number, required: true, min: 1 },
  rating: { type: Number, min: 0, max: 5, default: 4.5 },
  message: { type: String, trim: true, maxlength: 500, default: "" }
}, { timestamps: true });

const serviceRequestSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true, maxlength: 80 },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
  vehicle: { type: String, required: true, trim: true, maxlength: 100 },
  issue: { type: String, required: true, trim: true, maxlength: 1000 },
  location: { type: String, required: true, trim: true, maxlength: 250 },
  status: {
    type: String,
    enum: [
      "Requested",
      "Quotes received",
      "Mechanic assigned",
      "On the way",
      "Repairing",
      "Completed",
      "Cancelled"
    ],
    default: "Requested"
  },
  selectedMechanic: { type: String, trim: true, default: "" },
  quotes: { type: [quoteSchema], default: [] }
}, { timestamps: true });

serviceRequestSchema.index({ createdAt: -1 });
export default mongoose.model("ServiceRequest", serviceRequestSchema);
