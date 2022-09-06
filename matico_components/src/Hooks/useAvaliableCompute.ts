import { useEffect, useState } from "react";

export type Compute = {
    name: string;
    path: string;
};

export const useAvaliableCompute = () => {
    const [computes, setComputes] = useState<Array<Compute> | null>(null);
    useEffect(() => {
        fetch("/api/compute")
            .then((r) => r.json())
            .then((computes: Array<Compute>) => setComputes(computes));
    }, []);

    return [
{
"name": "Generate Synthetic Data",
"path": "https://matico.s3.us-east-2.amazonaws.com/compute/synthetic_analysis/matico_synthetic_data_analysis.js"
}
];
};
