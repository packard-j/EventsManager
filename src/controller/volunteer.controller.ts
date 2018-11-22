import {Request, Response} from "express";
import {Brackets, getManager} from "typeorm";
import {Event, Volunteer} from "../entity";
import {validate} from "class-validator";


const pageLen = 30;

export async function createVolunteer(request: Request, response: Response) {

    const repo = getManager().getRepository(Volunteer);

    const firstName = request.body['firstName'];
    const lastName = request.body['lastName'];

    const existing = await repo.findOne({where: {firstName: firstName, lastName: lastName}});
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


    const newVolunteer = repo.create({
        firstName: firstName,
        lastName: lastName,
        email: request.body['email'],
        phone: request.body['phone'],
        notes: request.body['notes'],
        events: events
    });

    const errors = await validate(newVolunteer);
    if (errors.length > 0) {
        throw new Error("Validation Failed!")
    }
    else {
        await repo.save(newVolunteer);
        response.send(newVolunteer);
    }

}

export async function getVolunteer(request: Request, response: Response) {

    const repo = getManager().getRepository(Volunteer);
    const volunteer = await repo.createQueryBuilder("volunteer")
        .where("volunteer.id = :id", {id: request.params.id})
        .leftJoinAndSelect("volunteer.events", "event")
        .getOne();

    if (!volunteer) {
        response.status(404);
        response.end();
        return;
    }

    response.send(volunteer);

}

export async function editVolunteer(request: Request, response: Response) {

    const repo = getManager().getRepository(Volunteer);
    const volunteer = await repo.findOne(request.params.id);

    if (!volunteer) {
        response.status(404);
        response.end();
        return;
    }

    const eventRepo = getManager().getRepository(Event);
    const events = await eventRepo.findByIds(request.body['events']);

    volunteer.firstName = request.body['firstName'];
    volunteer.lastName = request.body['lastName'];
    volunteer.email = request.body['email'];
    volunteer.phone = request.body['phone'];
    volunteer.notes = request.body['notes'];
    volunteer.events = events;

    const errors = await validate(volunteer);
    if (errors.length > 0) {
        throw new Error("Validation Failed!")
    }
    else {
        await repo.save(volunteer);
        response.send(volunteer);
    }

}

export async function deleteVolunteer(request: Request, response: Response) {

    const repo = getManager().getRepository(Volunteer);
    const volunteer = await repo.findOne(request.params.id);

    if (!volunteer) {
        response.status(404);
        response.end();
        return;
    }

    await repo.remove(volunteer);
    response.status(200);
    response.end();

}

export async function getVolunteers(request: Request, response: Response) {

    const repo = getManager().getRepository(Volunteer);
    let qb = repo.createQueryBuilder("volunteer");

    const event = request.body['event'];
    if (event) {
        qb = qb
            .leftJoin("volunteer.events", "event")
            .where("event.id = :id", {id: event})
    }

    const search = request.body['search'];
    if (search) {
        const query = String(search).split(" ");
        qb = qb.andWhere(new Brackets(nqb => nqb
            .where("volunteer.firstName like :f", {f: query[0] + "%"})
            .orWhere("volunteer.lastName like :l", {l: query[query.length-1] + "%"})
        ));
    }

    const page = request.body["page"];
    const skip = page * pageLen;
    const volunteers = await qb
        .select([
            "volunteer.id",
            "volunteer.firstName",
            "volunteer.lastName",
            "volunteer.email"
        ])
        .leftJoinAndSelect("volunteer.events", "events")
        .orderBy("volunteer.lastName", "ASC")
        .addOrderBy("volunteer.firstName", "ASC")
        .skip(skip)
        .take(pageLen)
        .getMany();

    console.log(volunteers);
    response.send(volunteers)

}

export async function addVolunteersToEvent(request: Request, response: Response) {

    await getManager().createQueryBuilder()
        .relation(Event, "volunteers")
        .of(request.body['event'])
        .add(request.body['volunteers']);

    response.status(200);
    response.end();

}