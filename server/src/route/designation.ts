import express from "express";
import { createDesignation , deleteDesignation ,getDesignations } from "../controller/designation";
import tryCatch from "../lib/util/tryCatch";



const router = express.Router();

router.post("/",tryCatch(createDesignation))
router.get("/:departmentId",tryCatch(getDesignations))
router.delete("/:id",tryCatch(deleteDesignation))


export default router