import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Volunteer} from "./volunteer.entity";
import {CbOrder} from "./cborder.entity";
import {Location} from "./location.entity";
import {Assignment} from "./assignment.entity";


@Entity()
export class Event {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    date: Date;

    @ManyToMany(type => Volunteer, volunteer => volunteer.events)
    @JoinTable()
    volunteers: Volunteer[];

    @OneToMany(type => CbOrder, order => order.event)
    orders: CbOrder[];

    @ManyToMany(type => Location, location => location.events)
    @JoinTable()
    locations: Location[];

    @OneToMany(type => Assignment, assignment => assignment.event)
    assignments: Assignment[];

}