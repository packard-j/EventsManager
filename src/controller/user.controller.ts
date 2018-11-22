import {Request, Response} from "express";
import {getManager} from "typeorm";
import {User} from "../entity";
import * as bcrypt from "bcrypt";


export async function createUser(request: Request, response: Response) {

    const repo = getManager().getRepository(User);

    const username = request.body['name'];
    const existing = await repo.findOne({name: username});
    if (existing) {
        response.statusCode = 403;
        response.end();
    }

    const hashed = await bcrypt.hash(request.body['password'], 10);
    const newUser = repo.create({name: username, password: hashed});
    await repo.save(newUser);
    response.send(newUser);

}