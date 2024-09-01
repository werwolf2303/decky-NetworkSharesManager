import {
    DialogBody, DialogButton,
    DialogHeader, Field,
    ModalRoot, PanelSectionRow,
    showModal, TextField, ToggleField
} from "decky-frontend-lib";
import {Frontend} from "../frontend";
import {Backend} from "../backend";
import React, {ChangeEvent, VFC} from "react";
import {getLastElement} from "../utils";
import {openBackendErrorDialog} from "./backenderror";

type EditShareModalProps = {
    closeModal: () => void,
    frontend: Frontend,
    backend: Backend,
    share: {
        username: string;
        password: string;
        address: string;
        globaladdress: string;
        mountingpath: string;
        automount: boolean;
        id: string;
    },
    color: string
}

export const EditShareModal: VFC<EditShareModalProps> = ({
    closeModal,
    frontend,
    backend,
    share,
    color = "white"
}) => {
    const [ address, setAddress ] = React.useState<string>(share.address);
    const [ globaladdress, setGlobalAddress ] = React.useState<string>(share.globaladdress);
    const [ mountingpath, setMountingPath ] = React.useState<string>(share.mountingpath);
    const [ username, setUsername ] = React.useState<string>(share.username);
    const [ password, setPassword ] = React.useState<string>(share.password);
    const [ automount, setAutomount ] = React.useState<boolean>(share.automount);

    function checkInput(): boolean {
        var passwordCheck = password != "";
        var usernameCheck = username != "";
        var guestCheck = username.toLowerCase() == "guest";
        if(guestCheck) {
            passwordCheck = true;
        }
        return address != "" && mountingpath != "" && usernameCheck && passwordCheck;
    }

    return (
        <ModalRoot>
            <DialogHeader style={{ color: color }} className={"addShareModalHeader"}>
                {frontend.getLanguage().translate("manageshare.title").replace("%sharename%", getLastElement(address, "/", share.address))}
            </DialogHeader>
            <DialogBody>
                <PanelSectionRow>
                    <Field label={frontend.getLanguage().translate("manageshare.address")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setAddress(event.target.value);
                        }} style={{ minWidth: "50vw" }} value={address} />
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <Field disabled={true} label={frontend.getLanguage().translate("manageshare.globaladdress")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setGlobalAddress(event.target.value);
                        }} style={{ minWidth: "40vw" }} value={globaladdress} />
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <Field label={frontend.getLanguage().translate("manageshare.mountingpath")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setMountingPath(event.target.value);
                        }} style={{ minWidth: "40vw" }} value={mountingpath} />
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <Field label={frontend.getLanguage().translate("manageshare.username")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setUsername(event.target.value);
                        }} style={{ minWidth: "50vw" }} value={username} />
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <Field label={frontend.getLanguage().translate("manageshare.password")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setPassword(event.target.value);
                        }} style={{ minWidth: "50vw" }} value={password} />
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <ToggleField
                        bottomSeparator={"standard"}
                        checked={automount}
                        label={frontend.getLanguage().translate("manageshare.automount")}
                        onChange={(checked: boolean) => {
                            setAutomount(checked);
                        }}
                    />
                </PanelSectionRow>
                <PanelSectionRow>
                    <DialogButton onClick={() => {
                        async function remove() {
                            await backend.removeShare(Number.parseInt(share.id));
                            backend.getPendingBackendEvents().map((backendEvent) => {
                                openBackendErrorDialog(backendEvent, frontend);
                            })
                            closeModal();
                            frontend.getEvents().trigger("ondoalltablerefresh");
                        }
                        remove()
                    }}>
                        {frontend.getLanguage().translate("manageshare.remove")}
                    </DialogButton>
                </PanelSectionRow>
                <br/>
                <br/>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "15%"
                }}>
                    <DialogButton onClick={() => {
                        async function doSave() {
                            await backend.settingsEditShare(share.id, username, password, address, globaladdress, mountingpath, automount);
                            backend.getPendingBackendEvents().map((backendEvent) => {
                                openBackendErrorDialog(backendEvent, frontend);
                            })
                            closeModal();
                            frontend.getEvents().trigger("ondoalltablerefresh");
                        }
                        var inputCheckResult: boolean = checkInput();
                        if(inputCheckResult) doSave()
                        if(!inputCheckResult) {
                            closeModal();
                            const {Close} = showModal(
                                <EditShareModal
                                    closeModal={() => {Close()}}
                                    frontend={frontend}
                                    backend={backend}
                                    share={share}
                                    color={"red"}
                                />,
                                window
                            )
                        }
                    }}>
                        {frontend.getLanguage().translate("manageshare.apply")}
                    </DialogButton>
                    <DialogButton onClick={() => {
                        closeModal();
                    }}>
                        {frontend.getLanguage().translate("manageshare.closecancel")}
                    </DialogButton>
                </div>
            </DialogBody>
        </ModalRoot>
    );
}