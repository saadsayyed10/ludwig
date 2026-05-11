import express from "express";

const app = express();

app.listen(3001, () => {
  console.log(`Server listening on PORT: 3001`);
});
