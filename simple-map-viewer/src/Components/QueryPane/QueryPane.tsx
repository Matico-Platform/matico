import React from 'react'
import AceEditor from 'react-ace'
import brace from 'brace';
import 'brace/mode/sql';
import 'brace/theme/dracula';
import {Styles} from './QueryPaneStyles'
import {Button, ButtonType} from '../Button/Button'

interface QueryPaneProps{

}

export const QueryPane:React.FC<QueryPaneProps>= ({})=>{

    const runQuery= ()=>{

    }
    return(
        <Styles.QueryPane>
                    <AceEditor
                        mode="postgressql"
                        theme="dracula"
                        // onChange={onChange}
                        name="sql"
                        fontSize="25px"
                        style={{width:'100%'}}
                        editorProps={{ $blockScrolling: true }}
                    />
                    <Styles.Buttons>
                        <Button kind={ButtonType.Secondary}>
                            Clear
                        </Button>
                        <Button onClick={runQuery} kind={ButtonType.Primary}>
                            Run
                        </Button>
                    </Styles.Buttons>
        
        </Styles.QueryPane>
    )
}