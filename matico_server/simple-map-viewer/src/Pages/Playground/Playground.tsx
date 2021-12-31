import React, { useEffect, useState } from 'react';
import { Styles } from './PlaygroundStyles';
import AceEditor from 'react-ace';
import brace from 'brace';
import 'brace/mode/json';
import 'brace/theme/dracula';
import { DashboardViewer } from 'Components/DashboardViewer/DashboardViewer';
import { Dashboard, BaseMap } from 'types';
import { Button } from 'Components/Button/Button';

const defaultDash: Dashboard = {
    name: 'Tmp',
    description: 'A teomporarry dashbaord',
    id: '2435242342342',
    owner_id: 'annon',
    public: true,
    map_style: {
        layers: [],
        center: [0, 0],
        zoom: 1,
        base_map: BaseMap.Dark,
    },
    created_at: new Date(),
    updated_at: new Date(),
};
export const Playground: React.FC = () => {
    const [code, setCode] = useState<string>(
        JSON.stringify(defaultDash, null, 2),
    );

    const [, setError] = useState<string | null>(null);

    const [spec, setSpec] = useState<Dashboard>(defaultDash);

    useEffect(() => {
        const saved = localStorage.getItem('playground');
        if (saved) {
            try {
                setSpec(JSON.parse(saved));
                setCode(saved);
            } catch {
                console.log('bad saved state');
            } finally {
                console.log('loaded state');
            }
        }
    }, []);
    const update = () => {
        try {
            setSpec(JSON.parse(code));
            localStorage.setItem('playground', code);
            setError(null);
        } catch {
            setError('Could not parse');
        }
    };

    return (
        <Styles.Playground>
        <Styles.Code>
                <AceEditor
                    value={code}
                    theme="dracula"
                    name="json"
                    fontSize="25px"
                    style={{
                        width: '100%',
                        flex: 1,
                        maxHeight: '95vh',
                    }}
                    onChange={setCode}
                    keyboardHandler="ace/keyboard/vim"
                ></AceEditor>
                <Styles.Buttons>
                    <Button onClick={update}>Submit</Button>
                </Styles.Buttons>
            </Styles.Code>
            <Styles.Map>
                <DashboardViewer dashboard={spec} />
            </Styles.Map>
        </Styles.Playground>
    );
};
