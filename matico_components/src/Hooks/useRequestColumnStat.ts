import { useEffect, useMemo } from "react";
import {
    ColumnStatRequest,
    Query,
    registerColumnStatUpdates
} from "Stores/MaticoDatasetSlice";
import { useMaticoDispatch, useMaticoSelector } from "./redux";
//@ts-ignore
import { v4 as uuid } from "uuid";

/**
 * Get a single column stat for a given dataset
 * @param args: ColumnStatRequest : the request we want to get
 *
 */
export const useRequestColumnStat = (args: ColumnStatRequest) => {
    const dispatch = useMaticoDispatch();
    const requestHash = JSON.stringify(args);
    const result: Query | null = useMaticoSelector(
        (state) => state.datasets.queries[requestHash]
    );
    const notifierId = useMemo(() => uuid(), []);

    useEffect(() => {
        if (!result && args) {
            dispatch(
                registerColumnStatUpdates({ requestHash, args, notifierId })
            );
        }
    }, [requestHash, result]);

    return result;
};

/**
 * Get mulitple column stats
 * @param requests: Array<ColumnStatRequest> : the requests we want to get
 *
 */
export const useRequestColumnStats = (requests: Array<ColumnStatRequest>) => {
    const dispatch = useMaticoDispatch();
    const requestHashes = requests.map((args) => JSON.stringify(args));

    const queries = useMaticoSelector((state) => state.datasets.queries);
    const result = requestHashes.map((rh) => queries[rh]);

    const haveAll = result.every((r) => r);

    const notifierId = useMemo(() => uuid(), []);

    useEffect(() => {
        if (!haveAll && requests) {
            requests.forEach((request, index) => {
                dispatch(
                    registerColumnStatUpdates({
                        requestHash: requestHashes[index],
                        args: request,
                        notifierId
                    })
                );
            });
        }
    }, [requests, haveAll]);

    return result;
};
