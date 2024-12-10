import { Router } from "express";
import authMiddleware from "./app/middlewares/index.js";

const routes = new Router();

routes.get("/", (_, res) => {
  return res.json({ message: "We are ready!" });
});

routes.use(authMiddleware);

// Login and update user
routes.post("/", SessionController.store);
routes.put("/user/:id", UserController.update);

// Listing ticket and create ticket
routes.get("/ticket", TicketController.index);
routes.post("create-ticket", CreateTicketController.store);
