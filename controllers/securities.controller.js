const db = require("../models");
const { request } = require("express");
const Security_db = db.securities;

// Create and Save a new Security
exports.create = (req, res) => {
    if (!req.body.ticker) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    const security_en = new Security_db({
        ticker: req.body.ticker,
        avgBuyPrice: req.body.avgBuyPrice,
        shares: req.body.shares
    });

    security_en
        .save(security_en)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the security."
            });
        });

};

// Retrieve all security from the database
exports.findAll = (req, res) => {
    const ticker = req.query.ticker;
    let condition = ticker ? { ticker: { $regex: new RegExp(ticker), $options: "i" } } : {};

    Security_db.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving ."
            });
        });

};

// Find a single Security with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Security_db.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Security with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Security with id=" + id });
        });

};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;
    Security_db.findById(id).then(data => {
        if (!data) {
            res.send("no data");
        }
        else {
            const newSecurity = calculateAvg(data, req.body);
            Security_db.findByIdAndUpdate(data.id, newSecurity, { useFindAndModify: false })
                .then(data => {
                    if (!data) {
                        res.status(404).send({
                            message: `Cannot update!!`
                        });
                    } else res.send({ message: "Security was updated successfully." });
                }
                )
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error updating Security"
        });
    })
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {

    const id = req.params.id;

    Security_db.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete security with id=${id}.Security was not found!`
                });
            } else {
                res.send({
                    message: "Security was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Security with id=" + id
            });
        });

};

// // Delete all Tutorials from the database.
// exports.deleteAll = (req, res) => {
//     Tutorial.deleteMany({})
//         .then(data => {
//             res.send({
//                 message: `${data.deletedCount} Tutorials were deleted successfully!`
//             });
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while removing all tutorials."
//             });
//         });

// };

// Find by Ticker
exports.findByTicker = (req, res) => {
    // const ticker= req.body.ticker;
    const ticker = req.params.ticker;
    Security_db.findOne({ 'ticker': ticker })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving security."
            });
        });

};

// Calculate total returns
exports.calculateReturns = (req, res) => {
    // const ticker= req.body.ticker;
    const currentPrice = req.body;
    Security_db.find()
        .then(data => {
            const returns = calculatePrice(currentPrice,data);
            res.send({'returns': returns});
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving ."
            });
        });

};



const calculateAvg = (old_security, up_security) => {
    let avg = 0;
    let total = 0;
    if (up_security.sign==="SELL") {
        avg = old_security.avgBuyPrice;
        total = (old_security.shares - up_security.shares);
    } else {
        avg = (
            (old_security.shares * old_security.avgBuyPrice
                + up_security.shares * up_security.avgBuyPrice)
            / (old_security.shares + up_security.shares)).toFixed(2);
        total = (old_security.shares + up_security.shares);
    }
    old_security.avgBuyPrice = avg;
    old_security.shares = total;
    return old_security;
}

const calculatePrice = (currentPrice,AvgPrice) => {
    let totalcurrentPrice = 0 ;
    let totalavgPrice = 0;
    currentPrice.forEach(element => {
        // console.log(element.shares*element.currentPrice);
        totalcurrentPrice+= element.shares*element.currentPrice;
    });
    AvgPrice.forEach(element => {
        // console.log(element.shares*element.avgBuyPrice)
        totalavgPrice += element.shares*element.avgBuyPrice;
    });
    // console.log(totalavgPrice);
    // console.log(totalcurrentPrice);
    // console.log(totalcurrentPrice-totalavgPrice);
    return totalcurrentPrice-totalavgPrice;
}