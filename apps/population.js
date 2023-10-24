const { ObjectId } = require("mongodb");
const express = require('express')
const { db } = require("../utils/db.js");
const XLSX = require("xlsx");
const fs = require("fs");

const router = express.Router()

router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

router.post("/", async (req, res) => {
  const data = fs.readFileSync("./population-and-demography.csv");
  const workbook = XLSX.read(data);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  let raw_data = XLSX.utils.sheet_to_json(worksheet);

  for (let i=0;i<raw_data.length;i++) {
    if (Asia.includes(raw_data[i]["Country name"])) {
    raw_data[i] = {...raw_data[i],Continent:"Asia"}
    }
    if (Africa.includes(raw_data[i]["Country name"])) {
      raw_data[i] = {...raw_data[i],Continent:"Africa"}
    }
    if (Oceania.includes(raw_data[i]["Country name"])) {
      raw_data[i] = {...raw_data[i],Continent:"Oceania"}
    }
    if (Europe.includes(raw_data[i]["Country name"])) {
      raw_data[i] = {...raw_data[i],Continent:"Europe"}
    }
    if (America.includes(raw_data[i]["Country name"])) {
      raw_data[i] = {...raw_data[i],Continent:"America"}
    }
  }

  const collection = db.collection("Countries");
  const population = await collection.insertMany(raw_data);

  return res.json({
    message: `Success`,
  });
});

router.post("/get-by-year", async (req, res) => {
  const collection = db.collection("Countries");
  let results = [];
  let worldPopulation = []
  let year = 1950;
    for (year;year<=2021;year++) {
    if (req.body.continent && req.body.continent?.length > 0) {
      worldPopulation = await collection
      .find(
        { Year: year , Continent:{ $in: req.body.continent }},
        { projection: { "Country name": 1, _id: 0, Year: 1, Population: 1 } }
      )
      .toArray();
    } else {
        worldPopulation = await collection
        .find(
          {Year: year, Continent: { $exists : true }},
          { projection: { "Country name": 1, _id: 0, Year: 1, Population: 1 } }
        )
        .toArray();
    
  }
  worldPopulation.sort((a, b) => b.Population - a.Population);
    const top12Countries = worldPopulation.slice(0, 12);
    results = [...results,...top12Countries]
}
  return res.json({
    results,
  });
});

router.post("/get-total-by-year", async (req, res) => {
  const collection = db.collection("Countries");
  let results = [];
    const worldPopulation = await collection
      .find(
        { "Country name": "World" },
        { projection: { _id: 0, Year: -1, Population: 1 } }
      )
      .toArray();
    // results = [...worldPopulation];
  console.log(worldPopulation);
  return res.json({
    worldPopulation,
  });
});

module.exports = router;

const country = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bonaire Sint Eustatius and Saba",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "British Virgin Islands",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Cook Islands",
  "Costa Rica",
  "Cote d'Ivoire",
  "Croatia",
  "Cuba",
  "Curacao",
  "Cyprus",
  "Czechia",
  "Democratic Republic of Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Falkland Islands",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macao",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia (country)",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Niue",
  "North Korea",
  "North Macedonia",
  "Northern Mariana Islands",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Reunion",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Barthelemy",
  "Saint Helena",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Martin (French part)",
  "Saint Pierre and Miquelon",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Sint Maarten (Dutch part)",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "United States Virgin Islands",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Wallis and Futuna",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];
const continent = [
  "Africa (UN)",
  "Oceania (UN)",
  "Northern America (UN)",
  "Latin America and the Caribbean (UN)",
  "Europe (UN)",
  "Asia (UN)",
];
const Africa = [
  "Angola",
  "Burkina Faso",
  "Burundi",
  "Benin",
  "Botswana",
  "Congo",
  "Central African Republic",
  "Congo",
  "Cote d'Ivoire",
  "Cameroon",
  "Cabo Verde",
  "Djibouti",
  "Algeria",
  "Egypt",
  "Western Sahara",
  "Eritrea",
  "Ethiopia",
  "Gabon",
  "Ghana",
  "Gambia",
  "Guinea",
  "Equatorial Guinea",
  "Guinea-Bissau",
  "Kenya",
  "Comoros",
  "Liberia",
  "Lesotho",
  "Libya",
  "Morocco",
  "Madagascar",
  "Mali",
  "Mauritania",
  "Mauritius",
  "Malawi",
  "Mozambique",
  "Namibia",
  "Niger",
  "Nigeria",
  "Reunion",
  "Rwanda",
  "Seychelles",
  "Sudan",
  "Saint Helena, Ascension and Tristan da Cunha",
  "Sierra Leone",
  "Senegal",
  "Somalia",
  "South Sudan",
  "Sao Tome and Principe",
  "Eswatini",
  "Chad",
  "Togo",
  "Tunisia",
  "Tanzania, United Republic of",
  "Uganda",
  "Mayotte",
  "South Africa",
  "Zambia",
  "Zimbabwe",
];
const Asia = [
  "United Arab Emirates",
  "Afghanistan",
  "Armenia",
  "Azerbaijan",
  "Bangladesh",
  "Bahrain",
  "Brunei Darussalam",
  "Bhutan",
  "Cocos Islands",
  "China",
  "Christmas Island",
  "Cyprus",
  "Georgia",
  "Hong Kong",
  "Indonesia",
  "Israel",
  "India",
  "British Indian Ocean Territory",
  "Iraq",
  "Iran",
  "Jordan",
  "Japan",
  "Kyrgyzstan",
  "Cambodia",
  "Korea",
  "Kuwait",
  "Kazakhstan",
  "Laos",
  "Lebanon",
  "Sri Lanka",
  "Myanmar",
  "Mongolia",
  "Macao",
  "Maldives",
  "Malaysia",
  "Nepal",
  "Oman",
  "Philippines",
  "Pakistan",
  "Palestine",
  "Qatar",
  "Russian Federation",
  "Saudi Arabia",
  "Singapore",
  "Syrian Arab Republic",
  "Thailand",
  "Tajikistan",
  "Timor-Leste",
  "Turkmenistan",
  "Turkey",
  "Taiwan",
  "Uzbekistan",
  "Viet Nam",
  "Yemen",
];

