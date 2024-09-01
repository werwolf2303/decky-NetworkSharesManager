import {
    DialogBody, DialogButton,
    DialogHeader, Field,
    ModalRoot, PanelSectionRow,
    showModal, TextField, ToggleField
} from "decky-frontend-lib";
import {Frontend} from "../frontend";
import {Backend} from "../backend";
import {ChangeEvent} from "react";
import {getLastElement} from "../utils";

export const showEditShareModal = (
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
    color = "white"
) => {
    var address = share.address;
    var globalAddress = share.globaladdress;
    var mountingPath = share.mountingpath;
    var username = share.username;
    var password = share.password;
    var automount = share.automount;

    function checkInput(): boolean {
        var passwordCheck = password != "";
        var usernameCheck = username != "";
        var guestCheck = username.toLowerCase() == "guest";
        if(guestCheck) {
            passwordCheck = true;
        }
        return address != "" && mountingPath != "" && usernameCheck && passwordCheck;
    }

    const { Close } = showModal(
        <ModalRoot>
            <DialogHeader style={{ color: color }} className={"addShareModalHeader"}>
                {frontend.getLanguage().translate("manageshare.title").replace("%sharename%", getLastElement(address, "/"))}
            </DialogHeader>
            <DialogBody>
                <PanelSectionRow>
                    <Field label={frontend.getLanguage().translate("manageshare.address")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            address = event.target.value;
                        }} style={{ minWidth: "50vw" }} /*value={address}*/ />
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <Field disabled={true} label={frontend.getLanguage().translate("manageshare.globaladdress")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            globalAddress = event.target.value;
                        }} style={{ minWidth: "40vw" }} value={globalAddress} />
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <Field label={frontend.getLanguage().translate("manageshare.mountingpath")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            mountingPath = event.target.value;
                        }} style={{ minWidth: "40vw" }} value={mountingPath} />
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <Field label={frontend.getLanguage().translate("manageshare.username")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            username = event.target.value;
                        }} style={{ minWidth: "50vw" }} value={username} />
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <Field label={frontend.getLanguage().translate("manageshare.password")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            password = event.target.value;
                        }} style={{ minWidth: "50vw" }} value={password} />
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <ToggleField
                        bottomSeparator={"standard"}
                        checked={automount}
                        label={frontend.getLanguage().translate("manageshare.automount")}
                        onChange={(checked: boolean) => {
                            automount = checked;
                        }}
                    />
                </PanelSectionRow>
                <PanelSectionRow>
                    <DialogButton onClick={() => {
                        async function remove() {
                            await backend.removeShare(Number.parseInt(share.id));
                            Close()
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
                            await backend.settingsAddShare(username, password, address, globalAddress, mountingPath, automount);
                            Close()
                            frontend.getEvents().trigger("ondoalltablerefresh");
                        }
                        var inputCheckResult: boolean = checkInput();
                        if(inputCheckResult) doSave()
                        if(!inputCheckResult) {
                            Close()
                            showEditShareModal(
                                frontend,
                                backend,
                                share,
                                "red"
                            )
                        }
                    }}>
                        {frontend.getLanguage().translate("addshare.add")}
                    </DialogButton>
                    <DialogButton onClick={() => {
                        Close()
                    }}>
                        {frontend.getLanguage().translate("addshare.closecancel")}
                    </DialogButton>
                </div>
            </DialogBody>
        </ModalRoot>
    );
};
