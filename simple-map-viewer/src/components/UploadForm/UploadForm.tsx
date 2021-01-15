import React, {useState,useEffect} from 'react'


type Props ={

}

export const UploadForm : React.FC<Props> = ({}:Props)=>{
    return(
        <div className='upload-form'>
            <form target="http://localhost:8080/upload" method="post" encType="multipart/form-data">
            <input type="file" multiple name="file" />
            <button type="submit">Submit</button>
            </form>
        </div>
    )
}