import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Speciality {
    @Prop({ required: true })
    name: string;
}

export type SpecialityDocument = Speciality & Document;
export const SpecialitySchema = SchemaFactory.createForClass(Speciality);
