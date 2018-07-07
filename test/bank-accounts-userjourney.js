const envVars = require("../support/env"),
    env = envVars["bankAccounts"],
    endpoints = envVars["endpoints"],
    baseUrl = envVars["apiUrl"],
    basePath = endpoints["bankAccounts"];

var async = require('async');
var api = require('supertest')(baseUrl);
var expect = require('chai').expect;

describe("Bank Accounts - User Journeys", function () {

    var commonHeaders;

    before(function (done) {
        api.post("/login")
            .send(envVars["userLoginDetails"])
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, response) {
                expect(response.body.status).to.equal("success");
                commonHeaders = {
                    "X-ACCESS-TOKEN": response.body.token
                };
                done();
            })
    });

    after(function (done) {
        api.get("/logoff")
            .set(commonHeaders)
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({
                status: "success"
            }, done());
    });


    it("Creates, list and delete a new bank account", function (done) {
        const account = env["newAccountDetails"];

        async.series([
            //Purgue old existing account
            function (callback) {
                api.delete(basePath + "/delete")
                    .set(commonHeaders)
                    .send({
                        companyRef: account["companyRef"],
                        reference: account["reference"]
                    })
                    .end(callback);
            },

            // Check that account doesn't exist
            function (callback) {
                api.get(basePath + "/account")
                    .set(commonHeaders)
                    .send({
                        reference: account["reference"]
                    })
                    .expect("Content-Type", /json/)
                    .expect(403)
                    .end(callback);
            },

            //Create account
            function (callback) {
                api.post(basePath + "/create")
                    .set(commonHeaders)
                    .send(account)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .expect(hasValidAccountProperties)
                    .end(callback);
            },

            //List account 
            function (callback) {
                api.get(basePath + "/account")
                    .set(commonHeaders)
                    .send({
                        reference: account["reference"]
                    })
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .expect(hasValidAccountProperties)
                    .end(callback);
            },

            // Delete
            function (callback) {
                api.delete(basePath + "/delete")
                    .set(commonHeaders)
                    .send({
                        companyRef: account["companyRef"],
                        reference: account["reference"]
                    })
                    .expect(200)
                    .end(callback);
            }

        ], done);
    });


    function hasValidAccountProperties(res) {
        const accountProperties = env["accountProperties"];
        accountProperties.forEach(function (property) {
            if (!(property in res.body)) throw new Error("Missing " + property + " key");
        });
    }

});