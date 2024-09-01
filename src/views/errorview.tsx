import {Frontend} from "../frontend";
import {ReactElement} from "react";
import {PanelSection} from "decky-frontend-lib";

export function ErrorView({frontend, error}: {frontend: Frontend, error: string}): ReactElement {
    return (<>
        <PanelSection title={frontend.getLanguage().translate("error.title")} >
            <p>{frontend.getLanguage().translate("error.header")}</p>
            <p style={{ color:"red" }}>{error}</p>
        </PanelSection>
    </>);
}