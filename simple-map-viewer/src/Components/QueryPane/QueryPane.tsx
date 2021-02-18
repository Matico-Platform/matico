import React, { useState } from 'react'
import AceEditor from 'react-ace'
import brace from 'brace';
import 'brace/mode/sql';
import 'brace/theme/dracula';
import {Styles} from './QueryPaneStyles'
import {Button, ButtonType} from '../Button/Button'

interface QueryPaneProps{
    query: string | null,
    onQuery: (newQuery: any) => void,
}

export const QueryPane: React.FC<QueryPaneProps> = ({ onQuery })=>{
    const [query, onChange] = useState<any>(null);
    const runQuery= ()=>{
        onQuery(query)
    }

    return(
        <Styles.QueryPane>
                    <AceEditor
                        mode="postgressql"
                        theme="dracula"
                        onChange={onChange}
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