import { RebootToDownload, readFileFromAndroid } from "../ADB/SendHandler";
import { createFile } from "../ADB/SendHandler";
import { l } from "../ADB/SendHandler";
import fs from "fs";
import { db } from "..";
import { textConvert } from "../Helper/textConvert";

let returnTable: any = [];

const MapLamps = function ({ SetMap }: any) {
  console.log("firstcheckin", SetMap.request);
  return new Promise((resolve, reject) => {
    SetMap.mapName = textConvert(SetMap.mapName);

    if (SetMap.request === "newMap") {
      db.run(
        `CREATE TABLE ${SetMap.mapName} (id text UNIQUE, lat text,lng text, bulbId text UNIQUE)`,
        (err, table) => {
          if (err) {
            reject(err);
            console.log(err);
          }
          console.log(table);
          resolve({
            eventList: JSON.stringify(table),
          });
        }
      );
    } else if (SetMap.request === "load") {
      // Load map pins
      db.all(`SELECT * FROM ${SetMap.mapName}`, (err, table) => {
        if (err) {
          reject(err);
          console.log(err);
        }
        resolve({
          bulbIdList: JSON.stringify(availableBulbIdListFilter(l, table)),
          mapArray: JSON.stringify(table),
          availableBulbIdList: availableBulbIdListFilter(l, table),
        });
        console.log("table", table);
      });
    }
    //end of load map pins
    else if (SetMap.request === "update") {
      db.run(
        `UPDATE ${SetMap.mapName} SET lat = ?, lng = ? WHERE id = ?`,
        [`${SetMap.lat}`, `${SetMap.lng}`, `${SetMap.bulbNumber}`],
        (err, table) => {
          if (err) {
            reject(err);
            console.log(err);
          }

          resolve({ mapArray: null });
        }
      );
    } else if (SetMap.request === "updateBulbId") {
      db.run(
        `UPDATE ${SetMap.mapName} SET bulbId = ? WHERE id = ?`,
        [`${SetMap.bulbId}`, `${SetMap.bulbNumber}`],
        (err, table) => {
          if (err) {
            reject(err);
            console.log(err);
          }

          resolve({ mapArray: null });
        }
      );
    } else if (SetMap.request === "addLamp") {
      console.log(
        "addLamp",
        SetMap.request,
        SetMap.bulbNumber,
        SetMap.lat,
        SetMap.lng,
        SetMap.mapName
      );

      db.run(
        `INSERT INTO ${SetMap.mapName} (id ,lat, lng) VALUES (?,?,?)`,
        [`${SetMap.bulbNumber}`, `${SetMap.lat}`, `${SetMap.lng}`],
        (err, table) => {
          if (err) {
            reject(err);
            console.log(err);
          }
          console.log(table);
          resolve({
            bulbIdList: JSON.stringify(l),
            eventList: JSON.stringify(table),
          });
        }
      );
    } else if (SetMap.request === "firstLoad") {
      db.all(`PRAGMA table_list`, (err, table) => {
        if (err) {
          reject(err);
          console.log(err);
        }

        resolve({
          bulbIdList: JSON.stringify(l),
          eventList: JSON.stringify(table),
        });
      });
    } else if (SetMap.request === "delete") {
      db.run(`DROP TABLE ${SetMap.mapName}`, (err, table) => {
        if (err) {
          reject(err);
          console.log(err);
        }
        console.log(table);
        resolve({
          eventList: JSON.stringify(table),
        });
      });
    } else reject("no valid request");
  });
};

// const availableBulbIdListFilter = (fullList, mapArray) => {
//   let temp = mapArray.filter((e) => {
//     return e.bulbId;
//   });
//   console.log(temp);
// };

const availableBulbIdListFilter = (fullList, mapArray) => {
  console.log("eregfgf", fullList, mapArray);
  let adjustedList = JSON.parse(JSON.stringify(fullList));
  mapArray.forEach((element) => {
    if (element.bulbId) {
      console.log(element.bulbId);
      delete adjustedList[element.bulbId];
    }
  });
  console.log("view", adjustedList);
  return adjustedList;
};

const ControlDevice = async function ({ SetValues }: any) {
  console.log(SetValues.sendToAndroid);
  console.log(SetValues.createLightFile);

  if (SetValues.sendToAndroid === "true") {
    console.log("valcheck");

    RebootToDownload();
  }

  if (SetValues.readFileFromAndroid === "true") {
    console.log("valcheck");

    readFileFromAndroid();
  }

  if (SetValues.createLightFile === "true") {
    const buildMapping = async (mapName) => {
      let bulbArray: Array<String> = [];

      let promise = new Promise((resolve, reject) => {
        db.all(`SELECT * FROM ${mapName}`, (err, table) => {
          table.forEach((element) => {
            if (element.bulbId) {
              bulbArray.push(l[element.bulbId]);
              console.log("tft", bulbArray);
            }
          });
          resolve(table);
        });
      });
      let waitingBulbArray = await promise;
      console.log("testing", bulbArray);

      createFile(SetValues.bulbMovement, SetValues.bulbColours, bulbArray);
      return bulbArray;
    };
    buildMapping(SetValues.mapping);
  }
  return { notDefined: "bla" };
};

const graphqlResolver = {
  ControlDevice: ControlDevice,
  MapLamps: MapLamps,
};

export { graphqlResolver };
