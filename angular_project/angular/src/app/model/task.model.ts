import { D } from "@fullcalendar/resource/internal-common";

export class Task{
    id: string;
    title: string;
    parent: string;
    parentDone: boolean;
    children: Task[]; //for connections
    assignee: string;
    trueleaf: boolean;
    done: boolean;
    duration: number; 
    subnodes: Task[]; //for graph hierarchy (subgraphs)
    topgraphanchor: string

    constructor(
        id: string,
        title: string,
        parent: string,
        parentDone: boolean,
        children: Task[],
        assignee: string,
        trueleaf: boolean,
        done: boolean,
        duration: number,
        subnodes: Task[],
        topgraphanchor: string
    ){
        this.assignee = assignee;
        this.title = title; //name
        this.parent = parent; //parentId
        this.children = children;
        this.id = id;
        this.trueleaf = trueleaf; //isTrueLeaf
        this.done = done; //isDone
        this.duration = duration;
        this.subnodes = subnodes;
        this.topgraphanchor = topgraphanchor;
        this.parentDone = parentDone;
    }
}

export class Connection{
    item: string;
    dependsOn: string;

    constructor(item: string, dependsOn: string){
        this.item = item;
        this.dependsOn = dependsOn;
    }
}

export class Project{
    connections: Connection[]
    tasks: Task[]

    constructor(tasks: Task[], connections : Connection[]){
        this.tasks = tasks;
        this.connections = connections;
    }
}