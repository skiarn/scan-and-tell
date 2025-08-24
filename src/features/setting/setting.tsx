import React, { useState } from 'react';
import { useOpenAIKey } from '../../shared/context/OpenAIKeyContext';


const Setting: React.FC = () => {
    const { openaiKey, setOpenaiKey } = useOpenAIKey();

    return (
        (
            <div className="settings">
                <label>OpenAI API Key: </label>
                <input
                    type="password"
                    value={openaiKey}
                    onChange={e => setOpenaiKey(e.target.value)}
                    placeholder="Enter your OpenAI key"
                />
            </div>
        )
    );
}

export default Setting;