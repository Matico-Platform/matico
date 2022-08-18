import {
    closestCenter,
    closestCorners,
    CollisionDescriptor,
    CollisionDetection,
    rectIntersection,
} from "@dnd-kit/core";


/**
 * Sort collisions in descending order (from greatest to smallest value)
 */
 export function sortCollisionsAsc(
    { data: { value: a } }: CollisionDescriptor,
    { data: { value: b } }: CollisionDescriptor
) {
    return a - b;
}

/**
 * Returns the closest rectangles from an array of rectangles to the corners of
 * another rectangle.
 */
export const closestTop: CollisionDetection = ({
    collisionRect,
    droppableRects,
    droppableContainers,
    active
}) => {
    const activeId = active?.id;
    const top = collisionRect.top;
    const collisions: CollisionDescriptor[] = [];

    for (const droppableContainer of droppableContainers) {
        const { id } = droppableContainer;
        const rect = droppableRects.get(id);
        if (rect && id !== activeId) {
            const collisionTop = rect.top;
            const collisionMid = rect.top - rect.height / 2;
            const distance = Math.abs(collisionTop - top);

            collisions.push({
                id,
                data: {
                    droppableContainer,
                    value: distance,
                    overMid: collisionMid > top,
                    top: collisionTop
                }
            });
        }
    }

    return collisions.sort(sortCollisionsAsc);
};


export const outlineCollisionDetection: CollisionDetection = (args) => {
    const { active, collisionRect } = args;
    const currentParent = active?.data?.current?.parent;
    // const currentDepth = active?.data?.current?.depth;
    const currentTop = collisionRect.top;
    // const pointerIntersections = pointerWithin(args);
    const intersections = rectIntersection(args).filter(
        (intersected) => {
            // Filter for not self, to avoid container dropping into itself
            const activeId = active.id;
            const intersectedId = intersected.id;
            const intersectedPaneRefId =
                intersected?.data?.droppableContainer?.data?.current
                    ?.paneRefId;
            return (
                activeId !== intersectedId &&
                activeId !== intersectedPaneRefId
            );
        }
    );
    // todo something like this could be much more concise...
    // const nearestTops = closestTop({
    //     ...args
    // });
    // if (nearestTops.length > 1) {
    //     const nearestIsContainer =
    //         nearestTops[0]?.data?.droppableContainer?.value ===
    //         nearestTops[1]?.data?.droppableContainer?.value;
    //     if (nearestIsContainer) {
    //         const isOverMid =
    //             nearestTops[0]?.data?.droppableContainer?.overMid;
    //         if (isOverMid) {
    //             return nearestTops.filter(
    //                 (container) =>
    //                     container?.data?.current?.type !==
    //                     "container"
    //             );
    //         } else {
    //             return nearestTops.filter(
    //                 (container) =>
    //                     container?.data?.current?.type ===
    //                     "container"
    //             );
    //         }
    //     } else {
    //         return nearestTops;
    //     }
    // } else {
    //     return nearestTops;
    // }

    const parents = intersections.filter((intersected) => {
        const intersectedData =
            intersected?.data?.droppableContainer?.data?.current;
        const intersectedType = intersectedData?.type;
        const intersectedId = intersectedData?.targetId;
        const isContainer =
            ["page", "container"].includes(intersectedType) &&
            intersectedId;
        const isNewParent = intersectedId !== currentParent?.id;
        return isContainer && isNewParent;
    });

    const siblings = intersections.filter((intersected) => {
        const intersectedData =
            intersected?.data?.droppableContainer?.data?.current;
        const intersectedType = intersectedData?.type;
        const intersectedId = intersectedData?.targetId;
        const isContainer =
            ["page", "container"].includes(intersectedType) &&
            intersectedId;
        return !isContainer;
    });
    if (!parents.length) {
        return closestCenter({
            ...args,
            droppableContainers: siblings.map(
                (item) => item.data.droppableContainer
            )
        });
    }
    if (!siblings.length) {
        return closestCorners({
            ...args,
            droppableContainers: parents.map(
                (item) => item.data.droppableContainer
            )
        });
    } else {
        const closestSibling = closestCorners({
            ...args,
            droppableContainers: siblings.map(
                (item) => item.data.droppableContainer
            )
        });
        const closestParent = closestCorners({
            ...args,
            droppableContainers: parents.map(
                (item) => item.data.droppableContainer
            )
        });
        if (
            parents?.length === 1 &&
            parents[0]?.data?.droppableContainer?.data?.current
                ?.depth === 0
        ) {
            return closestSibling;
        }
        const parentTop =
            closestParent[0]?.data?.droppableContainer?.rect
                ?.current?.top;
        const parentBottom =
            closestParent[0]?.data?.droppableContainer?.rect
                ?.current?.bottom;
        const parentHeight = parentBottom - parentTop;
        const parentMid =
            (parentTop + parentBottom) / 2 - parentHeight / 2;
        if (parentMid < currentTop) {
            return closestParent;
        }
        return closestCorners({
            ...args,
            droppableContainers: [...siblings, ...parents].map(
                (item) => item.data.droppableContainer
            )
        });
    }
}