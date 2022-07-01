import React, { useState, useMemo, useRef, useEffect } from "react";
import { iconList as icons } from "Utils/iconUtils";
import { throttle } from "lodash";

export function useIconList() {
    const [returnLength, setReturnLength] = useState(20);
    const [filterText, setFilterText] = useState("");
    const loadMoreIcons = useRef(
        throttle(() => setReturnLength((prev) => prev + 20), 750)
    ).current;

    useEffect(() => {
        setReturnLength(20);
    }, [filterText]);

    const iconList = useMemo(
        () =>
            icons
                .filter(({ name }) => name.includes(filterText.toLowerCase()))
                .slice(0, returnLength),
        [filterText, returnLength]
    );

    return {
        iconList,
        filterText,
        setFilterText,
        loadMoreIcons
    };
}
