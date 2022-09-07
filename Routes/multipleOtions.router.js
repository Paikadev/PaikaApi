var router = require('express').Router()
var multipleOptionsController = require('../Controllers/multipleOptions.controller')

router.get("/", (req,res) => {
    multipleOptionsController.read(req,res)
});

router.post("/", (req, res) => {
    multipleOptionsController.insert(req,res)
});



module.exports = router