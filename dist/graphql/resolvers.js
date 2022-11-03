"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlResolver = exports.availableBulbIdListFilter = void 0;
const SendHandler_1 = require("../ADB/SendHandler");
const SendHandler_2 = require("../ADB/SendHandler");
const SendHandler_3 = require("../ADB/SendHandler");
const __1 = require("..");
const textConvert_1 = require("../Helper/textConvert");
const mapEffects_1 = require("../Helper/mapEffects");
let returnTable = [];
const MapLamps = function ({ SetMap }) {
    return new Promise((resolve, reject) => {
        SetMap.mapName = (0, textConvert_1.textConvert)(SetMap.mapName);
        if (SetMap.request === "verticalScan" ||
            SetMap.request === "horizontalScan" ||
            SetMap.request === "deleteActive" ||
            SetMap.request === "addLampBeforeActive") {
            resolve((0, mapEffects_1.lampActions)({ SetMap }));
        }
        else if (SetMap.request === "newMap") {
            __1.db.run(`CREATE TABLE ${SetMap.mapName} (id text UNIQUE, lat text,lng text, bulbId text UNIQUE, key text UNIQUE)`, (err, table) => {
                if (err) {
                    reject(err);
                }
                resolve({
                    eventList: JSON.stringify(table),
                });
            });
        }
        else if (SetMap.request === "load") {
            // Load map pins
            __1.db.all(`SELECT * FROM ${SetMap.mapName} ORDER BY id + 0 ASC`, (err, table) => {
                if (err) {
                    reject(err);
                }
                resolve({
                    bulbIdList: JSON.stringify((0, exports.availableBulbIdListFilter)(SendHandler_3.l, table)),
                    mapArray: JSON.stringify(table),
                    availableBulbIdList: (0, exports.availableBulbIdListFilter)(SendHandler_3.l, table),
                });
            });
        }
        //end of load map pins
        else if (SetMap.request === "update") {
            __1.db.run(`UPDATE ${SetMap.mapName} SET lat = ?, lng = ? WHERE id = ?`, [`${SetMap.lat}`, `${SetMap.lng}`, `${SetMap.bulbNumber}`], (err, table) => {
                if (err) {
                    reject(err);
                }
                resolve({ mapArray: null });
            });
        }
        else if (SetMap.request === "updateBulbId") {
            __1.db.run(`UPDATE ${SetMap.mapName} SET bulbId = ? WHERE id = ?`, [`${SetMap.bulbId}`, `${SetMap.bulbNumber}`], (err, table) => {
                if (err) {
                    reject(err);
                    console.log(err);
                }
                resolve({ mapArray: null });
            });
        }
        else if (SetMap.request === "addLamp") {
            console.log("addLamp", SetMap.request, SetMap.bulbNumber, SetMap.lat, SetMap.lng, SetMap.mapName);
            __1.db.run(`INSERT INTO ${SetMap.mapName} (id ,lat, lng, key) VALUES (?,?,?,?)`, [
                `${SetMap.bulbNumber}`,
                `${SetMap.lat}`,
                `${SetMap.lng}`,
                Math.random(),
            ], (err, table) => {
                if (err) {
                    reject(err);
                    console.log(err);
                }
                resolve({
                    bulbIdList: JSON.stringify(SendHandler_3.l),
                    eventList: JSON.stringify(table),
                });
            });
        }
        else if (SetMap.request === "firstLoad") {
            __1.db.all(`PRAGMA table_list`, (err, table) => {
                if (err) {
                    reject(err);
                    console.log(err);
                }
                resolve({
                    bulbIdList: JSON.stringify(SendHandler_3.l),
                    eventList: JSON.stringify(table),
                });
            });
        }
        else if (SetMap.request === "delete") {
            __1.db.run(`DROP TABLE ${SetMap.mapName}`, (err, table) => {
                if (err) {
                    reject(err);
                    console.log(err);
                }
                resolve({
                    eventList: JSON.stringify(table),
                });
            });
        }
        else
            reject("no valid request");
    });
};
// const availableBulbIdListFilter = (fullList, mapArray) => {
//   let temp = mapArray.filter((e) => {
//     return e.bulbId;
//   });
//   console.log(temp);
// };
const availableBulbIdListFilter = (fullList, mapArray) => {
    let adjustedList = JSON.parse(JSON.stringify(fullList));
    mapArray.forEach((element) => {
        if (element.bulbId) {
            delete adjustedList[element.bulbId];
        }
    });
    return adjustedList;
};
exports.availableBulbIdListFilter = availableBulbIdListFilter;
const ControlDevice = function ({ SetValues }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (SetValues.sendToAndroid === "true") {
            (0, SendHandler_1.RebootToDownload)();
        }
        if (SetValues.readFileFromAndroid === "true") {
            (0, SendHandler_1.readFileFromAndroid)();
        }
        if (SetValues.createLightFile === "true") {
            const buildMapping = (mapName) => __awaiter(this, void 0, void 0, function* () {
                let bulbArray = [];
                let promise = new Promise((resolve, reject) => {
                    __1.db.all(`SELECT * FROM ${mapName}`, (err, table) => {
                        table.forEach((element) => {
                            if (element.bulbId) {
                                bulbArray.push(SendHandler_3.l[element.bulbId]);
                            }
                        });
                        resolve(table);
                    });
                });
                let waitingBulbArray = yield promise;
                (0, SendHandler_2.createFile)(SetValues.bulbMovement, SetValues.bulbColours, bulbArray);
                return bulbArray;
            });
            buildMapping(SetValues.mapping);
        }
        return { notDefined: "bla" };
    });
};
const graphqlResolver = {
    ControlDevice: ControlDevice,
    MapLamps: MapLamps,
};
exports.graphqlResolver = graphqlResolver;
