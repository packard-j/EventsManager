import {Request, Response} from "express";
import {getManager} from "typeorm";
import {Assignment, Event, Location, Volunteer} from "../entity";
import {validate} from "class-validator";


export async function createAssignment(request: Request, response: Response) {

    const eventRepo = getManager().getRepository(Event);
    const event = await eventRepo.findOne(request.body['event']);

    if (!event) {
        response.status(404);
        response.end();
        return;
    }

    const locationRepo = getManager().getRepository(Location);
    const location = await locationRepo.findOne(request.body['location']);

    if (!location) {
        response.status(404);
        response.end();
        return;
    }

    console.log("Volunteers given:");
    console.log(request.body['volunteers']);

    const volunteerRepo = getManager().getRepository(Volunteer);
    const volunteers = await volunteerRepo.createQueryBuilder("volunteer")
        .whereInIds(request.body['volunteers'])
        .getMany();

    console.log("Volunteers selected:");
    console.log(volunteers);

    if (volunteers.length === 0) {
        response.status(409);
        response.end();
        return;
    }

    const repo = getManager().getRepository(Assignment);

    const newAssignment = repo.create({
        event: event,
        location: location,
        zone: parseInt(request.body['zone']),
        startHour: parseInt(request.body['startHour']),
        startMinute: parseInt(request.body['startMinute']),
        endHour: parseInt(request.body['endHour']),
        endMinute: parseInt(request.body['endMinute']),
        volunteers: volunteers
    });

    const errors = await validate(newAssignment);
    if (errors.length > 0) {
        console.log(errors);
        throw new Error("Validation failed!")
    }
    else {
        await repo.save(newAssignment);
        console.log(newAssignment);
        response.send(newAssignment);
    }

}

export async function getAssignment(request: Request, response: Response) {

    const repo = getManager().getRepository(Assignment);
    const assignment = await repo.createQueryBuilder("assignment")
        .where("assignment.id = :id", {id: request.params.id})
        .leftJoinAndSelect("assignment.location", "location")
        .leftJoinAndSelect("assignment.volunteers", "volunteer")
        .leftJoinAndSelect("assignment.event", "event")
        .getOne();

    if (!assignment) {
        response.status(404);
        response.end();
        return;
    }

    console.log(assignment);
    response.send(assignment);

}

export async function editAssignment(request: Request, response: Response) {

    const repo = getManager().getRepository(Assignment);
    const assignment = await repo.createQueryBuilder("assignment")
        .where("assignment.id = :id", {id: request.params.id})
        .leftJoinAndSelect("assignment.location", "location")
        .leftJoinAndSelect("assignment.volunteers", "volunteer")
        .getOne();

    if (!assignment) {
        response.status(404);
        response.end();
        return;
    }

    const eventRepo = getManager().getRepository(Event);
    const event = await eventRepo.findOne(request.body['event']);

    if (!event) {
        response.status(404);
        response.end();
        return;
    }

    const locationRepo = getManager().getRepository(Location);
    const location = await locationRepo.findOne(request.body['location']);

    if (!location) {
        response.status(409);
        response.end();
        return;
    }

    console.log("Volunteers given:");
    console.log(request.body['volunteers']);

    const volunteerRepo = getManager().getRepository(Volunteer);
    const volunteers = await volunteerRepo.createQueryBuilder("volunteer")
        .whereInIds(request.body['volunteers'])
        .getMany();

    console.log("Volunteers selected:");
    console.log(volunteers);

    if (volunteers.length === 0) {
        response.status(409);
        response.end();
        return;
    }

    assignment.event = event;
    assignment.location = location;
    assignment.zone = parseInt(request.body['zone']);
    assignment.startHour = parseInt(request.body['startHour']);
    assignment.startMinute = parseInt(request.body['startMinute']);
    assignment.endHour = parseInt(request.body['endHour']);
    assignment.endMinute = parseInt(request.body['endMinute']);
    assignment.volunteers = volunteers;

    const errors = await validate(assignment);
    if (errors.length > 0) {
        console.log(errors);
        throw new Error("Validation Failed!")
    }
    else {
        await repo.save(assignment);
        response.send(assignment);
    }

}

export async function deleteAssignment(request: Request, response: Response) {

    const repo = getManager().getRepository(Assignment);
    const assignment = await repo.findOne(request.params.id);

    if (!assignment) {
        response.status(404);
        response.end();
        return;
    }

    await repo.remove(assignment);
    response.status(200);
    response.end();

}

export async function getAssignments(request: Request, response: Response) {

    const repo = getManager().getRepository(Assignment);
    let qb = repo.createQueryBuilder("assignment")
        .leftJoinAndSelect("assignment.volunteers", "volunteer")
        .leftJoinAndSelect("assignment.location", "location");

    const event = request.body['event'];
    if (event) {
        qb = qb.leftJoin("assignment.event", "event")
            .where("event.id = :id", {id: event});
    }

    const location = request.body['location'];
    if (location) {
        qb = qb.andWhere("location.id = :id", {id: location});
    }

    const volunteer = request.body['volunteer'];
    if (volunteer) {
        qb = qb.andWhere("volunteer.id = :id", {id: volunteer});
    }

    const search = request.body['search'];
    if (search) {
        qb = qb.andWhere("location.name like :n", {n: search + "%"});
    }

    console.log("Getting assignments...");
    console.log("event: " + event + ", volunteer: " + volunteer);

    const assignments = await qb
        .select([
            "assignment.id",
            "assignment.zone",
            "assignment.startHour",
            "assignment.startMinute",
            "assignment.endHour",
            "assignment.endMinute",
            "location.name",
            "volunteer.firstName",
            "volunteer.lastName"
        ])
        .orderBy("assignment.zone", "ASC")
        .addOrderBy("assignment.startHour", "ASC")
        .addOrderBy("assignment.startMinute", "ASC")
        .getMany();

    console.log(assignments);
    response.send(assignments);

}