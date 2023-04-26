import { NextApiRequest, NextApiResponse } from "next";
import { glob } from "glob";
import path from "path";
import { compute } from "./list";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.NODE_ENV === "production") {
    res.status(200).json(compute);
  }

  let compute_modules = path.join(
    __dirname,
    "../../../../public/compute/*/pkg/*.js"
  );
  let found_modules = await glob(compute_modules);

  let compute_module_list = found_modules.map((mod_path: string) => {
    let name = mod_path.split("/").slice(-1)[0].split(".")[0];
    let path = "/" + mod_path.split("/").slice(-4).join("/");
    return {
      name,
      path,
    };
  });

  res.status(200).json(compute_module_list);
}
