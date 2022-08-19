import {Flex,Text, View} from "@adobe/react-spectrum"
import {Login} from "../Login/Login"
export const Header: React.FC= ()=>{
  
  return (
    <Flex  direction='row' alignItems='center' justifyContent='space-between'  width="100%" gridArea={'header'} >
        <Flex direction='row'>
          <View paddingX="size-200" justifySelf='flex-start'>
            <Text>Matico</Text>
          </View>
        </Flex>
        <Flex direction='row' >
          <View justifySelf="flex-end" paddingX="size-200">
            <Login />
          </View>
      </Flex>
    </Flex>
  )
}
