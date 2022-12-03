import { prisma } from "../db";

export class QueryBuilder {
  query: Record<string, any>;

  baseType: "Dataset" | "App";

  constructor(baseType: "Dataset" | "App") {
    this.baseType = baseType;
    this.query = {
      where: {},
    };
  }

  fromParams(params: Record<string, any>) {
    console.log("Building with params ", params);
    if (params.hasOwnProperty("public")) {
      this.query.where.public = params.public === "true";
    }

    if (params.hasOwnProperty("search") && params.search.length > 0) {
      this.query.where.name = { search: params.search };
    }

    if (params.hasOwnProperty("owner")) {
      this.query.where.ownerId = params.owner;
    }

    if (
      params.hasOwnProperty("collaborators") &&
      params.collaborators === "true"
    ) {
      this.query.include = { ...this.query.include, collaborators: true };
    }

    if (
      params.hasOwnProperty("includeOwner") &&
      params.includeOwner === "true"
    ) {
      this.query.include = { ...this.query.include, owner: true };
    }

    if (params.hasOwnProperty("order")) {
      this.query.orderBy[params.order as string] = params.orderDir
        ? params.orderDir
        : "desc";
    }

    if (params.hasOwnProperty("skip")) {
      this.query.skip = params.skip;
    }

    if (params.hasOwnProperty("take")) {
      this.query.take = params.take;
    }
  }

  runQueryOne() {
    if (this.baseType === "Dataset") {
      return prisma.dataset.findUnique(this.query);
    } else if (this.baseType === "App") {
      return prisma.dataset.findUnique(this.query);
    }
  }

  runQueryMany() {
    if (this.baseType === "Dataset") {
      return prisma.dataset.findMany(this.query);
    } else if (this.baseType === "App") {
      return prisma.app.findMany(this.query);
    }
  }
}
