const chai = require("chai");
const server = require("../../../bin/www");
const expect = chai.expect;
const request = require("supertest");
const _ = require("lodash");

let datastore = require("../../../models/statements");

describe('Statements',  () => {

    describe("GET /statements", () => {
        it("should GET all the statements", done => {
            request(server)
                .get("/statements")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.equal(2);
                        let result = _.map(res.body, statement => {
                            return {
                                statement: statement.statement,
                                agree: statement.agree
                            };
                        });
                        expect(result).to.deep.include({
                            statement: "There is a God",
                            agree: 0
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    });

});