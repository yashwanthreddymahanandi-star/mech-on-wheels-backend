import { Router } from "express";
import {
  createRequest,
  getRequests,
  getRequestById,
  addQuote,
  updateRequestStatus
} from "../controllers/requestController.js";

const router = Router();

router.route("/")
  .post(createRequest)
  .get(getRequests);

router.route("/:id")
  .get(getRequestById);

router.post("/:id/quotes", addQuote);
router.patch("/:id/status", updateRequestStatus);

export default router;
