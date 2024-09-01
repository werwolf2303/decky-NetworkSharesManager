import {Backend} from "../backend";
import {Frontend} from "../frontend";
import React, {ReactElement, useState} from "react";
import {DialogButton, Field, PanelSection, Spinner} from "decky-frontend-lib";
import {FaPen} from "react-icons/fa";
import {getLastElement} from "../utils";

export type FileSystem = {
    source: string;
    target: string;
    fstype: string;
    options: string;
    "use%": string | null;
    used: string | null;
    avail: string | null;
    children?: FileSystem[]; // Recursive definition for nested children
};

export type FileSystemArray = {
    filesystems: FileSystem[];
};

export function MountedShares({backend, frontend}: {backend: Backend, frontend: Frontend}): ReactElement {
    const [ loaded, setLoaded ] = useState<boolean>(false);
    const [ shares, setShares ] = React.useState<FileSystemArray | null>(null);
    const [ cifsCount, setCifsCount ] = React.useState(0);

    async function doReload() {
        setShares(JSON.parse(await backend.getMounts()));
        let counter = 0;
        shares?.filesystems?.[0]?.children?.map(share => {
            if(share.fstype === "cifs") counter++;
        });
        setCifsCount(counter)
    }

    async function load() {
        setShares(JSON.parse(await backend.getMounts()));
        let counter = 0;
        shares?.filesystems?.[0]?.children?.map(share => {
            if(share.fstype === "cifs") counter++;
        });
        setCifsCount(counter)
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
                {shares != null && cifsCount != 0 && <table style={{
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
                        <th style={{fontSize: "12px", textAlign: "left"}}>{frontend.getLanguage().translate("table.column3")}</th>
                    </tr>
                    {shares?.filesystems?.[0]?.children?.map(share => (
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
                                    frontend.getEvents().trigger("ondomountedtablerefresh");
                                }
                                unmount()
                            }}>
                                <FaPen></FaPen>
                            </DialogButton></td>
                        </tr>
                    )))}
                </table>}
                {shares != null && cifsCount == 0 && <p>{frontend.getLanguage().translate("table.empty")}</p>}
            </PanelSection>
        </>}
    </>)
}