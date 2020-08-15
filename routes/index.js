const router  = require("express").Router()

// Landing
router.get("/", (req, res) => res.render("landing"))

module.exports = router