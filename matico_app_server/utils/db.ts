import { App, Colaborator, PrismaClient, User } from "@prisma/client";
import { Session } from "next-auth";

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
  app: App & { colaborators: Colaborator[] },
  user?: User
) => {
  if (!user) {
    return false;
  }

  if (user.id === app.ownerId) {
    return true;
  }

  if (
    app.colaborators.find((c: Colaborator) => c.userId === user.id && c.edit)
  ) {
    return true;
  }

  return false;
};

export const userHasView =(
  app: App & { colaborators: Colaborator[] },
  user?: User | null
) => {
  if (!user) {
    return app.public;
  }
  if (user.id === app.ownerId) {
    return true;
  }
  if (
    app.colaborators.find((c: Colaborator) => c.userId === user.id && c.view)
  ) {
    return true;
  }

  return false;
};

export const userHasFork =(
  app: App & { colaborators: Colaborator[] },
  user?: User
) => {
  if (!user) {
    return app.public;
  }
  if (user.id === app.ownerId) {
    return true;
  }

  if (
    app.colaborators.find((c: Colaborator) => c.userId === user.id && c.view)
  ) {
    return true;
  }

  return false;
};

export const userHasManage = (
  app: App & { colaborators: Colaborator[] },
  user?: User
) => {
  if (!user) {
    return false;
  }
  if (user.id === app.ownerId) {
    return true;
  }

  if (
    app.colaborators.find((c: Colaborator) => c.userId === user.id && c.manage)
  ) {
    return true;
  }

  return false;
};

export const setAppAccess = async (
  app: App,
  userId: string,
  permisions: { view: boolean; edit: boolean; manage: boolean },
  prisma: PrismaClient
) => {
  return prisma.colaborator.upsert({
    where: {
      userId_resourceId: {userId:userId,resourceId:app.id},
    },
    create: {
      view: permisions.view,
      manage: permisions.manage,
      edit: permisions.edit,
      userId: userId,
      resourceId: app.id,
      resourceType: "app",
    },
    update: {
      view: permisions.view,
      manage: permisions.manage,
      edit: permisions.edit,
    },
  });
};
