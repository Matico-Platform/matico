import React, { useState } from 'react';
import AceEditor from 'react-ace';
import brace from 'brace';
import 'brace/mode/sql';
import 'brace/theme/dracula';
import { Styles } from './QueryPaneStyles';
import { Button, ButtonType } from '../Button/Button';
import { QueryBrowser } from 'Components/QueryBrowser/QueryBrowser';
import { Query } from 'types';

interface QueryPaneProps {
    table: string | null;
    onQuery: (newQuery: any) => void;
    error?: string | null | undefined;
}

export const QueryPane: React.FC<QueryPaneProps> = ({
    onQuery,
    table,
    error,
}) => {
    const [query, onChange] = useState<any>(null);
    const [selectedQuery, onSelectedQueryChange] =
        useState<Query | null>(null);
    const defaultQuery = `select * from ${table}`;
    const runQuery = () => {
        onQuery(query);
    };
    const clearQuery = () => {
        onQuery(null);
    };

    return (
        <Styles.QueryPane>
            <QueryBrowser
                selectedQuery={selectedQuery}
                onSelectQuery={onSelectedQueryChange}
            />

            <AceEditor
                defaultValue={defaultQuery}
                mode="postgressql"
                theme="dracula"
                onChange={onChange}
                name="sql"
                fontSize="25px"
                style={{ width: '100%', flex: 1 }}
                editorProps={{ $blockScrolling: true }}
            />
            <Styles.ButtonsAndErrors>
                <Styles.Error>{error ? error : ''}</Styles.Error>
                <Styles.Buttons>
                    <Button
                        onClick={clearQuery}
                        kind={ButtonType.Secondary}
                    >
                        Clear
                    </Button>
                    <Button
                        onClick={runQuery}
                        kind={ButtonType.Primary}
                    >
                        Run
                    </Button>
                </Styles.Buttons>
            </Styles.ButtonsAndErrors>
        </Styles.QueryPane>
    );
};
