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
exports.lampActions = void 0;
const __1 = require("..");
const resolvers_1 = require("../graphql/resolvers");
const SendHandler_1 = require("../ADB/SendHandler");
const lampActions = ({ SetMap }) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        console.log("request", SetMap.request);
        // Change all IDS to random values
        let scantype = "";
        console.log(SetMap.request);
        const scan = (scantype) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let newId = 0;
                let tempId = 1000;
                let finishCheck = 0;
                const resetID = () => __awaiter(void 0, void 0, void 0, function* () {
                    yield __1.db.all(`SELECT lng, lat, bulbId FROM ${SetMap.mapName} ORDER BY ${scantype}`, (err, table) => {
                        table.map((element, index) => __awaiter(void 0, void 0, void 0, function* () {
                            finishCheck = table.length;
                            yield __1.db.run(`UPDATE ${SetMap.mapName} SET id = ? WHERE lng = ?`, [`${(tempId = tempId + 1)}`, `${element.lng}`], (err, table) => {
                                console.log(table);
                            });
                        }));
                    });
                });
                resetID();
                setTimeout(() => {
                    __1.db.all(`SELECT lng, lat, bulbId FROM ${SetMap.mapName} ORDER BY ${scantype}`, (err, table) => {
                        table.map((element) => {
                            newId = newId + 1;
                            __1.db.run(`UPDATE ${SetMap.mapName} SET id = ? WHERE lng = ?`, [`${newId}`, `${element.lng}`], (err, table) => {
                                console.log(err);
                            });
                        });
                    });
                }, 1500);
                // setTimeout(() => {
                //   db.all(
                //     `SELECT id, lng, lat, bulbId FROM ${SetMap.mapName} ORDER BY id + 0`,
                //     (err, table) => {},
                //     700
                //   );
                // });
                setTimeout(() => {
                    __1.db.all(`SELECT * FROM ${SetMap.mapName} ORDER BY id + 0 ASC`, (err, table) => {
                        if (err) {
                            reject(err);
                        }
                        resolve({
                            bulbIdList: JSON.stringify((0, resolvers_1.availableBulbIdListFilter)(SendHandler_1.l, table)),
                            mapArray: JSON.stringify(table),
                            availableBulbIdList: (0, resolvers_1.availableBulbIdListFilter)(SendHandler_1.l, table),
                        });
                    });
                }, 1900);
            });
        });
        const deleteActive = () => __awaiter(void 0, void 0, void 0, function* () {
            yield __1.db.all(`DELETE FROM ${SetMap.mapName} WHERE id = ${SetMap.bulbNumber}`);
            yield __1.db.all(`SELECT * FROM ${SetMap.mapName} ORDER BY id + 0 ASC`, (err, table) => {
                table.map((element, index) => __awaiter(void 0, void 0, void 0, function* () {
                    console.log(element);
                    yield __1.db.run(`UPDATE ${SetMap.mapName} SET id = ? WHERE key = ?`, [
                        `${SetMap.bulbNumber > Number(element.id)
                            ? Number(element.id)
                            : Number(element.id) + 1000}`,
                        `${element.key}`,
                    ], (err, table) => {
                        console.log(err);
                    });
                }));
            });
            setTimeout(() => {
                __1.db.all(`SELECT lng, lat, bulbId, id FROM ${SetMap.mapName}`, (err, table) => {
                    table.map((element, index, oldArr) => __awaiter(void 0, void 0, void 0, function* () {
                        let temp;
                        console.log("current element being worked on", element.id, element);
                        if (Number(element.id) >= 1000) {
                            temp = JSON.parse(JSON.stringify(Number(element.id) - 1001));
                            console.log("whatis", temp);
                        }
                        else {
                            temp = element.id;
                            console.log("validate");
                        }
                        console.log("what2", temp, element.id);
                        yield __1.db.run(`UPDATE ${SetMap.mapName} SET id = ? WHERE id = ?`, [`${temp}`, `${element.id}`], (err, table) => {
                            console.log(err);
                        });
                    }));
                });
            }, 900);
            setTimeout(() => {
                __1.db.all(`SELECT * FROM ${SetMap.mapName} ORDER BY id + 0 ASC`, (err, table) => {
                    if (err) {
                        reject(err);
                    }
                    resolve({
                        bulbIdList: JSON.stringify((0, resolvers_1.availableBulbIdListFilter)(SendHandler_1.l, table)),
                        mapArray: JSON.stringify(table),
                        availableBulbIdList: (0, resolvers_1.availableBulbIdListFilter)(SendHandler_1.l, table),
                    });
                });
            }, 1500);
        });
        const addLampBeforeActive = () => __awaiter(void 0, void 0, void 0, function* () {
            // await db.all(
            //         `DELETE FROM ${SetMap.mapName} WHERE id = ${SetMap.bulbNumber}`
            //       );
            yield __1.db.all(`SELECT * FROM ${SetMap.mapName} ORDER BY id + 0 ASC`, (err, table) => {
                table.map((element, index) => __awaiter(void 0, void 0, void 0, function* () {
                    console.log(element);
                    yield __1.db.run(`UPDATE ${SetMap.mapName} SET id = ? WHERE key = ?`, [
                        `${SetMap.bulbNumber > Number(element.id)
                            ? Number(element.id)
                            : Number(element.id) + 1000}`,
                        `${element.key}`,
                    ], (err, table) => {
                        console.log(err);
                    });
                }));
            });
            setTimeout(() => {
                __1.db.all(`SELECT lng, lat, bulbId, id FROM ${SetMap.mapName}`, (err, table) => {
                    table.map((element, index, oldArr) => __awaiter(void 0, void 0, void 0, function* () {
                        let temp;
                        console.log("current element being worked on", element.id, element);
                        if (Number(element.id) >= 1000) {
                            temp = JSON.parse(JSON.stringify(Number(element.id) - 999));
                            console.log("whatis", temp);
                        }
                        else {
                            temp = element.id;
                            console.log("validate");
                        }
                        console.log("what2", temp, element.id);
                        yield __1.db.run(`UPDATE ${SetMap.mapName} SET id = ? WHERE id = ?`, [`${temp}`, `${element.id}`], (err, table) => {
                            console.log(err);
                        });
                    }));
                });
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
                });
            }, 900);
            setTimeout(() => {
                __1.db.all(`SELECT * FROM ${SetMap.mapName} ORDER BY id + 0 ASC`, (err, table) => {
                    if (err) {
                        reject(err);
                    }
                    resolve({
                        bulbIdList: JSON.stringify((0, resolvers_1.availableBulbIdListFilter)(SendHandler_1.l, table)),
                        mapArray: JSON.stringify(table),
                        availableBulbIdList: (0, resolvers_1.availableBulbIdListFilter)(SendHandler_1.l, table),
                    });
                });
            }, 1500);
        });
        if (SetMap.request === "horizontalScan") {
            resolve(scan("lat DESC"));
        }
        else if (SetMap.request === "verticalScan") {
            resolve(scan("lng ASC"));
        }
        else if (SetMap.request === "deleteActive") {
            deleteActive();
        }
        else if (SetMap.request === "addLampBeforeActive") {
            addLampBeforeActive();
        }
    });
});
exports.lampActions = lampActions;
