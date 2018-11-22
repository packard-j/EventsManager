import {Request, Response} from "express";
import {getManager} from "typeorm";
import {Event} from "../entity";


const pageLen = 30;

export async function createEvent(request: Request, response: Response) {

    const repo = getManager().getRepository(Event);
    const newEvent = repo.create({
        name: request.body['name'],
        date: request.body['date']
    });
    await repo.save(newEvent);
    response.send(newEvent);

}

export async function getEvents(request: Request, response: Response) {

    const repo = getManager().getRepository(Event);
    let qb = repo.createQueryBuilder("event");

    const search = request.body['search'];
    if (search) {
        qb = qb.where("event.name like :n", {n: search + "%"})
    }

    const page = request.body['page'];
    const skip = page * pageLen;
    const events = await qb
        .orderBy("event.date", "DESC")
        .skip(skip)
        .take(pageLen)
        .getMany();

    response.send(events);

}

export async function getEvent(request: Request, response: Response) {

    const repo = getManager().getRepository(Event);
    const event = await repo.findOne(request.params.id);

    if (!event) {
        response.status(404);
        response.end();
        return;
    }

    response.send(event);

}

export async function editEvent(request: Request, response: Response) {

    const repo = getManager().getRepository(Event);
    const event = await repo.findOne(request.params.id);

    if (!event) {
        response.status(404);
        response.end();
        return;
    }

    event.name = request.body['name'];
    event.date = request.body['date'];

    await repo.save(event);
    response.send(event);

}

export async function deleteEvent(request: Request, response: Response) {

    const repo = getManager().getRepository(Event);
    const event = await repo.findOne(request.params.id);

    if (!event) {
        response.status(404);
        response.end();
        return;
    }

    await repo.remove(event);
    response.status(200);
    response.end();

}