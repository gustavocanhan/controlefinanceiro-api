import { Router } from "express";
import transactionController from "../controllers/transactionController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.use(protect);

router.get("/summary", transactionController.getSummary);
router.get("/recent", transactionController.getRecent);
router.get("/monthly-chart", transactionController.getMonthlyChart);
router.get(
  "/expenses-by-category",
  transactionController.getExpensesByCategory,
);
router.get("/", transactionController.getAll);
router.post("/", transactionController.create);
router.put("/:id", transactionController.update);
router.delete("/:id", transactionController.remove);

export default router;
