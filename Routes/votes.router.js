var router = require('express').Router()
var votesController = require('../Controllers/votes.controller')

router.get("/", (req,res) => {
    votesController.read(req,res)
});





module.exports = router