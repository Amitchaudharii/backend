const express = require("express");
const cors = require('cors')
const app = express();
const db = require("./models");
const PORT = process.env.PORT || 3000;

app.use(cors())

app.use(express.urlencoded(({ extended: true })));
app.use(express.json());

const apiRouter = require("./routes/apiRoutes");
app.use("/api", apiRouter);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`listening on: http://localhost:${PORT}`);
    });
});