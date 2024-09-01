import {Backend} from "../backend";
import {Frontend} from "../frontend";
import React, {ReactElement, useState} from "react";
import {DialogButton, Field, PanelSection, Spinner} from "decky-frontend-lib";
import {getLastElement} from "../utils";
import {openBackendErrorDialog} from "../dialogs/backenderror";
import {LuHardDriveUpload} from "react-icons/lu";

export type FileSystem = {
    source: string;
    target: string;
    fstype: string;
    options: string;
    "use%": string | null;
    used: string | null;
    avail: string | null;
    children?: FileSystem[];
};

export type FileSystemArray = {
    filesystems: FileSystem[];
};

export function MountedShares({backend, frontend}: {backend: Backend, frontend: Frontend}): ReactElement {
    const [ loaded, setLoaded ] = useState<boolean>(false);
    const [ cifsFileSystems, setCifsFileSystems ] = React.useState<FileSystem[]>([]);

    async function doReload() {
        var shares: FileSystemArray = JSON.parse(await backend.getMounts());
        backend.getPendingBackendEvents().map((backendEvent) => {
            openBackendErrorDialog(backendEvent, frontend);
        })
        setCifsFileSystems([])
        if(shares != null) traverseFileSystem(shares.filesystems)
    }

    function traverseFileSystem(children: FileSystem[], foundCifs: FileSystem[] = []) {
        children?.map(filesystem => {
            if(filesystem?.children) {
                traverseFileSystem(filesystem.children, foundCifs)
            }
            if(filesystem?.fstype === "cifs") foundCifs.push(filesystem)
        });
        return foundCifs
    }

    async function load() {
        var shares: FileSystemArray = JSON.parse(await backend.getMounts());
        backend.getPendingBackendEvents().map((backendEvent) => {
            openBackendErrorDialog(backendEvent, frontend);
        })
        if(shares != null) setCifsFileSystems(traverseFileSystem(shares.filesystems))
        frontend.getEvents().subscribe(doReload, "ondomountedtablerefresh");
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
            <PanelSection title={frontend.getLanguage().translate("mountedshares.title")}>
                {cifsFileSystems?.length != 0 && <table style={{
                    width: "100%"
                }}>
                    <tr>
                        <th style={{
                            fontSize: "12px",
                            textAlign: "left"
                        }}>{frontend.getLanguage().translate("table.column1")}</th>
                        <th style={{
                            fontSize: "12px",
                            textAlign: "left"
                        }}>{frontend.getLanguage().translate("table.column2")}</th>
                        <th style={{fontSize: "12px", textAlign: "left"}}>{frontend.getLanguage().translate("mountedshares.unmount")}</th>
                    </tr>
                    {cifsFileSystems.map(share => (
                        share.fstype === "cifs" && (
                        <tr>
                            <td>{getLastElement(share.source, "/")}</td>
                            <td>{getLastElement(share.target, "/")}</td>
                            <td><DialogButton style={{
                                padding: '10px',
                                margin: '2px 0px',
                                minWidth: 'auto'
                            }} onClick={() => {
                                async function unmount() {
                                    await backend.unmount(share.target);
                                    backend.getPendingBackendEvents().map((backendEvent) => {
                                        openBackendErrorDialog(backendEvent, frontend);
                                    })
                                    frontend.getEvents().trigger("ondomountedtablerefresh");
                                }
                                unmount()
                            }}>
                                <LuHardDriveUpload />
                            </DialogButton></td>
                        </tr>
                    )))}
                </table>}
                {cifsFileSystems?.length == 0 && <p>{frontend.getLanguage().translate("table.empty")}</p>}
            </PanelSection>
        </>}
    </>)
}