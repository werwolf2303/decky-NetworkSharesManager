import {Events} from "./events"
import {Language} from "./language/language";

export class Frontend {
    private events: Events;
    private language: Language;
    private version: string = "0.0.1";

    constructor(events: Events, language: Language) {
        this.events = events;
        this.language = language;
    }

    getPluginVersion(): string {
        return this.version;
    }

    getLanguage(): Language {
        return this.language;
    }

    getEvents(): Events {
        return this.events;
    }
}