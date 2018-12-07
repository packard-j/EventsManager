import {createConnection, getManager} from "typeorm";
import {Assignment, User} from "./entity";
import * as bcrypt from 'bcrypt';
import {create} from "domain";

export async function createUser(username: string, password: string) {
    const repo = getManager().getRepository(User);

    const existing = await repo.findOne({name: username});
    if (existing) {
        throw new Error('User already exists');
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = repo.create({name: username, password: hashed});
    await repo.save(newUser);
    return newUser;

}

export async function listAssignments(location: number) {

    const repo = getManager().getRepository(Assignment);
    return await repo.createQueryBuilder("assignment")
        .leftJoin("assignment.location", "location")
        .where("location.id = :l", {l: location})
        .leftJoinAndSelect("assignment.volunteers", "volunteer")
        .getMany();

}

if (!module.parent && process.argv[2] === 'create-user') {
    createConnection().then(async connection => {
        createUser(process.argv[3], process.argv[4])
            .then(user => console.log(user));
    });
}