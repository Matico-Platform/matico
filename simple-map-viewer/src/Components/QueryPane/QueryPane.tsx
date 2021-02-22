import React, { useState } from 'react'
import AceEditor from 'react-ace'
import brace from 'brace';
import 'brace/mode/sql';
import 'brace/theme/dracula';
import {Styles} from './QueryPaneStyles'
import {Button, ButtonType} from '../Button/Button'

interface QueryPaneProps{
    table: string | null,
    onQuery: (newQuery: any) => void,
}

export const QueryPane: React.FC<QueryPaneProps> = ({ onQuery, table })=>{
    const [query, onChange] = useState<any>(null);
    const defaultQuery = `select * from ${table}`;
    const runQuery= ()=>{
        onQuery(query)
    }
    const clearQuery = () => {
        onQuery(null)
    }

    return(
        <Styles.QueryPane>
                    <AceEditor
                        defaultValue={defaultQuery}
                        mode="postgressql"
                        theme="dracula"
                        onChange={onChange}
                        name="sql"
                        fontSize="25px"
                        style={{width:'100%'}}
                        editorProps={{ $blockScrolling: true }}
                    />
                    <Styles.Buttons>
                        <Button onClick={clearQuery} kind={ButtonType.Secondary}>
                            Clear
                        </Button>
                        <Button onClick={runQuery} kind={ButtonType.Primary}>
                            Run
                        </Button>
                    </Styles.Buttons>
        
        </Styles.QueryPane>
    )
}