import "reflect-metadata";
import {createConnection} from "typeorm";
import {Request, Response} from "express";
import * as express from "express";
import * as session from "express-session";
import * as uuid from "uuid";
import * as bodyParser from "body-parser";
import * as path from "path";
import {AppRoutes} from "./routes";
import {setupPassport, ensureAuthenticated} from "./auth";
import {createUser, listAssignments} from "./manage";


createConnection().then(async connection => {

    let app = express();

    app.use("/", express.static(path.join(__dirname, "build/index.html")));
    //app.use("/static", express.static(path.join(__dirname, "static")));

    app.use(session({
        secret: "changeme",
        genid: () => uuid.v4(),
        resave: false,
        saveUninitialized: true
    }));

    app.use(bodyParser.json());

    // DEVELOPMENT
    app.use((req, res, next) => {
        // Logging
        console.log(req.method + ' ' + req.url);
        // Headers
        res.header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "Origin,Content-Type, Authorization, x-id, Content-Length, X-Requested-With");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        next();
    });

    app = await setupPassport(app, connection);

    AppRoutes.forEach(route => {
        app[route.method]("/api" + route.path, ensureAuthenticated, (request: Request, response: Response, next: Function) => {
            route.action(request, response).then(() => next).catch(err => next(err));
        });
    });

    app.listen(3001);
    console.log("Application running at http://localhost:3001/");

    //await createUser("james", "lotus");
    console.log(await listAssignments(1));

});