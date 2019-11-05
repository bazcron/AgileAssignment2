/*const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const MongoMemoryServer = require("mongodb-memory-server").MongoMemoryServer;
const User = require("../../../models/users");
const mongoose = require("mongoose");*/
const expect = require("chai").expect;
const request = require("supertest");
const {MongoMemoryServer} = require("mongodb-memory-server");
const User = require("../../../models/users");
const mongoose = require("mongoose");

const _ = require("lodash");
let server;
let mongod;
let db, validID;

describe("Users", () => {
    before(async () => {
        try {
            mongod = new MongoMemoryServer({
                instance: {
                    port: 27017,
                    dbPath: "./test/database",
                    dbName: "usersdb" // by default generate random dbName
                }
            });
            // Async Trick - this ensures the database is created before 
            // we try to connect to it or start the server
            await mongod.getConnectionString();

            mongoose.connect("mongodb://localhost:27017/usersdb", {
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
           await User.deleteMany({});
            let user = new User();
            user.name = "barry";
            user.email = "bazcron@yahoo.co.uk";
            user.password = "secret";
            user.agree = 0;
            user.disagree = 0;
            await user.save();
            let user2 = new User();
            user2 = new User();
            user2.name = "mary";
            user2.password = "something";
            user2.email = "mary@yahoo.co.uk";
            user2.agree = 1;
            user2.disagree = 1;
            await user2.save();
            user = await User.findOne({ name: "barry" });
            validID = user._id;
        } catch (error) {
            console.log(error);
        }
    });

    describe("GET /users", () => {
        it("should GET all the Users", done => {
            request(server)
                .get("/users")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.equal(2);
                        let result = _.map(res.body, user => {
                            return {
                                name: user.name,
                                email: user.email
                            };
                        });
                        expect(result).to.deep.include({
                            name : "barry",
                        email : "bazcron@yahoo.co.uk"
                        });
                        expect(result).to.deep.include({
                            name : "mary",
                            email : "mary@yahoo.co.uk"
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    });

    describe("GET /users/:id", () => {
        describe("when the id is valid", () => {
            it("should return the matching user", done => {
                request(server)
                    .get(`/users/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body[0]).to.have.property("name", "barry");
                        expect(res.body[0]).to.have.property("email", "bazcron@yahoo.co.uk");
                        done(err);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return the NOT found message", done => {
                request(server)
                    .get("/users/999")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("User NOT Found!! Please Try Again");
                        done(err);
                    });
            });
        });
    });

    describe("POST /users", () => {
        it("should return confirmation message and update datastore", () => {
            const user = {
                name: "barry",
                email: "bazcron@yahoo.co.uk",
                password: "barry",
                agree: 0,
                disagree: 0
            };
            return request(server)
                .post("/users")
                .send(user)
                .expect(200)
                .then(res => {
                    expect(res.body.message).equals("User Added Successfully!");
                    validID = res.body.data._id;
                });
        });
        after(() => {
            return request(server)
                .get(`/users/${validID}`)
                .expect(200)
                .then(res => {
                    expect(res.body[0]).to.have.property("name", "barry");
                    expect(res.body[0]).to.have.property("email", "bazcron@yahoo.co.uk");
                });
        });
    });

    describe("PUT /users/:id/agree", () => {
        describe("when the id is valid", () => {
            it("should return a message and the user has the Agree value increased by 1", () => {
                return request(server)
                    .put(`/users/${validID}/agree`)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({
                            message: "You have Agreed with this statement. Agreed has been increased by 1!"
                        });
                        expect(resp.body.data).to.have.property("agree", 1);
                    });
            });
            after(() => {
                return request(server)
                    .get(`/users/${validID}`)
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(resp => {
                        expect(resp.body[0]).to.have.property("agree", 1);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return a 404 and a message for invalid user id", () => {
                return request(server)
                    .put("/users/22323232000000000000/agree")
                    .expect(200);
            });
        });
    });

});
