import {
    definePlugin,
    ServerAPI,
    staticClasses,
} from "decky-frontend-lib";
import {FaNetworkWired} from "react-icons/fa";
import {Backend} from "./backend";
import {BackendEvents, Events} from "./events";
import {Frontend} from "./frontend";
import {MainView} from "./views/mainview";
import {Language} from "./language/language";

export default definePlugin((serverApi: ServerAPI) => {
    var backend = new Backend(serverApi, new BackendEvents());
    var frontend = new Frontend(new Events(), new Language(backend));

    const { unregister: unregisterOnSuspendRequest } =
        SteamClient.System.RegisterForOnSuspendRequest(async () => {
            frontend.getEvents().trigger("onsuspend")
        });

    const { unregister: unregisterOnResumeFromSuspend } =
        SteamClient.System.RegisterForOnResumeFromSuspend(async () => {
            frontend.getEvents().trigger("onresumefromsuspend")
        })

    const { unregister: unregisterConnectivityTestChanges } =
        SteamClient.System.Network.RegisterForConnectivityTestChanges(async (connectivityTestChange: { eConnectivityTestResult: number, eFakeState: number, bChecking: boolean }) => {
            frontend.getEvents().trigger("onconnectivitychange", connectivityTestChange)
        })

    return {
        title: <div className={staticClasses.Title}>Network Shares Manager</div>,
        content: <MainView frontend={frontend} backend={backend}/>,
        icon: <FaNetworkWired/>,
        onDismount() {
            frontend.getEvents().trigger("onunload")
            unregisterOnSuspendRequest();
            unregisterOnResumeFromSuspend();
            unregisterConnectivityTestChanges();
        }
    };
});
