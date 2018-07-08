const envVars = require("../support/env"),
    env = envVars["bankAccounts"],
    baseUrl = envVars["apiUrl"];

function Helper() {}

Helper.prototype.acccountToHaveValidProperties = function (res) {
    const accountProperties = env["accountProperties"];
    accountProperties.forEach(function (property) {
        if (!(property in res.body)) throw new Error("Missing " + property + " key");
    });
}

module.exports = new Helper()