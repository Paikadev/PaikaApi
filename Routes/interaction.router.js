var router = require('express').Router()
var interactionController = require ('../Controllers/interactions.controller')

router.get("/", (req,res) => {
    interactionController.read(req,res)
});



router.post("/", (req, res) => {
    interactionController.insert(req,res)
});

router.get('/:id', function(req, res) {
  interactionController.readId(req,res)
})

router.put('/:id', function(req, res) {
  cervezasController.update(req, res)
});

router.put('/updatePoints/:id/:player/:points', function(req, res) {
    interactionController.updatePoints(req, res)
});

router.get("/getWinner/:id", function(req, res) {
    interactionController.getWinner(req,res);
});

router.get("/getWinner/:id", function(req, res) {
  interactionController.getWinner(req,res);
});


module.exports = router