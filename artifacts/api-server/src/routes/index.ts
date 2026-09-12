import { Router, type IRouter } from "express";
import healthRouter from "./health";
import oneGovFlowRouter from "./onegovflow";

const router: IRouter = Router();

router.use(healthRouter);
router.use(oneGovFlowRouter);

export default router;
