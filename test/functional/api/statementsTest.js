const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const Statement = require("../../../models/statements");
const mongoose = require("mongoose");

const _ = require("lodash");
let server;
let mongod;
let db, validID;

describe("statements", () => {
    before(async () => {
        try {
            mongod = new MongoMemoryServer({
                instance: {
                    port: 27017,
                    dbPath: "./test/database",
                    dbName: "statementsdb" // by default generate random dbName
                }
            });
            // Async Trick - this ensures the database is created before 
            // we try to connect to it or start the server
            await mongod.getConnectionString();

            mongoose.connect("mongodb://localhost:27017/statementsdb", {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            server = require("../../../bin/www");
            db = mongoose.connection;
        } catch (error) {
            console.log(error);
        }
    });

    after(async () => {
        try {
            await db.dropDatabase();
        } catch (error) {
            console.log(error);
        }
    });

    beforeEach(async () => {
        try {
            await Statement.deleteMany({});
            let statement = new Statement();
            statement.statement = "There is a God";
            statement.agree=0;
            statement.disagree=0;
            await statement.save();
            statement = new Statement();
            statement.statement = "Prison should be a punishment";
            statement.agree=0;
            statement.disagree=0;
            await statement.save();
            statement = await Statement.findOne({ statement: "There is a God" });
            validID = statement._id;
        } catch (error) {
            console.log(error);
        }
    });

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
                            statement : "There is a God",
                            agree : 0
                        });
                        expect(result).to.deep.include({
                            statement : "Prison should be a punishment",
                            agree : 0
                        });
                        done(err);
                    } catch (e) {
                        done(e);
                    }
                });
        });
    });

    describe("GET /statements/:id", () => {
        describe("when the id is valid", () => {
            it("should return the matching statement", done => {
                request(server)
                    .get(`/statements/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body[0]).to.have.property("statement", "There is a God");
                        expect(res.body[0]).to.have.property("agree", 0);
                        done(err);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .get("/statements/999")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("Statement NOT Found!");
                        done(err);
                    });
            });
        });
    });

});
