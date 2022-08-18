import {ActionButton, Content, Dialog, DialogTrigger, Header} from "@adobe/react-spectrum";
import { useSession, signIn, signOut } from "next-auth/react"

export const Login: React.FC = ()=>{
  const {data: session} = useSession();

  return(
    <DialogTrigger type='popover' isDismissable>
      <ActionButton>{session ? session.user?.name : "Login"}</ActionButton>
      <Dialog>
        {session ? 
          <>
            <Header>Hey there {session.user?.name} </Header>
            <Content>
              <ActionButton onPress={()=>signOut()}>Sign Out</ActionButton>
              </Content>
            
          </>
          :
          <>
          <Header>Signin</Header>
          <Content>
            <ActionButton onPress={()=>signIn("github")}>Signin With Github</ActionButton>
            <ActionButton onPress={()=>signIn("google")}>Signin With Google</ActionButton>
            <ActionButton onPress={()=>signIn("gitlab")}>Signin With Gitlab</ActionButton>
            <ActionButton onPress={()=>signIn("facebook")}>Signin With Facebook</ActionButton>
            </Content>
          </>
        }
      </Dialog>
      </DialogTrigger>
  )
}
