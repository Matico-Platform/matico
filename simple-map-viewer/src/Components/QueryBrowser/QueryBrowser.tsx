import React from 'react';
import { Styles } from './QueryBrowserStyles';
import { Query } from 'types';
import { useQueries } from 'Hooks/useQueries';

interface QueryBrowserProps {
    selectedQuery: Query | null;
    onSelectQuery: (query: Query) => void;
}

export const QueryBrowser: React.FC<QueryBrowserProps> = ({
    selectedQuery,
    onSelectQuery,
}) => {
    const { queries, loading, error } = useQueries();
    if (loading) return <h2>Loading</h2>;
    if (error) return <h2>Error: {error}</h2>;

    return (
        <Styles.QueryBrowser>
            <Styles.QueryList>
                {queries?.map((query) => (
                    <Styles.Query>{query.name}</Styles.Query>
                ))}
            </Styles.QueryList>
        </Styles.QueryBrowser>
    );
};
