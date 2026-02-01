import { useState } from 'react';
import { Character, Storyline } from '../types/character';
import CharacterBasicInfo from './CharacterBasicInfo';
import StorylineList from './StorylineList';
import StorylineEditor from './StorylineEditor';

interface Props {
  character: Character;
  onChange: (character: Character) => void;
}

export default function CharacterEditor({ character, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<'basic' | 'storylines'>('basic');
  const [editingStorylineIndex, setEditingStorylineIndex] = useState<number | null>(null);

  const updateStoryline = (index: number, storyline: Storyline) => {
    const newStorylines = [...character.storylines];
    newStorylines[index] = storyline;
    onChange({ ...character, storylines: newStorylines });
  };

  if (editingStorylineIndex !== null) {
    const storyline = character.storylines[editingStorylineIndex];
    if (!storyline) {
      setEditingStorylineIndex(null);
      return null;
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
          <button
            onClick={() => setEditingStorylineIndex(null)}
            className="btn btn-secondary flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i>
            <span className="hidden sm:inline">返回故事线列表</span>
          </button>
          <div className="h-6 w-px bg-slate-700"></div>
          <h2 className="text-xl font-semibold text-blue-400">
            正在编辑: {storyline.name || '未命名故事线'}
          </h2>
        </div>

        <StorylineEditor
          storyline={storyline}
          onChange={(updated) => updateStoryline(editingStorylineIndex, updated)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-3 sm:px-6 py-3 font-medium transition-colors ${
            activeTab === 'basic'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          基本信息
        </button>
        <button
          onClick={() => setActiveTab('storylines')}
          className={`px-3 sm:px-6 py-3 font-medium transition-colors ${
            activeTab === 'storylines'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          故事线 ({character.storylines.length})
        </button>
      </div>

      {activeTab === 'basic' && (
        <CharacterBasicInfo character={character} onChange={onChange} />
      )}

      {activeTab === 'storylines' && (
        <StorylineList 
          character={character} 
          onChange={onChange}
          onEdit={(index) => setEditingStorylineIndex(index)}
        />
      )}
    </div>
  );
}
