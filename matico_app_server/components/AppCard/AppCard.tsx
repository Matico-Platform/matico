import Link from 'next/link'

export interface AppCardInterface{
  app:any 
}

export const AppCard : React.FC<AppCardInterface>=({app})=>{
  return(
    <section>
      <h2>{app.name}</h2>
      <p>{app.owner.name} </p>
      <p>{app.updatedAt}</p>
      <Link href={`/apps/${app.id}`}> 
        <a>View</a> 
      </Link>
    </section>
  )
}
