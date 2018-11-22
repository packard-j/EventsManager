import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne,
    ManyToMany, CreateDateColumn, UpdateDateColumn, JoinTable
} from "typeorm";
import {Location} from "./location.entity";
import {Volunteer} from "./volunteer.entity";
import {Min, Max, IsInt} from "class-validator";
import {Event} from "./event.entity";


@Entity()
export class Assignment {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Location, location => location.assignments)
    location: Location;

    @ManyToOne(type => Event, event => event.assignments)
    event: Event;

    @Column()
    @IsInt()
    @Min(0)
    zone: number;

    /*
    @Column()
    startTime: string;

    @Column()
    endTime: string;
    */

    @Column()
    @IsInt()
    @Min(0)
    @Max(23)
    startHour: number;

    @Column()
    @IsInt()
    @Min(0)
    @Max(59)
    startMinute: number;

    @Column()
    @IsInt()
    @Min(0)
    @Max(23)
    endHour: number;

    @Column()
    @IsInt()
    @Min(0)
    @Max(59)
    @Column()
    endMinute: number;

    @ManyToMany(type => Volunteer, volunteer => volunteer.assignments)
    @JoinTable()
    volunteers: Volunteer[];

    @CreateDateColumn()
    dateCreated: Date;

    @UpdateDateColumn()
    dateUpdated: Date;

}