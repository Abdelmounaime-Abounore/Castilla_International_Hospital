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

    @Prop()
    image: string;

    @Prop({ type: Types.ObjectId, ref: 'Role', required: true }) 
    roleId: Types.ObjectId;

    @Prop() 
    cv: string;

    @Prop({ default: false }) 
    isActive: boolean;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
