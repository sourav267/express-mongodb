module.exports = app => {
    const securities = require("../controllers/securities.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Security
    router.post("/", securities.create);
  
    // Retrieve all securities
    router.get("/", securities.findAll);
  
    // Retrieve a security by ticker
    // router.get("/:ticker", securities.findByTicker);
  
    // Retrieve a single Security with id
    // router.get("/:id", securities.findOne);
  
    // Update a Security with id
    router.put("/:id", securities.update);
  
    // Delete a Security with id
    router.delete("/:id", securities.delete);
  
    // // Delete all Security
    // router.delete("/", securities.deleteAll);

    // Calculate total returns
    router.post("/getreturns",securities.calculateReturns);
  
    app.use('/api/securities', router);
  };