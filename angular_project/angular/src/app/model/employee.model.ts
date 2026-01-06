import { Experience } from "./experience.model";

export interface Employee{
    id: number,
    jiraid : string,
    name : string,
    email : string,
    experiences : Experience[]
}