import express from "express"
import RankController from "../controllers/rankController.js"

const routes = express.Router()

routes.get("/api/rank", RankController.rank)
routes.get("/api/rank/:nickname", RankController.existByNickname)
routes.post("/api/rank", RankController.newScore)
routes.put("/api/rank/:id", RankController.updateById)

export default routes