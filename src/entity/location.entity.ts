import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany} from "typeorm";
import {Assignment} from "./assignment.entity";
import {Event} from "./event.entity";


@Entity()
export class Location {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Assignment, a => a.location)
    assignments: Assignment[];

    @ManyToMany(type => Event, event => event.locations)
    events: Event[];

}