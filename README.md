# Disclaimer

This is a backend coding test I passed with 100% in April 2021 for a full-time position as a junior full-stack developer in a Singapore startup company, and lastly received a job offer which I'm grateful for to potentially kickstart my career just after my undergraduate graduation.

I really enjoyed this coding test so much, and learned new cool stuff within 4 hours given.

This repository contains the questions and the complete solutions in 2 separate folders obviously.

**Things I learned**

- more clean codes
- explored new libraries
- of course, backend knowledge

# Running the project

To run the project:
  * Clone the git repository
  * Install necessary modules using `npm install`
  * Run the project using `npm start`
  * To run the tests, use `npm run test`

---

# Problem Description

Some number of travellers  chooses to pay for airplane tickets on one of our travel partner's websites using Split.


While we make sure we get the periodic payments from the travellers, your job is to reimburse the travel partner the full amount paid for the tickets purchased in a certain date range on a specific day of the week.

​
We reimburse our travel partners periodically **once** or **twice** per week, depending on our business agreement with them.
​
If the agreement is **once per week**, we pay them on each **Monday**. If the agreement is **twice per week**, we pay them either on the next **Monday** or **Thursday**, whichever comes first.

To sum up:
  * For a travel partner we reimburse **Once per week**, all tickets purchased from **Monday** to **Sunday** should be reimbursed on the following **Monday**.
  * For a travel partner we reimburse **Twice per week**, all tickets purchased from **Monday** to **Wednesday** should be paid on the following **Thursday**. Tickets purchased from **Tursday** to **Sunday** should be paid on the following **Monday**.

The amount of money reimbursed to a travel partner is calculated by summing up the purchased tickets in the date range, minus a transaction fee for each ticket. (Which is what makes us money, yay!)
​
# Assignment 1
Given a start date and an end date, complete the two API endpoints for once-per-week partners and twice-per-week partners so that they return the correct reimbursement date. 

The endpoints can be found in `tickets.js.` and are called from `http://localhost:3000/tickets/oneSettlementPerWeek` and `http://localhost:3000/tickets/twoSettlementPerWeek` respectively.

Extra tip: `moment.js` is a nice JavaScript library to manipulate datetimes. It is included in `tickets.js`
​
## Example Input & Output
For a travel partner on **one payment per week**:

Input date range of **03-02-2020 to 05-02-2020**, next upcoming payment date will be **10-02-2020**

Input date range of **03-02-2020 to 06-02-2020**, next upcoming payment date will be **10-02-2020**

Input date range of **03-02-2020 to 10-02-2020**, next upcoming payment date will be **17-02-2020**


For a travel partner on **two payment per week**:

Input date range of **03-02-2020 to 05-02-2020**, next upcoming payment date will be **06-02-2020**

Input date range of **03-02-2020 to 06-02-2020**, next upcoming payment date will be **10-02-2020**

Input date range of **03-02-2020 to 07-02-2020**, next upcoming payment date will be **10-02-2020**

​

  
# Assignment 2
Given an array of ticket objects, complete the API endpoint `http://localhost:3000/tickets/calculateSettlementAmount` (Again in `tickets.js`) to calculate the total reimbursement after the transaction fee deduction. 

The transaction fee is specified in whole percentages.

The final total calculated reimbursement should be in two decimals points and always rounded up.

## Example Input & Output
`MDR = Merchant Discount Rate = The transaction fee in whole percentages`

``` 
//array of tickets 
[
  {
    "ticketId": "TE231023-23",
    "price" : 100,
    "MDR" : 2.33
  },
  {
    "ticketId": "KE23D0S3-J3",
    "price" : 231,
    "MDR" : 5.34
  },
  {
    "ticketId": "LDL40S3-U3",
    "price" : 659,
    "MDR" : 6.31 
  }
] 
``` 
For the above tickets, the result should be `(100 * (1 - 0.0233)) + (231 * (1 - 0.0534)) + (659 * (1 - 0.0631)) = 933.7517 = (always rounded up) 933.76`.

For rounding, if the computed total sum is 35.12356, the rounded up computed sum will be 35.13

If the computed total sum is 35.9926, the rouded up computed sum will be 36.00


# Assignment 3
Create 4 Restful API endpoints GET,POST,PUT,DELETE for tickets

Use NPM sqlite3 save the tickets https://www.npmjs.com/package/sqlite3

Data structure of ticket
```
{
  "ticketId":"TES2312-32",
  "price" , "203.10",
  "MDR" : "2.0",
  "currency" : "SGD",
  "travelAgentName" : "SPLIT-TEST-AGENT01"
}

```

Write test cases for the APIs you created

# Assignment 4

API route tickets/crashApp will cause the app process to crash

Provide a solution to restart the app instance if it crashes. 
