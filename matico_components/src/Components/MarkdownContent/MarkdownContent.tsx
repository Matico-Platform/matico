import React from 'react'
import ReactMarkdown from 'react-markdown'
import {Box} from 'grommet'

interface MarkdownContentInferface{}
export const MarkdownContnet: React.FC<MarkdownContentInferface> = ({children})=>{
  // TODO this is dumb. should be an easier way of only selecting string children 
  return (
    <Box>
      <ReactMarkdown>
        {typeof(children) === typeof('string') ? children as string : ''}
      </ReactMarkdown>
    </Box>
  )
}
