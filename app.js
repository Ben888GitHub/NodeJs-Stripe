const express = require("express");
const keys = require("./config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const app = express();

// stripe.setPublishableKey(
//   "pk_test_51HLsPIKIuI7jDMHkXC7yt43ek61KGgZqjmF2wZgpSuIs6vGMbdNXZR6Z3FhjZH1a5kobwwe4IqxlkIbLZBmfmELs00QHJx0cn3"
// );

// Handlebars Middleware (Optional)
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set static folder (Optional)
app.use(express.static(`${__dirname}/public`));

// INDEX ROUTE
app.get("/", (req, res) => {
  // res.send("Hello World");
  // console.log("Hello World");
  res.render("index", {
    stripePublishableKey: keys.stripePublishableKey,
  });
});

// CHARGE ROUTE
app.post("/charge", (req, res) => {
  const amount = 2500;
  // console.log(req.body);
  // res.send("Test");

  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    })
    .then((customer) =>
      stripe.charges.create({
        amount,
        description: "Web Development Ebook",
        currency: "usd",
        customer: customer.id,
      })
    )
    .then((charge) => res.render("success")); // Payment Successful
  //todo
});

// Payment Successful
// app.get("/success", (req, res) => {
//   res.render("success");
// });

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
