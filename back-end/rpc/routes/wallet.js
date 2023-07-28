const express = require("express");
const router = express.Router();
const { create, Verify, Info } = require("../controllers/wallet");

router.get("/create", create);
router.post("/connect", Verify);
router.post("/info", Info);

module.exports = router;
