import express from "express"
import { createEmployee , deleteEmployee , updateEmployee , getAllEmployees ,getEmployee } from "../controller/employee"
import tryCatch from "../lib/util/tryCatch"
import upload from "../middleware/multer"


const router = express.Router()

router 
 .post("/",upload.single("profile"),tryCatch(createEmployee))
 .get("/",tryCatch(getAllEmployees))
 .get("/:id",tryCatch(getEmployee))
 .patch("/:id",upload.single("profile"),tryCatch(updateEmployee))
 .delete("/:id",tryCatch(deleteEmployee))


export default router