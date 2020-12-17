"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
// Replace the following with values for your environment.
var username = encodeURIComponent("wenxu");
var password = encodeURIComponent("wenxu");
var clusterUrl = "127.0.0.1:27017";
var authMechanism = "DEFAULT";
// Replace the following with your MongoDB deployment's connection string.
var uri = "mongodb://" + username + ":" + password + "@" + clusterUrl + "/?authMechanism=" + authMechanism + "&authSource=whatHappened";
// Create a new MongoClient
var client = new mongodb_1.MongoClient(uri);
var connection;
// Function to connect to the server
function default_1() {
    if (!connection) {
        connection = client.connect().then(function () {
            return client.db("whatHappened");
        });
    }
    return connection;
}
exports.default = default_1;
