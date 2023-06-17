import { LocalDataset } from "./LocalDataset";
import { Dataset, GeomType } from "./Dataset";
import { WASMCompute } from "@maticoapp/matico_types/spec";
import { fromArrow } from "arquero";
import { DataType, tableToIPC } from "@apache-arrow/es5-cjs";
import { loadAnalysis } from "Hooks/useAnalysis";
import { getGeomType } from "./ArrowBuilder";

const arrowTypeToMaticoType = (aType: DataType) => {
    if (
        DataType.isInt(aType) ||
        DataType.isFloat(aType) ||
        DataType.isDecimal(aType)
    ) {
        return "number";
    }
    if (DataType.isBinary(aType)) {
        return "geometry";
    }
    if (DataType.isUtf8(aType)) {
        return "text";
    }
    return "unknown";
};

export const WasmComputeBuilder = async (
    details: WASMCompute,
    datasets: Array<Dataset>
) => {
    const { name, url, params } = details;
    console.log("Starting compute for ", name, url, params);
    try {
        let analysis = await loadAnalysis(url);

        params.forEach(({ name, parameter }) => {
            if (parameter.type === "table") {
                let dataset = datasets[parameter.value];
                if (dataset) {
                    // const table = dataset._data.toArrow();
                    //
                    let cols = dataset._data
                        .toArrow()
                        .schema.fields.map((f) => ({
                            name: f.name,
                            type: f.type
                        }));

                    console.log("cols ", cols);

                    const table = dataset._data.toArrow();

                    const ipc2 = tableToIPC(table, "file");

                    try {
                        console.log("trying to register table", name);
                        analysis.register_table(
                            name,
                            ipc2
                            //dataset._data.toArrowBuffer()
                        );
                        console.log("registered table ", name);
                    } catch (ee) {
                        debugger;
                    }
                }
            }
            // else if(parameter.type==='optionGroup'){
            //   let mappedParameter  = parameter.value.reduce((agg: Record<string,ParameterValue>,val: SpecParameter)=>({...agg,[val.name]:val.parameter}), {});
            //   console.log("mapped parameter", parameter, name, params, mappedParameter )
            //   try{
            //     analysis.set_parameter(name,{type:"optionGroup",value:mappedParameter})
            //   catch{
            //     console.log("ERROR HAPPENED WHILE SETTING PARAMETER GROUP")
            //   }
            // }
            else {
                try {
                    console.log("setting parameter ", name, parameter);
                    analysis.set_parameter(name, parameter);
                } catch {
                    console.log("FAILED TO REGISTER ", name, parameter);
                }
            }
        });

        console.log("parameters registered");

        console.log("runing analyisis");
        const run_result = analysis.run();
        console.log("analyisis run");
        let dataFrame = fromArrow(run_result);

        let geomType = getGeomType(dataFrame.column("geom"));
        console.log("GEom type from result is ", geomType);

        const fields = dataFrame.toArrow().schema.fields.map((f) => ({
            name: f.name,
            type: arrowTypeToMaticoType(f.type)
        }));
        return new LocalDataset(
            details.name,
            "ogc_fid",
            fields,
            dataFrame,
            geomType
        );
    } catch (e) {
        debugger;
    }
};
