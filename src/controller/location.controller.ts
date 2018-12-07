import {Request, Response} from "express";
import {getManager} from "typeorm";
import {Event, Location} from "../entity";


const pageLen = 30;

export async function createLocation(request: Request, response: Response) {

    const repo = getManager().getRepository(Location);
    const name = request.body['name'];

    const existing = await repo.findOne({where: {name: name}});
    if (existing) {
        response.status(409);
        response.end();
        return;
    }

    const eventIds = request.body['events'];
    let events = [];
    if (eventIds) {
        const eventRepo = getManager().getRepository(Event);
        events = await eventRepo.findByIds(eventIds);
    }

    const newLocation = repo.create({
        name: name,
        events: events
    });
    await repo.save(newLocation);
    response.send(newLocation);

}

export async function getLocation(request: Request, response: Response) {

    const repo = getManager().getRepository(Location);
    const location = await repo.createQueryBuilder("location")
        .where("location.id = :id", {id: request.params.id})
        .leftJoinAndSelect("location.events", "event")
        .getOne();

    if (!location) {
        response.status(404);
        response.end();
        return;
    }

    response.send(location);

}

export async function editLocation(request: Request, response: Response) {

    const repo = getManager().getRepository(Location);
    const location = await repo.findOne(request.params.id);

    if (!location) {
        response.status(404);
        response.end();
        return;
    }

    const eventRepo = getManager().getRepository(Event);
    const events = await eventRepo.findByIds(request.body['events']);

    location.name = request.body['name'];
    location.events = events;

    await repo.save(location);
    response.send(location);

}

export async function deleteLocation(request: Request, response: Response) {

    const repo = getManager().getRepository(Location);
    const location = await repo.findOne(request.params.id);

    if (!location) {
        response.status(404);
        response.end();
        return;
    }

    await repo.remove(location);
    response.status(200);
    response.end();

}

export async function getLocations(request: Request, response: Response) {

    const repo = getManager().getRepository(Location);
    let qb = repo.createQueryBuilder("location");

    const search = request.body['search'];
    if (search) {
        qb = qb.where("location.name like :n", {n: search + "%"})
    }

    const event = request.body['event'];
    if (event) {
        qb = qb.leftJoin("location.events", "event")
            .andWhere("event.id = :id", {id: event})
    }

    const page = request.body['page'];
    const skip = page * pageLen;
    const locations  = await qb
        .orderBy("location.name", "ASC")
        .skip(skip)
        .take(pageLen)
        .getMany();

    response.send(locations);

}

export async function addLocationsToEvent(request: Request, response: Response) {

    await getManager().createQueryBuilder()
        .relation(Event, "locations")
        .of(request.body['event'])
        .add(request.body['locations']);

    response.status(200);
    response.end();

}