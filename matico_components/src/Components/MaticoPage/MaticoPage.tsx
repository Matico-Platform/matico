import React from 'react'
import ReactMarkdown from 'react-markdown'
import ReactDom from 'react-dom'
import {Page} from 'matico_spec'
import {Box} from 'grommet'

interface MaticoPageInterface{
    page:Page
}
export const MaticoPage: React.FC<MaticoPageInterface> = ({page})=>{
  return (
    <Box>
      <ReactMarkdown>
          {page.content}
        </ReactMarkdown>
    </Box>
  )
}
