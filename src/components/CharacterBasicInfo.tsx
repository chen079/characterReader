import { Character } from '../types/character';
import AutoResizeTextarea from './AutoResizeTextarea';

interface Props {
  character: Character;
  onChange: (character: Character) => void;
}

export default function CharacterBasicInfo({ character, onChange }: Props) {
  const updateField = (field: keyof Character, value: any) => {
    onChange({ ...character, [field]: value });
  };

  return (
    <div className="card space-y-6">
      <h2 className="text-xl font-semibold mb-4">角色基本信息</h2>

      <div>
        <label className="label">角色名称 *</label>
        <input
          type="text"
          value={character.name || ''}
          onChange={(e) => updateField('name', e.target.value)}
          className="input"
          placeholder="输入角色名称"
        />
      </div>

      <div>
        <label className="label">角色描述</label>
        <AutoResizeTextarea
          value={character.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="简短描述这个角色..."
          minRows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">头像 URL</label>
          <input
            type="text"
            value={character.avatar || ''}
            onChange={(e) => updateField('avatar', e.target.value)}
            className="input"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="label">横幅 URL</label>
          <input
            type="text"
            value={character.banner || ''}
            onChange={(e) => updateField('banner', e.target.value)}
            className="input"
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="label">标签</label>
        <input
          type="text"
          value={character.tags || ''}
          onChange={(e) => updateField('tags', e.target.value)}
          className="input"
          placeholder="用逗号分隔，例如: 幻想,冒险,魔法"
        />
        <p className="text-sm text-gray-400 mt-1">用逗号分隔多个标签</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">目标取向</label>
          <select
            value={character.target_orientation || 'both'}
            onChange={(e) => updateField('target_orientation', e.target.value)}
            className="input"
          >
            <option value="both">全部</option>
            <option value="male">男性</option>
            <option value="female">女性</option>
          </select>
        </div>

        <div>
          <label className="label">目标性别</label>
          <select
            value={character.target_gender || 'both'}
            onChange={(e) => updateField('target_gender', e.target.value)}
            className="input"
          >
            <option value="both">全部</option>
            <option value="male">男性</option>
            <option value="female">女性</option>
          </select>
        </div>

        <div>
          <label className="label">种族</label>
          <input
            type="text"
            value={character.species || ''}
            onChange={(e) => updateField('species', e.target.value)}
            className="input"
            placeholder="例如: human, elf, dragon"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_public"
          checked={character.is_public}
          onChange={(e) => updateField('is_public', e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="is_public" className="text-sm">
          公开角色（允许其他人查看）
        </label>
      </div>
    </div>
  );
}
