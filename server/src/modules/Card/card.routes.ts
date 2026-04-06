import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import CardController from "./card.controller.js";

const cardRoutes = Router();

// Used for operations directly on cards
cardRoutes.post("/", asyncHandler(CardController.createCard));
cardRoutes.patch("/reorder", asyncHandler(CardController.reorderCard));
cardRoutes.patch("/:cardId", asyncHandler(CardController.updateCard));
cardRoutes.delete("/:cardId", asyncHandler(CardController.deleteCard));

export default cardRoutes;
