export const test ='test'
// import {useEffect, useState } from 'react'

// export const useSpec =()=>{
//     const [spec,setSpec] = useState<any>(null)
//     const [ready,setReady] = useState<boolean>(false)

//   useEffect(() => {
//     let f = async () => {
//       try {
//         const wasm = await import("matico_spec");
//         setSpec(wasm)
//         setReady(true)
//       } catch (err) {
//         console.log("unexpected error in load wasm ", err);
//       }
//     };
//     f();
//   }, []);
//   return [spec,ready]
// }
