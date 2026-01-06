export class AgentEvent{
    agentId: number;
    iconName: string; 
    texts: string []; //only AiResponse will have more then one element
    lastTextIndex: number;
    type: string;
    prompt?: string; //can be empty for anything else than AiResponse
    context?: string; //can be empty for anything else than AiResponse

    constructor(agentId: number, iconName: string, texts: string[], lastTextIndex: number, type: string, prompt?: string, context?: string){
        this.agentId = agentId;
        this.iconName = iconName;
        this.texts = texts;
        this.lastTextIndex = lastTextIndex;
        this.type = type;
        this.prompt = prompt;
        this.context = context;
    }
}