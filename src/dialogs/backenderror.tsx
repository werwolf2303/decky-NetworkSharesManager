import {BackendEvent} from "../events";
import {ConfirmModal, showModal} from "decky-frontend-lib";
import {Frontend} from "../frontend";


export function openBackendErrorDialog(backendEvent: BackendEvent, frontend: Frontend) {
    showModal(
        <ConfirmModal
            strTitle={frontend.getLanguage().translate("backend.event.dialog.title")}
            strDescription={backendEvent.getMessage()}
            strOKButtonText={frontend.getLanguage().translate("backend.event.dialog.button1")}
            strCancelButtonText={frontend.getLanguage().translate("backend.event.dialog.button2")}
        />
    )
}