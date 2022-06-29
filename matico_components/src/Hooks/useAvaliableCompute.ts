import { useEffect, useState } from "react";

export type Compute = {
    name: string;
    path: string;
};

export const useAvaliableCompute = () => {
    const [computes, setComputes] = useState<Array<Compute> | null>(null);
    useEffect(() => {
        fetch("http://localhost:8000/api/compute")
            .then((r) => r.json())
            .then((computes: Array<Compute>) => setComputes(computes));
    }, []);

    return computes;
};
