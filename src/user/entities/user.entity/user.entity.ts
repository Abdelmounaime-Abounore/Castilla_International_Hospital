import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    phoneNumber: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    image: string;

    @Prop({ type: Types.ObjectId, ref: 'Role', required: true }) 
    roleId: Types.ObjectId;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
