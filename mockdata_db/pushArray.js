const { MongoClient } = require("mongodb");

const dbName = "heat_test";

async function main() {
  const uri = process.env.MONGO_URL;
  const client = new MongoClient(uri);
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    const db = client.db(dbName);
    const climac_positions = db.collection("climac_positions");
    const climac_position_window = db.collection("climac_position_window");
    let i = 0;
    // Change the coordinates randomly every second and save them to MongoDB
    await setInterval(function () {
      let docs = [];
      for (let index = 0; index < 8000; index++) {
        const coordinate = generateRandomCoordinate(bottomRight[0], topLeft[0], topLeft[1], bottomRight[1]);
        const document = {
          POSITION: {
            X: coordinate[0],
            Y: coordinate[1],
          },
          FLOOR: coordinate[2],
          WINDOW_START: i,
          CLIMAC: i * 5,
        };
        docs.push(document);
      }

      const options = {};
      climac_positions
        .countDocuments()
        .then((count_documents) => {
          console.log(count_documents);
        })
        .catch((err) => {
          console.log(err.Message);
        });
      climac_position_window.insertOne({ WINDOW_START: i });
      climac_positions.insertMany(docs, options);
      i++;
    }, 10000);
    // Make the appropriate DB calls
    // await  listDatabases(client);
  } catch (e) {
    console.error(e);
  }
}

main().catch(console.error);

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}
const floors = ["D", "E", "F", "H"];

function generateRandomCoordinate(minLat, maxLat, minLng, maxLng) {
  const lat = Math.random() * (maxLat - minLat) + minLat;
  const lng = Math.random() * (maxLng - minLng) + minLng;
  const randomFloor = Math.floor(Math.random() * floors.length);

  return [lat, lng, floors[randomFloor]];
}

const topLeft = [41.26809462301776, 28.733795269017957];
const bottomRight = [41.25671860991329, 28.751201054784357];
