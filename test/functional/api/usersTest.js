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


});
