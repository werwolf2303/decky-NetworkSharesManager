import {removeFromArray, uniqueRandom} from "./utils";

export enum BackendEventTypes {
    ERRUSERNAMEPASSWORD,  // Username or Password is invalid
    ERRADDRESS, // Share address is invalid
    ERROTHER // Some unknown error happened
}

export class BackendEvent {
    private readonly eventType: BackendEventTypes;
    private readonly message: string;

    constructor(eventJSON: { event: { eventType: number, message: string } }) {
        this.eventType = eventJSON.event.eventType as BackendEventTypes;
        this.message = eventJSON["event"]["message"];
    }

    getEventType(): BackendEventTypes {
        return this.eventType;
    }

    getMessage(): string {
        return this.message;
    }
}

export class BackendEvents {
    private events: BackendEvent[];

    constructor() {
        this.events = [];
    }

    parse(events: Array<{ event:{ eventType: number; message: string; } }>) {
        for (let eventObj of events) {
            this.events.push(new BackendEvent(eventObj));
        }
    }

    getPendingEvents(): BackendEvent[] {
        const eventsCopy = this.events.map((event) => event);
        this.events = []
        return eventsCopy;
    }
}

export class Event {
    private subscribers: Function[];
    private subscriberIds: number[];
    private name: string;

    constructor(name: string) {
        this.subscribers = [];
        this.subscriberIds = [];
        this.name = name;
    }

    trigger(...data: any[]): void {
        for(let func of this.subscribers) {
            func(data)
        }
    }

    getName(): string {
        return this.name;
    }

    subscribe(func: Function): number {
        this.subscribers.push(func);
        const subscriberId = uniqueRandom(1, 99999, this.subscriberIds);
        this.subscriberIds.push(subscriberId);
        return subscriberId;
    }

    unsubscribe(subscriberId: number): boolean {
        let counter = -1;
        for(let i = 0; i < this.subscriberIds.length; i++) {
            if(this.subscriberIds[i] == subscriberId) {
                counter = i;
                break;
            }
        }
        if(counter == -1) return false;
        removeFromArray(this.subscribers, counter);
        removeFromArray(this.subscriberIds, counter);
        return true;
    }
}

export class Events {
    private events: Event[];

    constructor() {
        this.events = [];

        var errorEvent = new Event("onerror");
        this.events.push(errorEvent);

        var suspendEvent = new Event("onsuspend");
        this.events.push(suspendEvent);

        var onunloadEvent = new Event("onunload");
        this.events.push(onunloadEvent);

        var ondomountedtablerefreshEvent = new Event("ondomountedtablerefresh");
        this.events.push(ondomountedtablerefreshEvent);

        var ondoalltablerefreshEvent = new Event("ondoalltablerefresh");
        this.events.push(ondoalltablerefreshEvent);

        var onresumefromsuspend = new Event("onresumefromsuspend");
        this.events.push(onresumefromsuspend);

        var onconnectivitychange = new Event("onconnectivitychange");
        this.events.push(onconnectivitychange);
    }

    subscribe(func: Function, eventName: string): number {
        for(let i = 0; i < this.events.length; i++) {
            if(this.events[i].getName() == eventName) {
                return this.events[i].subscribe(func);
            }
        }
        return -1;
    }

    trigger(eventName: string, ...data: any[]) {
        for(let i = 0; i < this.events.length; i++) {
            if(this.events[i].getName() == eventName) {
                return this.events[i].trigger(data);
            }
        }
    }

    unsubscribe(subscriberId: number, eventName: string): boolean {
        for(let i = 0; i < this.events.length; i++) {
            if(this.events[i].getName() == eventName) {
                return this.events[i].unsubscribe(subscriberId);
            }
        }
        return false;
    }
}