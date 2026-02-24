const env = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 7000;
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DataBase connected");
  })
  .catch((err) => {
    console.error(err.message);
  });

const todo = mongoose.model("todolist", {
  title: String,
});
// write data API Route
app.post("/todo", async (req, res) => {
  const createtask = new todo({
    title: req.body.name,
  });
  await createtask.save();

  res.status(200).send({
    success: true,
    message: "Task created successfully",
    data: createtask,
  });
});

// read Data API Route
app.get("/alltodos", async (req, res) => {
  const allTodos = await todo.find();

  res
    .status(200)
    .send({
      success: true,
      message: "all data fatch successful",
      data: allTodos,
    });
});

// err meddileware

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send(err.message ? err.message : "Internal server Erros");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
