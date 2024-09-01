import {Backend} from "../backend";
import {Frontend} from "../frontend";
import {ReactElement} from "react";
import {AvailableShares} from "../sections/availableshares";
import {MountedShares} from "../sections/mountedshares";

export function OverView({backend, frontend}: {backend: Backend, frontend: Frontend}): ReactElement {
    return(<>
        <MountedShares backend={backend} frontend={frontend} />
        <AvailableShares backend={backend} frontend={frontend} />
    </>)
}