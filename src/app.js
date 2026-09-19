const express = require("express");
const app = express();

const path = require("path");
require("dotenv").config();

const applyMiddlewares = require("./middlewares");
const globalErrorHandler = require("./utils/globalErrorHandler");
const applyRouter = require("./routes/router");

//serve client side file path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./public"));
app.use(express.static(path.join(__dirname, "./public")));

//Frontpage route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// midlewares
applyMiddlewares(app);

//  All Routes
applyRouter(app);

// handling all (get,post,update,delete.....) unhandled routes
app.all("*", (req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on the server`);
  error.status = 404;
  next(error);
});

// error handling middleware
app.use(globalErrorHandler);

module.exports = app;
