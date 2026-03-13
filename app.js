const express = require('express');
require('dotenv').config();
const { indexRouter } = require('./routes/indexRoute');
const app = express();
const { searchRouter } = require('./routes/searchRouter');
const { addCategoryRouter } = require('./routes/addCategoryRoute');
const { deleteCategoryRouter } = require('./routes/deleteCategoryRoute');
const { addItemRouter } = require('./routes/addItemRoute');
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



app.use('/', indexRouter);
app.use('/search', searchRouter);
app.use('/add-category', addCategoryRouter);
app.use('/delete-category', deleteCategoryRouter);
app.use('/add-item', addItemRouter);


app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("❌ Error:", err.stack);

  res.status(status).json({
    error: {
      message,
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


