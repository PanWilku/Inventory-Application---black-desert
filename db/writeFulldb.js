const fs = require("fs");
const path = require("path");


const API_URL = "https://api.arsha.io/v2/eu/market";

//write a .jsonfile with data from api_url
async function fetchData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const filePath = path.join(__dirname, "../data", "items.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log("Data fetched and saved to items.json");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


fetchData().then(() => {
    console.log("Data fetch complete.");
  })