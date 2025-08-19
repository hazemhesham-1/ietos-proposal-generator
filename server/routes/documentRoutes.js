const express = require("express");
const router = express.Router();

const documentController = require("../controllers/documentController");

router.post("/generate", documentController.generateDocx);

module.exports = router;