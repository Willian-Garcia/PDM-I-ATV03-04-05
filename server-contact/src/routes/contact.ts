import { Router, Request, Response } from "express";
import controller from "../controllers/ContactController";

const routes = Router();

// http://localhost:3011/
routes.get("/", controller.getAll);

// http://localhost:3011/
routes.post("/", controller.create);

// http://localhost:3011/
routes.delete("/", controller.remove);

// http://localhost:3011/
routes.put("/", controller.update);

// Captura qualquer método HTTP ou URL que não foi atendido anteriormente
routes.use("*", function(_: Request, res: Response){
  res.json({ error: "Requisição desconhecidax" });
});

export default routes;
