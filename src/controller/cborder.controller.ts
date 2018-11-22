import {Request, Response} from "express";
import {getManager} from "typeorm";
import {CbOrder, Event, Volunteer} from "../entity";
import {validate} from "class-validator";


const pageLen = 30;

export async function createCbOrder(request: Request, response: Response) {

    const volunteerRepo = getManager().getRepository(Volunteer);
    const volunteer = await volunteerRepo.findOne(request.body['volunteer']);

    if (!volunteer) {
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

    const repo = getManager().getRepository(CbOrder);
    const newCbOrder = repo.create({
        volunteer: volunteer,
        event: event,
        barsOrdered: parseInt(request.body['barsOrdered']),
        barsReceived: parseInt(request.body['barsReceived']),
        moneyReturned: parseFloat(request.body['moneyReturned']),
        notes: request.body['notes']
    });

    const errors = await validate(newCbOrder);
    if (errors.length > 0) {
        console.log(errors);
        throw new Error("Validation Failed!")
    }
    else {
        await repo.save(newCbOrder);
        response.send(newCbOrder);
    }

}

export async function getCbOrder(request: Request, response: Response) {

    const repo = getManager().getRepository(CbOrder);
    const cbOrder = await repo.findOne(request.params.id, {
        join: {
            alias: "cbo",
            leftJoinAndSelect: {
                volunteer: "cbo.volunteer",
                event: "cbo.event"
            }
        }
    });

    if (!cbOrder) {
        response.status(404);
        response.end();
        return;
    }

    console.log(cbOrder);
    response.send(cbOrder);

}

export async function editCbOrder(request: Request, response: Response) {

    const repo = getManager().getRepository(CbOrder);
    const cbOrder = await repo.findOne(request.params.id);

    if (!cbOrder) {
        response.status(404);
        response.end();
        return;
    }

    const volunteerRepo = getManager().getRepository(Volunteer);
    const volunteer = await volunteerRepo.findOne(request.body['volunteer']);

    if (!volunteer) {
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

    cbOrder.volunteer = volunteer;
    cbOrder.event = event;
    cbOrder.barsOrdered = parseInt(request.body['barsOrdered']);
    cbOrder.barsReceived = parseInt(request.body['barsReceived']);
    cbOrder.moneyReturned = parseFloat(request.body['moneyReturned']);
    cbOrder.notes = request.body['notes'];

    const errors = await validate(cbOrder);
    if (errors.length > 0) {
        console.log(errors);
        throw new Error("Validation Failed!")
    }
    else {
        await repo.save(cbOrder);
        response.send(cbOrder);
    }

}

export async function deleteCbOrder(request: Request, response: Response) {

    const repo = getManager().getRepository(CbOrder);
    const cbOrder = await repo.findOne(request.params.id);

    if (!cbOrder) {
        response.status(404);
        response.end();
        return;
    }

    await repo.remove(cbOrder);
    response.status(200);
    response.end();

}

export async function getCbOrders(request: Request, response: Response) {

    const repo = getManager().getRepository(CbOrder);
    const page = request.body['page'];
    const skip = page * pageLen;
    const cbOrders = await repo.createQueryBuilder("cbo")
        .leftJoinAndSelect("cbo.volunteer", "volunteer")
        .leftJoinAndSelect("cbo.event", "event", "event.id = :id", {id: request.params.id})
        .select([
            "cbo.id",
            "cbo.barsOrdered",
            "cbo.barsReceived",
            "cbo.moneyReturned",
            "volunteer.id",
            "volunteer.firstName",
            "volunteer.lastName",
            "event.id",
            "event.name"
        ])
        //.orderBy("cbo.dateUpdated", "DESC")
        .skip(skip)
        .take(pageLen)
        .getMany();

    console.log(cbOrders);
    response.send(cbOrders);

}