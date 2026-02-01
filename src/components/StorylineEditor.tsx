import { useState } from 'react';
import { Storyline } from '../types/character';
import LorebookEditor from './LorebookEditor';
import RegexScriptEditor from './RegexScriptEditor';
import QuickReplyEditor from './QuickReplyEditor';
import VNModeEditor from './VNModeEditor';
import AutoResizeTextarea from './AutoResizeTextarea';

interface Props {
  storyline: Storyline;
  onChange: (storyline: Storyline) => void;
}

export default function StorylineEditor({ storyline, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<'basic' | 'lorebook' | 'regex' | 'quick' | 'vn'>('basic');

  const updateField = (field: keyof Storyline, value: any) => {
    onChange({ ...storyline, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-600 overflow-x-auto">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            activeTab === 'basic'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          基本设置
        </button>
        <button
          onClick={() => setActiveTab('lorebook')}
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            activeTab === 'lorebook'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          世界书 ({storyline.world_info.length})
        </button>
        <button
          onClick={() => setActiveTab('regex')}
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            activeTab === 'regex'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          正则脚本 ({storyline.regex_scripts.length})
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            activeTab === 'quick'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          快捷回复 ({storyline.quick_replies.length})
        </button>
        <button
          onClick={() => setActiveTab('vn')}
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            activeTab === 'vn'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <i className="fas fa-film mr-1"></i>
          VN 模式 {storyline.vn_mode_enabled && <i className="fas fa-check-circle text-green-400 ml-1"></i>}
        </button>
      </div>

      {activeTab === 'basic' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">故事线名称 *</label>
              <input
                type="text"
                value={storyline.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                className="input"
                placeholder="输入故事线名称"
              />
            </div>

            <div>
              <label className="label">分类</label>
              <input
                type="text"
                value={storyline.category || ''}
                onChange={(e) => updateField('category', e.target.value)}
                className="input"
                placeholder="例如: 日常, 冒险, 战斗"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">头像 URL</label>
              <input
                type="text"
                value={storyline.avatar || ''}
                onChange={(e) => updateField('avatar', e.target.value)}
                className="input"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="label">封面图 URL</label>
              <input
                type="text"
                value={storyline.cover_image || ''}
                onChange={(e) => updateField('cover_image', e.target.value)}
                className="input"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="label">立绘 URL</label>
              <input
                type="text"
                value={storyline.portrait || ''}
                onChange={(e) => updateField('portrait', e.target.value)}
                className="input"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="label">人格设定 *</label>
            <AutoResizeTextarea
              value={storyline.personality}
              onChange={(e) => updateField('personality', e.target.value)}
              placeholder="描述角色的性格、特点、背景等..."
              minRows={4}
            />
          </div>

          <div>
            <label className="label">场景设定</label>
            <AutoResizeTextarea
              value={storyline.scenario}
              onChange={(e) => updateField('scenario', e.target.value)}
              placeholder="描述故事发生的场景、背景..."
              minRows={3}
            />
          </div>

          <div>
            <label className="label">世界观</label>
            <AutoResizeTextarea
              value={storyline.world_view}
              onChange={(e) => updateField('world_view', e.target.value)}
              placeholder="描述世界观设定..."
              minRows={3}
            />
          </div>

          <div>
            <label className="label">开场白 *</label>
            <AutoResizeTextarea
              value={storyline.first_mes}
              onChange={(e) => updateField('first_mes', e.target.value)}
              placeholder="角色的第一句话..."
              minRows={3}
            />
          </div>

          <div>
            <label className="label">对话示例</label>
            <AutoResizeTextarea
              value={storyline.mes_example}
              onChange={(e) => updateField('mes_example', e.target.value)}
              placeholder="提供一些对话示例，帮助AI理解角色的说话风格..."
              minRows={4}
            />
          </div>

          <div>
            <label className="label">系统提示词</label>
            <AutoResizeTextarea
              value={storyline.system_prompt}
              onChange={(e) => updateField('system_prompt', e.target.value)}
              placeholder="给AI的系统级指令..."
              minRows={3}
            />
          </div>

          <div>
            <label className="label">历史后指令</label>
            <AutoResizeTextarea
              value={storyline.post_history_instructions}
              onChange={(e) => updateField('post_history_instructions', e.target.value)}
              placeholder="在对话历史后添加的指令..."
              minRows={2}
            />
          </div>

          <div>
            <label className="label">响应格式</label>
            <AutoResizeTextarea
              value={storyline.response_format}
              onChange={(e) => updateField('response_format', e.target.value)}
              placeholder="指定AI响应的格式..."
              minRows={2}
            />
          </div>

          <div>
            <label className="label">创作者备注</label>
            <AutoResizeTextarea
              value={storyline.creator_notes}
              onChange={(e) => updateField('creator_notes', e.target.value)}
              placeholder="给其他创作者的备注..."
              minRows={2}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_published"
              checked={storyline.is_published}
              onChange={(e) => updateField('is_published', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="is_published" className="text-sm">
              公开发布此故事线
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="vn_mode_enabled"
              checked={storyline.vn_mode_enabled}
              onChange={(e) => updateField('vn_mode_enabled', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="vn_mode_enabled" className="text-sm">
              启用视觉小说模式
            </label>
          </div>
        </div>
      )}

      {activeTab === 'lorebook' && (
        <LorebookEditor storyline={storyline} onChange={onChange} />
      )}

      {activeTab === 'regex' && (
        <RegexScriptEditor storyline={storyline} onChange={onChange} />
      )}

      {activeTab === 'quick' && (
        <QuickReplyEditor storyline={storyline} onChange={onChange} />
      )}

      {activeTab === 'vn' && (
        <VNModeEditor storyline={storyline} onChange={onChange} />
      )}
    </div>
  );
}
