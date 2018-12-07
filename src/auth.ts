import * as passport from "passport";
import {Express, Request, Response} from "express";
import {Connection} from "typeorm";
import {User} from "./entity";
import {createUser} from "./controller";


let LocalStrategy = require("passport-local").Strategy;

export async function setupPassport(server: Express, connection: Connection) {

    const repo = connection.getRepository(User);

    // Set up local strategy with users in database
    passport.use("local", new LocalStrategy(
        async (username: string, password: string, done: Function) => {
            const user = await repo.findOne({'name': username});
            if (!user) {
                done(null, false, {message: 'User not found'});
            }
            else {
                const passwordIsCorrect = await user.validatePassword(password);
                if (passwordIsCorrect) {
                    done(null, user.toJSON());
                }
                else {
                    done(null, false, {message: 'Incorrect password'});
                }
            }
        }
    ));

    // User --> id
    passport.serializeUser((user: User, done: Function) => {
        done(null, user.id);
    });

    // id --> User
    passport.deserializeUser(async (id: number, done: Function) => {
        const user = await repo.findOne(id);
        if (user) {
            done(null, user);
        }
        else {
            done(null, {});
        }
    });

    // Use the local strategy on the express server
    server.use(passport.initialize());
    server.use(passport.session());

    // Authentication routes

    /*
    DEVELOPMENT ONLY
    server.post('/api/user', (request: Request, response: Response, next: Function) => {
        createUser(request, response).then(() => next).catch(err => next(err));
    });
    */

    server.post("/api/login", (request: Request, response: Response, next: Function) => {
        passport.authenticate("local", (err, user: User, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                //console.log(request.body['username']);
                return response.status(401).send({'error': 'Invalid login'});
            }
            request.logIn(user, (err) => {
                if (err) { return next(err); }
                //console.log(user.name + " signed in");
                response.send(user);
                return next();
            });
        })(request, response, next);
    });

    server.get("/api/logout", (request: Request, response: Response) => {
        request.logout();
        response.sendStatus(200);
    });

    server.get("/api/status", (request: Request, response: Response) => {
        response.send({"authenticated": request.isAuthenticated()});
    });

    return server;

}

export function ensureAuthenticated(request: Request, response: Response, next: Function) {
    if (request.isAuthenticated()) {
        return next();
    }
    else {
        return response.sendStatus(401);
    }
}