const Europe = [
  "Andorra",
  "Albania",
  "Armenia",
  "Austria",
  "Aland Islands",
  "Azerbaijan",
  "Bosnia and Herzegovina",
  "Belgium",
  "Bulgaria",
  "Belarus",
  "Switzerland",
  "Cyprus",
  "Czechia",
  "Germany",
  "Denmark",
  "Estonia",
  "Spain",
  "Finland",
  "Faroe Islands",
  "France",
  "United Kingdom",
  "Georgia",
  "Guernsey",
  "Gibraltar",
  "Greece",
  "Croatia",
  "Hungary",
  "Ireland",
  "Isle of Man",
  "Iceland",
  "Italy",
  "Jersey",
  "Kazakhstan",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Latvia",
  "Monaco",
  "Moldova",
  "Montenegro",
  "North Macedonia",
  "Malta",
  "Netherlands",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Serbia",
  "Russian Federation",
  "Russia",
  "Sweden",
  "Slovenia",
  "Svalbard and Jan Mayen",
  "Slovakia",
  "San Marino",
  "Turkey",
  "Ukraine",
  "Holy See",
];

const America = [
  "Antigua and Barbuda",
  "Anguilla",
  "Aruba",
  "Barbados",
  "Saint Barthelemy",
  "Bermuda",
  "Bonaire, Sint Eustatius and Saba",
  "Bahamas",
  "Belize",
  "Canada",
  "Costa Rica",
  "Cuba",
  "Curaçao",
  "Dominica",
  "Dominican Republic",
  "Grenada",
  "Greenland",
  "Guadeloupe",
  "Guatemala",
  "Honduras",
  "Haiti",
  "Jamaica",
  "Saint Kitts and Nevis",
  "Cayman Islands",
  "Saint Lucia",
  "Saint Martin",
  "Martinique",
  "Montserrat",
  "Mexico",
  "Nicaragua",
  "Panama",
  "Saint Pierre and Miquelon",
  "Puerto Rico",
  "El Salvador",
  "Sint Maarten",
  "Turks and Caicos Islands",
  "Trinidad and Tobago",
  "United States Minor Outlying Islands",
  "United States",
  "Saint Vincent and the Grenadines",
  "Virgin Islands",
  "Argentina",
  "Bolivia",
  "Brazil",
  "Chile",
  "Colombia",
  "Ecuador",
  "Falkland Islands",
  "French Guiana",
  "Guyana",
  "Peru",
  "Paraguay",
  "Suriname",
  "Uruguay",
  "Venezuela",
];

const Oceania = [
  "American Samoa",
  "Australia",
  "Cook Islands",
  "Fiji",
  "Micronesia (Federated States of)",
  "Guam",
  "Kiribati",
  "Marshall Islands",
  "Northern Mariana Islands",
  "New Caledonia",
  "Norfolk Island",
  "Nauru",
  "Niue",
  "New Zealand",
  "French Polynesia",
  "Papua New Guinea",
  "Pitcairn",
  "Palau",
  "Solomon Islands",
  "Tokelau",
  "Tonga",
  "Tuvalu",
  "United States Minor Outlying Islands",
  "Vanuatu",
  "Wallis and Futuna",
  "Samoa",
];


// countryRouter.post("/createCountry", async (req, res) => {
//   const collection = db.collection("NameOfCountries");
//   let array = country.map((item) => {
//     return { country: `${item}`, continent: "" };
//   });
//   for (const entry of array) {
//     entry.continent = findContinent(entry.country);
//   }
//   const population = await collection.insertMany(array);
//   return res.json({
//     message: population,
//   });
// });
// function findContinent(country) {
//   if (Africa.includes(country)) {
//     return "Africa";
//   } else if (Asia.includes(country)) {
//     return "Asia";
//   } else if (Europe.includes(country)) {
//     return "Europe";
//   } else if (America.includes(country)) {
//     return "America";
//   } else if (Oceania.includes(country)) {
//     return "Oceania";
//   } else {
//     return "Unknown";
//   }
// }
