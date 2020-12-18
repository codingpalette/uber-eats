import {CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";
import {Field} from "@nestjs/graphql";


export class CoreEntity {
	@PrimaryGeneratedColumn()
	@Field(type => Number)
	id: number;

	@CreateDateColumn()
	@Field(type => Date)
	createdAt: Date;

	@CreateDateColumn()
	@Field(type => Date)
	updateAt: Date;

}
