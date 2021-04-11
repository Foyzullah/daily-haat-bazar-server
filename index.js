const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q7rxz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const port = process.env.PORT || 5055;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Hi! Welcome to Daily-Haat-Bazar API");
});

client.connect((err) => {
  // Products collection
  const productsCollection = client.db("dailyHaatBazar").collection("products");

  // Order Collection
  const ordereCollection = client
    .db("dailyHaatBazar")
    .collection("orderedProducts");

  // Add Products
  app.post("/addProduct", (req, res) => {
    const newProduct = req.body;
    productsCollection.insertOne(newProduct).then((result) => {
      console.log("InsertCount", result.insertedCount);
      res.send(result);
    });
  });

  // Delete Product
  app.delete("/deleteProduct/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    productsCollection.findOneAndDelete({ _id: id });
  });

  // Get All Products
  app.get("/allProducts", (req, res) => {
    productsCollection.find().toArray((error, products) => {
      res.send(products);
    });
  });

  // Get Product by id
  app.get("/product/:id", (req, res) => {
    productsCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, product) => {
        res.send(product[0]);
      });
  });

  // Place Order
  app.post("/addOrder", (req, res) => {
    const newOrder = req.body;
    ordereCollection.insertOne(newOrder).then((result) => {
      res.send(result);
    });
  });

  // Get filter orders
  app.get("/orders", (req, res) => {
    ordereCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
});

app.listen(port, () => {
  console.log(`Daily Haat-Bazar app listening at http://localhost:${port}`);
});
