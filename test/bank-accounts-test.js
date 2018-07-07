const should = require("chai").should(),
    expect = require("chai").expect,
    supertest = require("supertest"),
    envVars = require("../support/env"),
    api = supertest(envVars["apiUrl"]),
    endpoints = envVars["endpoints"],
    basePath = endpoints["bankAccounts"],
    env = envVars["bankAccounts"];


describe("Bank Accounts", function () {

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
            }, done);
    });


    it("/required_details - Get required bank account identifier elements per country", function (done) {
        const requiredElementsPerCountry = env["requiredAccountIdentifierElements"];
        api.get(basePath + "/required_details")
            .set(commonHeaders)
            .send(requiredElementsPerCountry["belgium"])
            .expect(200, {
                status: "success",
                required: [
                    ["iban", "bic_swift"]
                ]
            }, done);
    });

    it("/index - Get all the active bank accounts for the specified filters", function (done) {
        api.get(basePath + "/index")
            .set(commonHeaders)
            .expect("Content-Type", /json/)
            .expect(200, done)
    });

    it("/account - Get details on specific bank account", function (done) {
        const existingAccount = env["existingAccountDetails"];
        api.get(basePath + "/account")
            .set(commonHeaders)
            .send({
                reference: existingAccount["kantoxReference"]
            })
            .expect("Content-Type", /json/)
            .expect(200)
            .expect(hasValidAccountProperties)
            .end(done);
    });

    it("/create + /delete - Create and Suspend a bank account", function (done) {
        const account = env["newAccountDetails"];
        api.post(basePath + "/create")
            .set(commonHeaders)
            .send(env["newAccountDetails"])
            .expect("Content-Type", /json/)
            .expect(200)
            .expect(hasValidAccountProperties)
            .end(function () {
                api.delete(basePath + "/delete")
                    .set(commonHeaders)
                    .send({
                        companyRef: account["companyRef"],
                        reference: account["reference"]
                    })
                    .expect(200)
                    .end(function (err, response) {
                        expect(response.body).to.equal(null);
                        done();
                    });
            });
    });

    it("/login - Login with invalid credentials", function done() {
        api.post("/login")
            .set(commonHeaders)
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, response) {
                expect(response.body.status).to.equal("error");
                expect(response.body.errorDetails).to.equal("account not found");
                done();
            })
    })


    function hasValidAccountProperties(res) {
        const accountProperties = env["accountProperties"];
        accountProperties.forEach(function (property) {
            if (!(property in res.body)) throw new Error("Missing " + property + " key");
        });
    }

});