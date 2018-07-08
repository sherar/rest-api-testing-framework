const envVars = require("../support/env"),
    env = envVars["bankAccounts"],
    baseUrl = envVars["apiUrl"],
    endpoints = envVars["endpoints"];

var api = require('supertest')(baseUrl);
const account = env["newAccountDetails"];
const basePath = endpoints["bankAccounts"];

function Helper() {}

Helper.prototype.acccountToHaveValidProperties = function (res) {
    const accountProperties = env["accountProperties"];
    accountProperties.forEach(function (property) {
        if (!(property in res.body)) throw new Error("Missing " + property + " key");
    });
}

module.exports = new Helper()