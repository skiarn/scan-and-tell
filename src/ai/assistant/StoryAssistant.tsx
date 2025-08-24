import React, { use, useState } from 'react';
import OpenAI from 'openai';
import { useOpenAIKey } from '../../shared/context/OpenAIKeyContext';

const openai = new OpenAI();

type StoryAssistantProps = {
  input: string;
};

const StoryAssistant: React.FC<StoryAssistantProps> = ({ input }) => {
  const [storyInput, setStoryInput] = useState(input);
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);

  const apiKey = useOpenAIKey()

  const handleGenerateStory = async () => {
    setLoading(true);
    setStory('');

    try {
      const assistant = await openai.beta.assistants.create({
        model: 'gpt-4o',
        name: 'Story Builder',
        instructions: 'You are a creative writing assistant. Help users turn ideas into compelling stories.',
      });

      const assistantId = assistant.id;

      // Create thread with user input
      const thread = await openai.beta.threads.create({
        messages: [
          {
            role: 'user',
            content: `I want to write a story about: "${input}". Can you help me build it?`,
          },
        ],
      });

      const threadId = thread.id;

      // Run and poll for completion
      const run = await openai.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: assistantId,
        additional_instructions: 'Be imaginative, descriptive, and supportive. Offer suggestions if needed.',
      });

      if (run.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(threadId);
        const lastMessage = messages.getPaginatedItems().pop();
        if (lastMessage?.content?.[0]?.type === 'text') {
          setStory(lastMessage.content[0].text.value);
        } else {
          setStory('No story content received.');
        }
      } else {
        setStory('The assistant did not complete successfully.');
      }
    } catch (error) {
      console.error('Error generating story:', error);
      setStory('Something went wrong while generating the story.');
    }

    setLoading(false);
  };

  if (!apiKey) {
    return (
        <div className="story-assistant">
          <h2>AI Story Assistant</h2>
          <p>Please set your OpenAI API key in settings to use the story assistant.</p>
        </div>
    );
  }
  return (

    <div className="story-assistant">
      <h2>AI Story Assistant</h2>
      <textarea
        value={input}
        onChange={e => setStoryInput(e.target.value)}
        placeholder="Describe your story idea..."
        rows={4}
        style={{ width: '100%' }}
      />
      <button onClick={handleGenerateStory} disabled={loading || !input}>
        {loading ? 'Generating...' : 'Build My Story'}
      </button>

      {story && (
        <div className="story-output" style={{ marginTop: '1rem' }}>
          <h3>Your Story</h3>
          <p>{story}</p>
        </div>
      )}
    </div>
  );
};

export default StoryAssistant;
