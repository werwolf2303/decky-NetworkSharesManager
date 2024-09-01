import {Backend} from "../backend";
import {Frontend} from "../frontend";
import React, {ReactElement, useState} from "react";
import {DialogButton, Field, PanelSection, showModal, sleep, Spinner} from "decky-frontend-lib";
import {FaPen} from "react-icons/fa";
import {getLastElement} from "../utils";
import {EditShareModal} from "../dialogs/editshare";
import {GrNetworkDrive } from "react-icons/gr";
import {AddShareModal} from "../dialogs/addshare";
import {openBackendErrorDialog} from "../dialogs/backenderror";

export function AvailableShares({backend, frontend}: {backend: Backend, frontend: Frontend}): ReactElement {
    const [ loaded, setLoaded ] = useState<boolean>(false);
    const [ shares, setShares ] = React.useState<Array<{
        username: string;
        password: string;
        address: string;
        globaladdress: string;
        mountingpath: string;
        automount: boolean;
        id: string;
    }>>([]);


    async function doReload() {
        setShares(JSON.parse(await backend.getShares()));
        backend.getPendingBackendEvents().map((backendEvent) => {
            openBackendErrorDialog(backendEvent, frontend);
        })
    }

    async function load() {
        setShares(JSON.parse(await backend.getShares()));
        backend.getPendingBackendEvents().map((backendEvent) => {
            openBackendErrorDialog(backendEvent, frontend);
        })
        frontend.getEvents().subscribe(doReload, "ondoalltablerefresh");
    }

    React.useEffect(() => {
        load().then(() => setLoaded(true))
    }, [])

    return(<>
        {!loaded &&
            <PanelSection>
                <Field label={frontend.getLanguage().translate("general.loading")}>
                    <Spinner />
                </Field>
            </PanelSection>
        }
        {loaded && <>
            <PanelSection title={frontend.getLanguage().translate("availableshares.title")}>
                {shares.length != 0 && <table style={{
                    width: "100%"
                }}>
                    <tr>
                        <th style={{
                            fontSize: "12px",
                            textAlign: "left"
                        }}>{frontend.getLanguage().translate("table.column1")}</th>
                        <th style={{fontSize: "12px", textAlign: "left"}}>{frontend.getLanguage().translate("table.column3")}</th>
                        <th style={{fontSize: "12px", textAlign: "left"}}>{frontend.getLanguage().translate("availableshares.edit")}</th>
                    </tr>
                    {shares.map(share => (
                        <tr>
                            <td>{getLastElement(share["address"], "/")}</td>
                            <td><DialogButton style={{
                                padding: '10px',
                                margin: '2px 0px',
                                minWidth: 'auto'
                            }} onClick={() => {
                                async function mount() {
                                    await backend.mount(share.username, share.password, share.address, share.mountingpath);
                                    backend.getPendingBackendEvents().map((backendEvent) => {
                                        openBackendErrorDialog(backendEvent, frontend);
                                    })
                                    sleep(2000).then(() =>   frontend.getEvents().trigger("ondomountedtablerefresh"));
                                }
                                mount()
                            }}>
                                <GrNetworkDrive />
                            </DialogButton></td>
                            <td><DialogButton style={{
                                padding: '10px',
                                margin: '2px 0px',
                                minWidth: 'auto'
                            }} onClick={() => {
                                const {Close} = showModal(
                                    <EditShareModal
                                        closeModal={() => {Close()}}
                                        frontend={frontend}
                                        backend={backend}
                                        share={share}
                                        color={"white"}
                                    />,
                                    window
                                )
                            }}>
                                <FaPen></FaPen>
                            </DialogButton></td>
                        </tr>
                    ))}
                </table>}
                {shares.length == 0 && <p>{frontend.getLanguage().translate("table.empty")}</p>}
                <DialogButton style={{
                    width: "90%"
                }} onClick={() => {
                    const {Close} = showModal(
                        <AddShareModal
                            closeModal={() => {Close()}}
                            frontend={frontend}
                            backend={backend}
                            color={"white"}
                            onClose={() => {
                                backend.getPendingBackendEvents().map((backendEvent) => {
                                    openBackendErrorDialog(backendEvent, frontend);
                                })
                            }}
                        />,
                        window
                    )
                }}>
                    {frontend.getLanguage().translate("availableshares.addshare.title")}
                </DialogButton>
            </PanelSection>
        </>}
    </>)
}