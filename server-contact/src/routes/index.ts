import { Request, Response, Router } from 'express';

import contact from "./contact";

const routes = Router();

routes.use("/", contact);

// Captura qualquer método HTTP ou URL que não foi atendido anteriormente
routes.use("*", function(_: Request, res: Response){
  res.json({ error: "Requisição desconhecida" });
});

export default routes;
