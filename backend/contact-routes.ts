///<reference path="types.ts" />

import express from "express";

import {
  getContactsByUsername,
  removeContactById,
  createContactForUser,
  getContactBy,
} from "./database";
import { ensureAuthenticated, validateMiddleware } from "./helpers";
import { shortIdValidation } from "./validators";
const router = express.Router();

// Routes
//GET /contacts/:username
router.get("/:username", (req, res) => {
  const { username } = req.params;

  const contacts = getContactsByUsername(username);

  res.status(200);
  res.json({ contacts });
});

//POST /contacts (scoped-user)
router.post(
  "/",
  ensureAuthenticated,
  validateMiddleware([shortIdValidation("contactUserId")]),
  (req, res) => {
    const { contactUserId } = req.body;
    /* istanbul ignore next */
    const contact = createContactForUser(req.user?.id!, contactUserId);

    res.status(200);
    res.json({ contact });
  }
);
//DELETE /contacts/:contactId (scoped-user)
router.delete(
  "/:contactId",
  ensureAuthenticated,
  validateMiddleware([shortIdValidation("contactId")]),
  (req, res) => {
    const { contactId } = req.params;

    const contact = getContactBy("id", contactId);

    if (!contact || contact.userId !== req.user?.id) {
      return res.status(404).json({ error: "Contact not found" });
    }

    const contacts = removeContactById(contactId);

    res.status(200);
    res.json({ contacts });
  }
);

export default router;
