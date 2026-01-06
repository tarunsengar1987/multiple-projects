export interface Option{
    tooltip: string,
    apiname:string,
    name : string,
    values : any[],
    multi? : boolean //if multi = true, then the function will be fired only once on the whole selection and not x-times for x selected objects
}