import React, {useState} from 'react'
interface ColorSpecification{
    test:string
}

interface ColorSelectorProps{
    onChange:(specification : ColorSpecification)=>void,
    colorSecification : ColorSpecification
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({onChange, colorSecification})=>{
    const [showEditor, setShowEditor] = useState(false)
    // switch(colorSecification.type){
    //     case "SingleColor":
    //         return(
    //             <SingleColorSummary colorSpecification={colorSecification} onShow={()=> setShowEditor(!showEditor)}/>
    //             <SingleColorEditor onChange={onChange} colorSpecification={colorSpecification}>
    //         )
    // }
    return(
        <div>

        </div>
    )
}