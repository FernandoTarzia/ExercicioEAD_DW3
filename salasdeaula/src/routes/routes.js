const express = require("express");
const router = express.Router();
const controller = require("../controllers/salasdeaulaController.js");

// Add a root route
router.get("/", (req, res) => {
  res.send("Salas de Aula API!"); 
});

router.get("/salasdeaula", controller.GetAllSalasDeAula);
router.get("/salasdeaula/:id", controller.GetSalasDeAulaByID);
router.post("/salasdeaula", controller.InsertSalasDeAula);
router.put("/salasdeaula/:id", controller.UpdateSalasDeAula);
router.delete("/salasdeaula/:id", controller.DeleteSalasDeAula);

module.exports = router;
