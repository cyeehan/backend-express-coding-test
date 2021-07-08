var express = require("express");
var router = express.Router();
var moment = require("moment");
var sqlite3 = require("sqlite3");
var db = new sqlite3.Database(":memory:");

/* 
HINT

Use moment library to manipulate datetime
https://momentjs.com/

*/

router.post("/oneSettlementPerWeek", function (req, res, next) {
  // use req.body to get JSON of start and end dates. We are only concerned with end dates.
  let endDate = moment(req.body["end"], "DD-MM-YYYY");
  const dayObj = moment(endDate, "MM-DD-YYYY");
  const endDateDay = dayObj.format("dddd");
  // console.log(dayObj.format("dddd"));
  // console.log(moment(dayObj).day());

  // 03 - 05 = 10 monday
  // 03 - 10 = 17 next monday
  const verifyingDay = endDateDay.toLowerCase();
  let paymentDate = "";
  if (moment(dayObj).day() < 7) {
    // paid on following monday
    paymentDate = moment(dayObj).day(8);
  } else {
    // paid on next next monday
    paymentDate = moment(dayObj).day(16);
  }

  res.json({ paymentDate: moment(paymentDate).format("DD-MM-YYYY") });
});

router.post("/twoSettlementPerWeek", function (req, res, next) {
  let endDate = moment(req.body["end"], "DD-MM-YYYY");
  const dayObj = moment(endDate, "MM-DD-YYYY");
  const endDateDay = dayObj.format("dddd");
  // console.log(dayObj.format("dddd"));

  const verifyingDay = endDateDay.toLowerCase();
  let paymentDate = "";
  if (verifyingDay === "monday" || verifyingDay === "tuesday" || verifyingDay === "wednesday") {
    // paid on following thursday
    paymentDate = moment(dayObj).day(4);
  } else {
    // paid on following monday
    paymentDate = moment(dayObj).day(8);
  }

  //add changes below
  res.json({ paymentDate: moment(paymentDate).format("DD-MM-YYYY") });
});

router.post("/calculateSettlementAmount", function (req, res, next) {
  //add changes below
  const prices = req.body;
  if (prices.length === 0) {
    return res.json("Prices not found.");
  }
  let total = 0;
  prices.forEach((price) => {
    // formula: price * (1 - MDR / 100
    // round up to 2 decimal places
    total += price.price * (1 - price.MDR / 100);
  });
  const totalSum = Math.ceil(total * 100) / 100;

  res.json({ totalSum });
});

/*

Assignment 3

Create API to CRUD function for tickets
Use NPM sqlite3 save the tickets 
https://www.npmjs.com/package/sqlite3

Ticket

{
  "ticketId":"TES2312-32",
  "price" , "203.10",
  "MDR" : "2.0",
  "currency" : "SGD",
  "travelAgentName" : "SPLIT-TEST-AGENT01"
}

Provide a solution to restart the app instance if it crashes.

Solution: 
Using nodemon to keep watching the changes of our API server. 
Configuration has to be done for package.json after "npm i nodemon".
Inside package.json, include the codeblock below under "scripts".
          
```js
"dev": "nodemon ./server.js",
"app": "nodemon ./app.js"
```

Lastly, "npm run dev".

*/

/**
 * GET
 */
router.get("/", function (req, res, next) {
  //add changes below
  db.each("SELECT ticketId AS id, price, MDR, currency, travelAgentName FROM tickets", function (err, row) {
    console.log(row.id + " : " + row.price + " : " + row.MDR + " : " + row.currency + " : " + row.travelAgentName);
  });
});

/**
 * POST
 */
router.post("/", function (req, res, next) {
  //add changes below
  const tickets = req.body;

  db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS tickets (ticketId TEXT, price FLOAT, MDR DECIMAL, currency TEXT, travelAgentName TEXT)");

    var stmt = db.prepare("INSERT INTO tickets VALUES (?,?,?,?,?)");
    stmt.run(tickets.ticketId, tickets.price, tickets.MDR, tickets.currency, tickets.travelAgentName);
    stmt.finalize();

    db.each("SELECT ticketId AS id, price, MDR, currency, travelAgentName FROM tickets", function (err, row) {
      console.log(row.id + " : " + row.price + " : " + row.MDR + " : " + row.currency + " : " + row.travelAgentName);
    });
  });
});

/**
 * PUT
 */
router.put("/:id", function (req, res, next) {
  //add changes below
  const { id } = req.params;

  db.serialize(function () {
    db.run("UPDATE tickets SET price = $price WHERE ticketId = $id", {
      $id: id,
      $price: 900,
    });
  });
});

/**
 * DELETE
 */
router.delete("/:id", function (req, res, next) {
  //add changes below
  const { id } = req.params;

  db.serialize(function () {
    db.run("delete from tickets WHERE ticketId = $id", {
      $id: id,
    });
  });
});

/*
Assignment 4
Ensure the nodejs app process restart itself when it crash
*/

//Custom GET API that will crash the app
router.get("/crashApp", function (req, res, next) {
  let totalSum = [];
  // use try-catch
  try {
    while (true) {
      let temp = { test: 123, data: [1, 2, 4, 56, 23, 23] };
      totalSum.push(temp);
    }
  } catch (err) {
    console.error(err);
  }

  res.json({ message: "This will not be return as app will crash" });
  /**
   * Solution:
   *
   * 1. PM2 is a daemon process manager that will help you manage and keep your application online 24/7
   * 
   * 2. If during staging environment, we could use nodemon. 
   * Using nodemon to keep watching the changes of our API server. 
   * Configuration has to be done for package.json after "npm i nodemon".
   * Inside package.json, include the codeblock below under "scripts".
              
   * ```js
   * "dev": "nodemon ./server.js",
   * "app": "nodemon ./app.js"
   * ```
   *
   * Lastly, "npm run dev".
   * 
   * References:
   * https://stackoverflow.com/questions/54168892 how-to-automatically-restart-node-scripts-when-they-crash-in-production
   */
});

module.exports = router;
