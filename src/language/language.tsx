import english from "../../assets/language/en.json"
import {Backend} from "../backend"

export interface LanguageModule {
    translate(name: string): string;
}

export class LanguageDefinition {
    public code: string;
    public fullName: string;
    public handle: any;
    
    constructor(code: string, fullName: string, handle: any) {
        this.code = code;
        this.fullName = fullName;
        this.handle = handle;
    }
}

export class Language {
    private language: LanguageModule = {
        translate(name: string): string {
            return name
        }
    }
    private availableLanguages: LanguageDefinition[] =  [
        new LanguageDefinition("en", "English", english),
    ]
    private backend: Backend;
    
    constructor(backend: Backend) {
        this.backend = backend;
    }  

    async init() {
        var found = false;
        var selectedLangauge = await this.backend.getSetting("language");
        var upper: Language = this;
        var autodetect = await this.backend.getSetting("autolanguage") == "true";
        for (var language of this.availableLanguages) {
            if (autodetect) {
                if (language.code === navigator.language.split("-")[0].toLocaleLowerCase()) {
                    found = true;
                    this.language = {
                        translate(name: string): string {
                            return language.handle[name]
                        }
                    }
                    return
                }
            } else {
                if(language.code === selectedLangauge) {
                    found = true;
                    upper.language = {
                        translate(name: string): string {
                            return language.handle[name]
                        }
                    }
                    return;
                }
            }
        }

        if(!found) {
            var en = this.availableLanguages[0];
            this.language = {
                translate(name: string): string {
                    return en.handle[name]
                }
            }
        }
    }

    translate(name: string): string {
        return this.language.translate(name);
    }

    getAvailableLanguages(): LanguageDefinition[] {
        return this.availableLanguages;
    }
}