import useSwr from 'swr'

export interface UseAppsArgs{
  ownerId?: string,
  public?: boolean,
}

export const useApps =(args: UseAppsArgs)=>{
  const {data: apps, error, mutate} =useSwr("/api/apps")
  return {apps, error, mutate}
}
