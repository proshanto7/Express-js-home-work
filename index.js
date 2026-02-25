const env = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 7000;
app.use(express.json());
app.use(cors());
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

  res.status(200).send({
    success: true,
    message: "all data fatch successful",
    data: allTodos,
  });
});

// task delet API Route

app.delete("/delettodo/:id", async (req, res) => {
  const id = req.params.id;
  const deletTodo = await todo.findByIdAndDelete(id);
  if (!deletTodo) {
    return res.status(404).json({
      success: false,
      message: "Data Not Found",
      data: deletTodo,
    });
  } else {
    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: deletTodo,
    });
  }
});

// update data API Route

app.patch("/updateTask/:id", async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const updateTask = await todo.findByIdAndUpdate(
    id,
    { title: name },
    { new: true },
  );

  if (!updateTask) {
    return res.status(404).send({
      success: false,
      message: "Data Not Found",
      data: updateTask,
    });
  } else {
    return res.status(200).send({
      success: true,
      message: "task Update successfully",
      data: updateTask,
    });
  }
});

// err meddileware

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send(err.message ? err.message : "Internal server Erros");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
