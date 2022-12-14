"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
exports.default = (0, graphql_1.buildSchema)(`

type ReturnData {
    notDefined: String
    mapArray: String
    bulbIdList: String
    eventList: String
    availableBulbIdList: String
}

input SetValuesData {
    sendToAndroid: String
    createLightFile: String
    bulbMovement: String
    bulbColours: String
    readFileFromAndroid: String
    mapping: String

}

input SetMapData {
    lat: String
    lng: String
    request: String
    bulbId: String
    bulbNumber: String
    markerList: String
    mapName: String
    
}


type RootMutation {
    ControlDevice(SetValues: SetValuesData): ReturnData
    MapLamps(SetMap: SetMapData): ReturnData
}

type rootQuery {
    viewDevices(which: String): ReturnData
}


    schema {
        query: rootQuery
  mutation: RootMutation

}`);
