const express = require("express");
const cors = require ('cors');
const bodyParser = require ('body-parser');
const {client} = require("./utils/db.js");
const populationRouter = require("./apps/population.js")

async function init () {
const app = express();

const PORT = process.env.PORT | 5000;

await client.connect();

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true}));

app.use("/country",populationRouter);

app.get('/',(req,res) => {
    res.json({message:"Hello,From Backend!!!!"})
})
app.get("*", (req,res) => {
    res.status(404).send("Not Found");
});

app.listen(PORT,() => {
    console.log(`Server is listening on ${PORT}...`);
})
}
init();