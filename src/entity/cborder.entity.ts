import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn} from "typeorm";
import {Volunteer} from "./volunteer.entity";
import {IsInt, Min} from "class-validator";
import {Event} from "./event.entity";


@Entity()
export class CbOrder {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Volunteer, v => v.orders, {nullable: true, onDelete: "SET NULL"})
    volunteer: Volunteer;

    @ManyToOne(type => Event, event => event.orders)
    event: Event;

    @Column()
    @IsInt()
    @Min(1)
    barsOrdered: number;

    @Column()
    @IsInt()
    @Min(0)
    barsReceived: number;

    @Column()
    @Min(0)
    moneyReturned: number;

    @Column("text")
    notes: string;

    @CreateDateColumn()
    dateCreated: Date;

    @UpdateDateColumn()
    dateUpdated: Date;

}