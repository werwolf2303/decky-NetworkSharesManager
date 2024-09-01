import {Frontend} from "../frontend";
import React, {ReactElement} from "react";
import {Backend} from "../backend";
import {ErrorView} from "./errorview";
import {OverView} from "./overview";
import {FileSystemArray} from "../sections/mountedshares";
import {Field, PanelSection, Spinner} from "decky-frontend-lib";
import {openFirstTime} from "../dialogs/firsttime";
import {openBackendErrorDialog} from "../dialogs/backenderror";

export function MainView({backend, frontend}: { backend: Backend, frontend: Frontend }): ReactElement {
    const [loaded, setLoaded] = React.useState(false);
    const [error, setError] = React.useState("");
    const [errorState, setErrorState] = React.useState(false);

    function onError(...data: any[]) {
        setError(data[0]);
        setErrorState(true);
    }

    async function onSuspend() {
        var mounts: FileSystemArray = JSON.parse(await backend.getMounts());
        mounts?.filesystems?.[0]?.children?.map(share => {
            if (share.fstype === "cifs") {
                backend.unmount(share.target);
            }
        });
    }

    async function onResumeFromSuspend() {
        var shares: Array<{
            username: string;
            password: string;
            address: string;
            globaladdress: string;
            mountingpath: string;
            automount: boolean;
            id: string;
        }> = JSON.parse(await backend.getShares());
        shares.map((share) => {
            if (share.automount) {
                backend.mount(share.username, share.password, share.address, share.mountingpath);
            }
        })
    }

    async function onConnectivityTestChange(connectivityTestChange: {
        eConnectivityTestResult: number,
        eFakeState: number,
        bChecking: boolean
    }) {
        if (connectivityTestChange.eConnectivityTestResult == 5) {
            onSuspend()
        }
        if (connectivityTestChange.eConnectivityTestResult == 1) {
            var shares: Array<{
                username: string;
                password: string;
                address: string;
                globaladdress: string;
                mountingpath: string;
                automount: boolean;
                id: string;
            }> = JSON.parse(await backend.getShares());
            shares.map((share) => {
                if (share.automount) {
                    backend.mount(share.username, share.password, share.address, share.mountingpath);
                }
            })
        }
    }

    async function load() {
        await backend.init()
        await frontend.getLanguage().init()
        frontend.getEvents().subscribe(onError, "onerror");
        frontend.getEvents().subscribe(onSuspend, "onsuspend")
        frontend.getEvents().subscribe(onResumeFromSuspend, "onresumefromsuspend");
        frontend.getEvents().subscribe(onConnectivityTestChange, "onconnectivitychange");
    }

    async function checkFirstTime() {
        var openIt = await backend.getSetting("firstTime") == "true";
        var hasError = false;
        backend.getPendingBackendEvents().map((backendEvent) => {
            hasError = true;
            openBackendErrorDialog(backendEvent, frontend);
        })
        if(openIt && !hasError) openFirstTime(backend, frontend);
    }

    React.useEffect(() => {
        async function checkVersion() {
            if(await backend.getSetting("version") != frontend.getPluginVersion()) {
                await backend.refreshConfig()
                await backend.setSetting("firstTime", "true")
            }
        }
        load().then(() => {
            setLoaded(true)
            checkVersion().then(() =>  checkFirstTime());
        })
    }, []);

    return (<>
        {!loaded &&
            <PanelSection>
                <Field label={frontend.getLanguage().translate("general.loading")}>
                    <Spinner/>
                </Field>
            </PanelSection>
        }
        {loaded && errorState && <ErrorView error={error} frontend={frontend}/>}
        {loaded && !errorState && <OverView backend={backend} frontend={frontend}/>}
    </>);
}