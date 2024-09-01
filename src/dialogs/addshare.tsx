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
import React, {ChangeEvent, VFC} from "react";
import {Backend} from "../backend";

type AddShareModalProps = {
    closeModal: () => void,
    frontend: Frontend,
    backend: Backend,
    color: string,
    onClose: () => void
}

export const AddShareModal: VFC<AddShareModalProps> = ({
    closeModal,
    frontend,
    backend,
    color,
    onClose
}) => {
    const [ address, setAddress ] = React.useState<string>("");
    const [ globalAddress, setGlobalAddress ] = React.useState<string>("");
    const [ mountingPath, setMountingPath ] = React.useState<string>("");
    const [ username, setUsername ] = React.useState<string>("");
    const [ password, setPassword ] = React.useState<string>("");
    const [ automount, setAutomount ] = React.useState<boolean>(false);

    function checkInput(): boolean {
        var passwordCheck = password != "";
        var usernameCheck = username != "";
        var guestCheck = username.toLowerCase() == "guest";
        if(guestCheck) {
            passwordCheck = true;
        }
        return address != "" && mountingPath != "" && usernameCheck && passwordCheck;
    }

    return (
        <ModalRoot>
            <DialogHeader style={{ color: color }} className={"addShareModalHeader"} >
                {frontend.getLanguage().translate("addshare.title")}
            </DialogHeader>
            <DialogBody>
                <PanelSectionRow>
                    <Field label={frontend.getLanguage().translate("addshare.address")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setAddress(event.target.value);
                        }} style={{ minWidth: "50vw" }} placeholder={"//XXX.XXX.XXX.XXX/Wolf"} />
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <Field disabled={true} label={frontend.getLanguage().translate("addshare.globaladdress")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setGlobalAddress(event.target.value);
                        }} style={{ minWidth: "40vw" }} placeholder={"//example.com/Wolf"} />
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <Field label={frontend.getLanguage().translate("addshare.mountingpath")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setMountingPath(event.target.value);
                        }} style={{ minWidth: "40vw" }} placeholder={"/home/deck/Wolf"} />
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <Field label={frontend.getLanguage().translate("addshare.username")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setUsername(event.target.value);
                        }} style={{ minWidth: "50vw" }} placeholder={"walterhorst@example.com"} />
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <Field label={frontend.getLanguage().translate("addshare.password")}>
                        <TextField onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setPassword(event.target.value);
                        }} style={{ minWidth: "50vw" }} placeholder={"verysecurepassword1234"}/>
                    </Field>
                </PanelSectionRow>
                <PanelSectionRow>
                    <ToggleField
                        bottomSeparator={"standard"}
                        checked={false}
                        label={frontend.getLanguage().translate("addshare.automount")}
                        onChange={(checked: boolean) => {
                            setAutomount(checked);
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
                            closeModal();
                            onClose();
                            frontend.getEvents().trigger("ondoalltablerefresh");
                        }
                        var inputCheckResult: boolean = checkInput();
                        if(inputCheckResult) doSave()
                        if(!inputCheckResult) {
                            closeModal();
                            const {Close} = showModal(
                                <AddShareModal
                                    closeModal={() => {Close()}}
                                    frontend={frontend}
                                    backend={backend}
                                    color={"red"}
                                    onClose={onClose}
                                />,
                                window
                            )
                        }
                    }}>
                        {frontend.getLanguage().translate("addshare.add")}
                    </DialogButton>
                    <DialogButton onClick={() => {
                        closeModal();
                    }}>
                        {frontend.getLanguage().translate("addshare.closecancel")}
                    </DialogButton>
                </div>
            </DialogBody>
        </ModalRoot>
    );
}