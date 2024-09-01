import {ConfirmModal, showModal} from "decky-frontend-lib";
import {Frontend} from "../frontend";
import {Backend} from "../backend";

export function openFirstTime(backend: Backend, frontend: Frontend) {
    async function dontShowAgain() {
        await backend.setSetting("firstTime", "false")
    }

    showModal(
        <ConfirmModal
            onOK={() => {
                dontShowAgain()
            }}
            onCancel={() => {
                dontShowAgain()
            }}
            strTitle={frontend.getLanguage().translate("firsttime.dialog.title")}
            strOKButtonText={frontend.getLanguage().translate("firsttime.dialog.button1")}
            strCancelButtonText={frontend.getLanguage().translate("firsttime.dialog.button2")}
            strDescription={frontend.getLanguage().translate("firsttime.dialog.text")}
        />
    )
}