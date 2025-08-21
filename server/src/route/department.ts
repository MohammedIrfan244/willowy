import express from "express"
import { createDepartment , deleteDepartment , getDepartments  } from "../controller/department";
import tryCatch from "../lib/util/tryCatch";


const router = express.Router()


router

.post("/",tryCatch(createDepartment))
.get("/",tryCatch(getDepartments))
.delete("/:id",tryCatch(deleteDepartment))



export default router