import React, { useState } from 'react';
import Setting from './features/setting/setting';
import StoryAssistant from './ai/assistant/StoryAssistant';

interface Story {
  title: string;
  content: string;
}

const storyTemplates = [
  'Once upon a time, there was a remarkable {object} that changed the world.',
  'In a small village, a {object} was the key to everyone’s happiness.',
  'Every {object} has a secret, but this one was truly special.',
  'Long ago, a {object} started an adventure that no one would forget.'
];

function generateStory(objectName: string): Story {
  const template = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
  return {
    title: `The Tale of the ${objectName}`,
    content: template.replace('{object}', objectName)
  };
}

const Game: React.FC = () => {
  const [objectName, setObjectName] = useState('');
  const [story, setStory] = useState<Story | null>(null);
  const [storybook, setStorybook] = useState<Story[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const handleScan = () => {
    if (objectName.trim()) {
      setStory(generateStory(objectName.trim()));
    }
  };

  const handleSave = () => {
    if (story) {
      setStorybook([...storybook, story]);
      setStory(null);
      setObjectName('');
    }
  };

  return (
    <div className="game-container">
      <h1>Scan & Tell</h1>
      <button onClick={() => setShowSettings(!showSettings)} style={{ float: 'right' }}>
        Settings
      </button>
      {showSettings && (
        <Setting />
      )}
      <div className="scan-section">
        <input
          type="text"
          value={objectName}
          onChange={e => setObjectName(e.target.value)}
          placeholder="Type an object name..."
        />
        <button onClick={handleScan}>Scan</button>
        <StoryAssistant input={objectName} / >
      </div>
      {story && (
        <div className="story-card">
          <h2>{story.title}</h2>
          <p>{story.content}</p>
          <button onClick={handleSave}>Save to Storybook</button>
        </div>
      )}
      {storybook.length > 0 && (
        <div className="storybook">
          <h3>Storybook</h3>
          <ul>
            {storybook.map((s, idx) => (
              <li key={idx}>
                <strong>{s.title}:</strong> {s.content}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Game;
