import { ServerAPI } from "decky-frontend-lib";
import {BackendEvent, BackendEvents} from "./events";

export class Backend {
    private serverAPI: ServerAPI;
    private backendEvents: BackendEvents

    constructor(serverAPI: ServerAPI, backendEvents: BackendEvents) {
        this.serverAPI = serverAPI;
        this.backendEvents = backendEvents;
    }

    getPendingBackendEvents(): BackendEvent[] {
        return this.backendEvents.getPendingEvents();
    }

    async init(): Promise<boolean> {
        var bool = (await this.serverAPI.callPluginMethod("init", {})).success as boolean;
        this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
        return bool;
    }

    async getMounts(): Promise<string> {
        var ret = (await this.serverAPI.callPluginMethod("getMounts", {})).result as string;
        this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
        return ret;
    }

    async execute(code: string): Promise<string> {
        var ret = (await this.serverAPI.callPluginMethod("execute", {"code": code})).result as string;
        this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
        return ret;
    }

    async rmDir(path: string): Promise<boolean> {
        var bool = (await this.serverAPI.callPluginMethod("rmDir", {"path": path})).success as boolean;
        this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
        return bool;
    }

    async mkdir(path: string): Promise<boolean> {
        var bool = (await this.serverAPI.callPluginMethod("mkdir", {"path": path})).success as boolean;
        this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
        return bool;
    }

    async mount(username: string, password: string, shareaddress: string, sharepath: string): Promise<boolean> {
        var bool = (await this.serverAPI.callPluginMethod("mount", {"username": username, "password": password, "shareaddress": shareaddress, "sharepath": sharepath})).success as boolean;
        this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
        return bool;
    }

    async unmount(sharepath: string): Promise<boolean> {
        var bool = (await this.serverAPI.callPluginMethod("unmount", {"sharepath": sharepath})).success as boolean;
        this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
        return bool;
    }

    async settingsAddShare(username: string, password: string, address: string, globaladdress: string, mountingpath: string, automount: boolean): Promise<boolean> {
        var bool = (await this.serverAPI.callPluginMethod("settingsAddShare", {"username": username, "password": password, "address": address, "globaladdress": globaladdress, "mountingpath": mountingpath, "automount": automount})).success as boolean;
        this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
        return bool;
    }

    async settingsEditShare(shareID: string, username: string, password: string, address: string, globaladdress: string, mountingpath: string, automount: boolean): Promise<boolean> {
        var bool = (await this.serverAPI.callPluginMethod("editShare", {"shareID": shareID, "username": username, "password": password, "address": address, "globaladdress": globaladdress, "mountingpath": mountingpath, "automount": automount})).success as boolean;
        this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
        return bool;
    }

    async removeShare(shareId: number): Promise<boolean> {
        var bool = (await this.serverAPI.callPluginMethod("removeShare", {"shareId": shareId})).success as boolean;
        this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
        return bool;
    }

    async setSetting(key: string, value: string): Promise<boolean> {
        var bool = (await this.serverAPI.callPluginMethod("setSetting", {"key": key, "value": value})).success as boolean;
        this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
        return bool;
    }

    async getSetting(key: string): Promise<string> {
        var ret = (await this.serverAPI.callPluginMethod("getSetting", {"key": key})).result as string;
        console.log(await this.getPendingEvents());
        this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
        return ret;
    }

    async getShares(): Promise<string> {
        return (await this.serverAPI.callPluginMethod("getShares", {})).result as string;
    }

    async removeSetting(key: string): Promise<boolean> {
        var bool = (await this.serverAPI.callPluginMethod("removeSetting", {"key": key})).success as boolean;
        this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
        return bool;
    }

    async refreshConfig(): Promise<boolean> {
        var bool = (await this.serverAPI.callPluginMethod("refreshConfig", {})).success as boolean;
        this.backendEvents.parse(JSON.parse(await this.getPendingEvents()));
        return bool;
    }

    async getPendingEvents(): Promise<string> {
        return (await this.serverAPI.callPluginMethod("getPendingEvents", {})).result as string;
    }
}