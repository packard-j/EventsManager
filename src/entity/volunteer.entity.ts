import {Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany} from "typeorm";
// import {IsEmail} from "class-validator";
import {CbOrder} from "./cborder.entity";
import {Assignment} from "./assignment.entity";
import {Event} from "./event.entity";


@Entity()
export class Volunteer {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    //@IsEmail()
    email: string;

    @Column()
    phone: string;

    @Column("text")
    notes: string;

    @OneToMany(type => CbOrder, order => order.volunteer)
    orders: CbOrder[];

    @ManyToMany(type => Assignment, assignment => assignment.volunteers)
    assignments: Assignment[];

    @ManyToMany(type => Event, event => event.volunteers)
    events: Event[];

    @CreateDateColumn()
    dateCreated: Date;

    @UpdateDateColumn()
    dateUpdated: Date;

}