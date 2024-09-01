import {
    DialogBody,
    DialogButton,
    DialogHeader, Field,
    ModalRoot,
    PanelSectionRow,
    showModal,
    TextField, ToggleField
} from "decky-frontend-lib";
import {Frontend} from "../frontend";
import {ChangeEvent} from "react";
import {Backend} from "../backend";

export const showAddShareModal = (
    frontend: Frontend,
    backend: Backend,
    addressObj = "",
    globalAddressObj = "",
    mountingPathObj = "",
    usernameObj = "",
    passwordObj = "",
    automountObj = false,
    color = "white"

) => {
    var address = addressObj;
    var globalAddress = globalAddressObj;
    var mountingPath = mountingPathObj;
    var username = usernameObj;
    var password = passwordObj;
    var automount = automountObj;

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
            <DialogHeader style={{ color: color }} className={"addShareModalHeader"} >
                {frontend.getLanguage().translate("addshare.title")}
            </DialogHeader>
            <DialogBody>
                <PanelSectionRow>
                    <Field label={frontend.getLanguage().translate("addshare.address")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            address = event.target.value;
                        }} style={{ minWidth: "50vw" }} placeholder={"//XXX.XXX.XXX.XXX/Wolf"} />
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <Field disabled={true} label={frontend.getLanguage().translate("addshare.globaladdress")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            globalAddress = event.target.value;
                        }} style={{ minWidth: "40vw" }} placeholder={"//example.com/Wolf"} />
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <Field label={frontend.getLanguage().translate("addshare.mountingpath")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            mountingPath = event.target.value;
                        }} style={{ minWidth: "40vw" }} placeholder={"/home/deck/Wolf"} />
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <Field label={frontend.getLanguage().translate("addshare.username")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            username = event.target.value;
                        }} style={{ minWidth: "50vw" }} placeholder={"walterhorst@example.com"} />
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <Field label={frontend.getLanguage().translate("addshare.password")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            password = event.target.value;
                        }} style={{ minWidth: "50vw" }} placeholder={"verysecurepassword1234"}/>
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <ToggleField
                        bottomSeparator={"standard"}
                        checked={false}
                        label={frontend.getLanguage().translate("addshare.automount")}
                        onChange={(checked: boolean) => {
                            automount = checked;
                        }}
                    />
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
                            showAddShareModal(
                                frontend,
                                backend,
                                address,
                                globalAddress,
                                mountingPath,
                                username,
                                password,
                                automount,
                                "red"
                            );
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
