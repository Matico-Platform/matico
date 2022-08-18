import {Flex,Text, View} from "@adobe/react-spectrum"
import {Login} from "../Login/Login"
export const Header: React.FC= ()=>{
  
  return (
    <Flex  direction='row' alignItems='center' justifyContent='space-between'  width="100%" gridArea={'header'} >
        <Text>Matico</Text>
        <View justifySelf="flex-end">
          <Login />
        </View>
    </Flex>
  )
}
