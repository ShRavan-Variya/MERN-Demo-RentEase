const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//MongoDB connection
mongoose.connect("mongodb://localhost:27017/RentEaseDB", {useNewUrlParser: true, useUnifiedTopology: true,})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error", err));

const PORT =process.env.PORT || 5000; 

const usersRouter = require('./routes/users_route_tbl');
app.use('/api',usersRouter)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));