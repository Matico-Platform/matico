import styled from "styled-components";

export const PaneGrid = styled.div`
    display: grid;
    position: relative;
    grid-template-columns: clamp(10px, 2.5rem, 15%) clamp(10px, 2.5rem, 15%) 1fr clamp(
            20px,
            3.125rem,
            25%
        ) 1fr clamp(10px, 2.5rem, 15%) clamp(10px, 2.5rem, 15%);
    grid-template-rows: clamp(10px, 2.5rem, 15%) clamp(10px, 2.5rem, 15%) 1fr clamp(
            20px,
            3.125rem,
            25%
        ) 1fr clamp(10px, 2.5rem, 15%) clamp(10px, 2.5rem, 15%);
    height: 100%;
    width: 100%;

    .grid.content,
    .grid.wrapper {
        grid-column: 1 / 8;
        grid-row: 1 / 8;
    }

    /* corners */
    .grid.n {
        grid-row-start: 1;
    }

    .grid.s {
        grid-row-end: 8;
    }

    .grid.e {
        grid-column-end: 8;
    }
    .grid.w {
        grid-column-start: 1;
    }

    /* centered */
    .grid.n.center,
    .grid.s.center {
        grid-column: 4/4;
    }
    .grid.e.center,
    .grid.w.center {
        grid-row: 4/4;
    }

    /* sizing */
    .grid.n.sm {
        grid-row-end: 2;
    }
    .grid.n.lg {
        grid-row-end: 3;
    }

    .grid.s.sm {
        grid-row-start: 7;
    }
    .grid.s.lg {
        grid-row-start: 6;
    }

    .grid.e.sm {
        grid-column-start: 7;
    }
    .grid.e.lg {
        grid-column-start: 6;
    }
    .grid.w.sm {
        grid-column-end: 2;
    }
    .grid.w.lg {
        grid-column-end: 3;
    }
`;
