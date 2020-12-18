import {Column, Entity } from "typeorm";
import {CoreEntity} from "../../commo/entities/core.entity";
import {Field, InputType, ObjectType, registerEnumType} from "@nestjs/graphql";

enum UserRole {
	Client,
	Owner,
	Delivery,
}

registerEnumType(UserRole, {name: 'UserRole'})

@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class User extends CoreEntity {

	@Column()
	@Field(type => String)
	email: string

	@Column()
	@Field(type => String)
	password: string

	@Column({type: 'enum', enum: UserRole})
	@Field(type => UserRole)
	role: UserRole;

}

