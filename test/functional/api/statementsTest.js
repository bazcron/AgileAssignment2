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


});
