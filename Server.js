const express = require("express");
const path = require("path");

const session = require("express-session");
const SessionStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");

const homeRouter = require("./routes/home.route");
const productRouter = require("./routes/product.route");
const authRouter = require("./routes/auth.route");
const cartRouter = require("./routes/cart.route");
const orderRouter = require("./routes/order.route");
const adminRouter = require("./routes/admin.route");

const app = express();
//middleware
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "images")));
app.use(flash());

const STORE = new SessionStore({
  uri:
"mongodb://zaineb:95031285@cluster0-shard-00-00.tiwju.mongodb.net:27017,cluster0-shard-00-01.tiwju.mongodb.net:27017,cluster0-shard-00-02.tiwju.mongodb.net:27017/online-shop?ssl=true&replicaSet=atlas-b7hvlg-shard-0&authSource=admin&retryWrites=true&w=majority",
  collection: "sessions",
});

app.use(
  session({
    secret: "this is my secret to hash express sessions .....",
    saveUninitialized: false, //session created but not used
    cookie: {},
    store: STORE,
  })
);

app.set("view engine", "ejs");
app.set("views", "views"); //2nd folder default

//toRoutes

app.use("/", homeRouter);
app.use("/", authRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/admin", adminRouter);
app.get("/not-admin", (req, res, next) => {
  res.status(403);
  res.render("not-admin", {
    isUser: req.session.userId,
    isAdmin: false,
  });
});
app.get("/error", (req, res, next) => {
  res.render("error", {
    isUser: req.session.userId,
    isAdmin: false,
    pageTitle: "Error",
    error: req.flash("serverError")[0],
  });
});

app.use((error, req, res, next) => {
  res.redirect("/error");
});
app.use((req, res, next) => {
  res.status(400);
  res.render("not-found", {
    isUser: req.session.userId,
    isAdmin: req.session.isAdmin,
    pageTitle: "404 Not Found",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("listen port :", PORT);
});
