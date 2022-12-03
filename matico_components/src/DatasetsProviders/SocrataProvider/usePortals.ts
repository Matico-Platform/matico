import { useState, useEffect } from "react";
export type PortalInfo = { domain: string; count: number };

export const usePortals = () => {
    const [portals, setPortals] = useState<Array<PortalInfo> | null>(null);
    useEffect(() => {
        fetch("https://api.us.socrata.com/api/catalog/v1/domains")
            .then((res) => res.json())
            .then((result) =>
                setPortals(
                    result.results
                        .filter((r: PortalInfo) => r.count > 0)
                        .sort((a: PortalInfo, b: PortalInfo) =>
                            a.count < b.count ? 1 : -1
                        )
                )
            );
    }, []);
    return portals;
};
