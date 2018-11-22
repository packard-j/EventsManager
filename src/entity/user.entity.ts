import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";
import * as bcrypt from "bcrypt";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    password: string;

    @CreateDateColumn()
    dateCreated: Date;

    async validatePassword(plaintext: string) {
        return await bcrypt.compare(plaintext, this.password);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name
        }
    }

}