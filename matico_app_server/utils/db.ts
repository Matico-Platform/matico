import { App, Dataset, Collaborator, PrismaClient, User, ResourceType } from "@prisma/client";
import { Session } from "next-auth";

type Resource = (App | Dataset) & {collaborators : Collaborator[]};

export const userFromSession = async (
  session: Session | null,
  prisma: PrismaClient
) => {
  if(!session) return null
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
  });
  return user;
};

export const userHasEdit =(
  resource: Resource,
  user?: User
) => {
  if (!user) {
    return false;
  }

  if (user.id === resource.ownerId) {
    return true;
  }

  if (
    resource.collaborators.find((c: Collaborator) => c.userId === user.id && c.edit)
  ) {
    return true;
  }

  return false;
};

export const userHasView =(
  resource: Resource,
  user?: User | null
) => {
  if (!user) {
    return resource.public;
  }
  if (user.id === resource.ownerId) {
    return true;
  }
  if (
    resource.collaborators.find((c: Collaborator) => c.userId === user.id && c.view)
  ) {
    return true;
  }

  return false;
};

export const userHasFork =(
  resource: Resource,
  user?: User
) => {
  if (!user) {
    return resource.public;
  }
  if (user.id === resource.ownerId) {
    return true;
  }

  if (
    resource.collaborators.find((c: Collaborator) => c.userId === user.id && c.view)
  ) {
    return true;
  }

  return false;
};

export const userHasManage = (
  resource: Resource,
  user?: User
) => {
  if (!user) {
    return false;
  }
  if (user.id === resource.ownerId) {
    return true;
  }

  if (
    resource.collaborators.find((c: Collaborator) => c.userId === user.id && c.manage)
  ) {
    return true;
  }

  return false;
};

export const setAppAccess = async (
  resource: Resource,
  resourceType: ResourceType,
  userId: string,
  permissions: { view: boolean; edit: boolean; manage: boolean },
  prisma: PrismaClient
) => {

  let linkedResource;

  switch(resourceType){
    case ResourceType.App:
      linkedResource = {app:{connect:{id:resource.id}}}
      break
    case ResourceType.Dataset:
      linkedResource = {app:{connect:{id:resource.id}}}
      break
  }

  return prisma.collaborator.upsert({
    where: {
      userId_resourceId: {userId:userId,resourceId:resource.id},
    },
    create: {
      view: permissions.view,
      manage: permissions.manage,
      edit: permissions.edit,
      user: {connect:{id:userId}},
      resourceType: "url" in resource ? "App" : "Dataset",
      ...linkedResource
    },
    update: {
      view: permissions.view,
      manage: permissions.manage,
      edit: permissions.edit,
    },
  });
};
