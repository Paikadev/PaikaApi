var router = require('express').Router()
var textOnlyController = require('../Controllers/textOnlyController')

router.get("/", (req,res) => {
    textOnlyController.read(req,res)
});

router.post("/", (req, res) => {
    textOnlyController.insert(req,res)
});



module.exports = router