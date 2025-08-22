const express = require("express");
const Note = require("../modals/Note.js");
const requireAuth = require("../middleware.js");

const router = express.Router();


router.use(requireAuth);

router.post("/", async (req, res, next) => {
  try {
    const note = await Note.create({
      user: req.userId,
      title: req.body.title || "Untitled",
      content: req.body.content || "",
    });
    res.status(201).json(note);
  } catch (e) {
    next(e);
  }
});


router.get("/", async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (e) {
    next(e);
  }
});


router.get("/:id", async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ error: "Not found" });
    res.json(note);
  } catch (e) {
    next(e);
  }
});


router.put("/:id", async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title: req.body.title, content: req.body.content },
      { new: true }
    );
    if (!note) return res.status(404).json({ error: "Not found" });
    res.json(note);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;