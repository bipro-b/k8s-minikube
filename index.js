const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
// Get data from client site
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uo7uglt.mongodb.net/l-tech?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("database connected");

    const database = client.db("ltechDB");

    const coursesCollection = database.collection("courses");

    const enrollCollection = database.collection("enroll");

    const usersCollection = database.collection("ussers");
    const reviewCollection = database.collection("review");
    const assignCourseCollection = database.collection("assigncourse");

    //GET fetch courses data

    app.get("/courses", async (req, res) => {
      const courses = coursesCollection.find({});
      const course = await courses.toArray();
      ~res.send(course);
    });

    //Get assigned courses
    app.get("/assigncourse", async (req, res) => {
      const assigns = assignCourseCollection.find({});
      const assign = await assigns.toArray();
      res.send(assign);
    });
    // get single enroll
    app.get("/enroll", async (req, res) => {
      let query = {};
      const email = req.query.email;
      if (email) {
        query = { email: email };
      }
      const cursor = enrollCollection.find(query);
      const enroll = await cursor.toArray();
      res.send(enroll);
    });

    // Get enroll
    app.get("/enroll", async (req, res) => {
      const enrolls = enrollCollection.find({});
      const enroll = await enrolls.toArray();
      res.send(enroll);
    });

    // Get Review
    app.get("/review", async (req, res) => {
      const reviews = reviewCollection.find({});
      const review = await reviews.toArray();
      res.send(review);
    });
    // Get users
    app.get("/users", async (req, res) => {
      const users = usersCollection.find({});
      const user = await users.toArray();
      res.send(user);
    });
    // get Admin
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role == "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    // Get teacher

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isTeacher = false;
      if (user?.keep == "teacher") {
        isTeacher = true;
      }
      res.json({ teacher: isTeacher });
    });

    // update

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    // add admin

    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // add teacher
    app.put("/user/teacher", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { keep: "teacher" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // POST courses

    app.post("/courses", async (req, res) => {
      const course = req.body;
      const result = await coursesCollection.insertOne(course);
      res.json(result);
    });

    // post assigning course
    app.post("/assigncourse", async (req, res) => {
      const assign = req.body;
      const result = await assignCourseCollection.insertOne(assign);
      res.json(result);
    });
    // POST enrolling data

    app.post("/enroll", async (req, res) => {
      const enroll = req.body;
      const result = await enrollCollection.insertOne(enroll);
      res.json(result);
    });

    // Post users
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    // post review
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });

    // delete enrolment API
    app.delete("/enroll/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await enrollCollection.deleteOne(query);
      console.log("delete", result);
      res.json(result);
    });

    // Delete course api
    app.delete("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await coursesCollection.deleteOne(query);
      console.log("delete", result);
      res.json(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running ");
});

app.listen(port, () => {
  console.log(`App listening a http://localhost:${port}`);
});
