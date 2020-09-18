const router  = require("express").Router()

// Landing
router.get("/", (req, res) => res.redirect("/docs"))

module.exports = router