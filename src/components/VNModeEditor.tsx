import { Storyline } from '../types/character';
import AutoResizeTextarea from './AutoResizeTextarea';

interface Props {
  storyline: Storyline;
  onChange: (storyline: Storyline) => void;
}

export default function VNModeEditor({ storyline, onChange }: Props) {
  const updateVNAssets = (field: string, value: any) => {
    onChange({
      ...storyline,
      vn_assets: {
        ...storyline.vn_assets,
        [field]: value
      }
    });
  };

  const addBackground = () => {
    const backgrounds = storyline.vn_assets.backgrounds || [];
    backgrounds.push({ tag: '', url: '' });
    updateVNAssets('backgrounds', backgrounds);
  };

  const updateBackground = (index: number, field: string, value: string) => {
    const backgrounds = [...(storyline.vn_assets.backgrounds || [])];
    backgrounds[index] = { ...backgrounds[index], [field]: value };
    updateVNAssets('backgrounds', backgrounds);
  };

  const deleteBackground = (index: number) => {
    const backgrounds = (storyline.vn_assets.backgrounds || []).filter((_: any, i: number) => i !== index);
    updateVNAssets('backgrounds', backgrounds);
  };

  const addCharacterSprite = () => {
    const sprites = storyline.vn_assets.character_sprites || [];
    sprites.push({ tag: '', url: '' });
    updateVNAssets('character_sprites', sprites);
  };

  const updateCharacterSprite = (index: number, field: string, value: string) => {
    const sprites = [...(storyline.vn_assets.character_sprites || [])];
    sprites[index] = { ...sprites[index], [field]: value };
    updateVNAssets('character_sprites', sprites);
  };

  const deleteCharacterSprite = (index: number) => {
    const sprites = (storyline.vn_assets.character_sprites || []).filter((_: any, i: number) => i !== index);
    updateVNAssets('character_sprites', sprites);
  };

  const addBGM = () => {
    const bgmList = [...storyline.bgm_list];
    bgmList.push('');
    onChange({ ...storyline, bgm_list: bgmList });
  };

  const updateBGM = (index: number, value: string) => {
    const bgmList = [...storyline.bgm_list];
    bgmList[index] = value;
    onChange({ ...storyline, bgm_list: bgmList });
  };

  const deleteBGM = (index: number) => {
    const bgmList = storyline.bgm_list.filter((_, i) => i !== index);
    onChange({ ...storyline, bgm_list: bgmList });
  };

  return (
    <div className="space-y-6">
      <div className="card bg-blue-900/20 border-blue-700/50">
        <div className="flex items-center gap-2 mb-3">
          <i className="fas fa-info-circle text-blue-400"></i>
          <h3 className="font-medium text-blue-300">视觉小说模式说明</h3>
        </div>
        <p className="text-sm text-slate-400">
          VN 模式允许 AI 在对话中使用特殊标记来控制背景、立绘、音乐等视觉元素。
          配置好资源后，AI 可以在回复中使用如 <code className="bg-slate-800 px-1 rounded">[bg:tag]</code>、
          <code className="bg-slate-800 px-1 rounded">[sprite:tag]</code> 等标记。
        </p>
      </div>

      {/* 背景列表 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium flex items-center gap-2">
            <i className="fas fa-image text-purple-400"></i>
            背景图片 ({(storyline.vn_assets.backgrounds || []).length})
          </h3>
          <button onClick={addBackground} className="btn btn-primary btn-sm flex items-center gap-2">
            <i className="fas fa-plus"></i>
            <span className="hidden sm:inline">添加背景</span>
          </button>
        </div>

        {(storyline.vn_assets.backgrounds || []).length === 0 ? (
          <div className="card text-center py-6 text-slate-400">
            <i className="fas fa-image text-3xl mb-2"></i>
            <p className="text-sm">还没有背景图片</p>
          </div>
        ) : (
          <div className="space-y-2">
            {(storyline.vn_assets.backgrounds || []).map((bg: any, index: number) => (
              <div key={index} className="card bg-slate-750">
                <div className="flex items-center gap-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="label text-xs">标签 (tag)</label>
                      <input
                        type="text"
                        value={bg.tag || ''}
                        onChange={(e) => updateBackground(index, 'tag', e.target.value)}
                        className="input"
                        placeholder="例如: classroom, park"
                      />
                    </div>
                    <div>
                      <label className="label text-xs">图片 URL</label>
                      <input
                        type="text"
                        value={bg.url || ''}
                        onChange={(e) => updateBackground(index, 'url', e.target.value)}
                        className="input"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => deleteBackground(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded mt-5"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 角色立绘列表 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium flex items-center gap-2">
            <i className="fas fa-user-circle text-green-400"></i>
            角色立绘 ({(storyline.vn_assets.character_sprites || []).length})
          </h3>
          <button onClick={addCharacterSprite} className="btn btn-primary btn-sm flex items-center gap-2">
            <i className="fas fa-plus"></i>
            <span className="hidden sm:inline">添加立绘</span>
          </button>
        </div>

        {(storyline.vn_assets.character_sprites || []).length === 0 ? (
          <div className="card text-center py-6 text-slate-400">
            <i className="fas fa-user-circle text-3xl mb-2"></i>
            <p className="text-sm">还没有角色立绘</p>
          </div>
        ) : (
          <div className="space-y-2">
            {(storyline.vn_assets.character_sprites || []).map((sprite: any, index: number) => (
              <div key={index} className="card bg-slate-750">
                <div className="flex items-center gap-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="label text-xs">标签 (tag)</label>
                      <input
                        type="text"
                        value={sprite.tag || ''}
                        onChange={(e) => updateCharacterSprite(index, 'tag', e.target.value)}
                        className="input"
                        placeholder="例如: happy, sad, angry"
                      />
                    </div>
                    <div>
                      <label className="label text-xs">图片 URL</label>
                      <input
                        type="text"
                        value={sprite.url || ''}
                        onChange={(e) => updateCharacterSprite(index, 'url', e.target.value)}
                        className="input"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => deleteCharacterSprite(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded mt-5"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BGM 列表 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium flex items-center gap-2">
            <i className="fas fa-music text-pink-400"></i>
            背景音乐 ({storyline.bgm_list.length})
          </h3>
          <button onClick={addBGM} className="btn btn-primary btn-sm flex items-center gap-2">
            <i className="fas fa-plus"></i>
            <span className="hidden sm:inline">添加音乐</span>
          </button>
        </div>

        {storyline.bgm_list.length === 0 ? (
          <div className="card text-center py-6 text-slate-400">
            <i className="fas fa-music text-3xl mb-2"></i>
            <p className="text-sm">还没有背景音乐</p>
          </div>
        ) : (
          <div className="space-y-2">
            {storyline.bgm_list.map((bgm: string, index: number) => (
              <div key={index} className="card bg-slate-750">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="label text-xs">音乐 URL</label>
                    <input
                      type="text"
                      value={bgm}
                      onChange={(e) => updateBGM(index, e.target.value)}
                      className="input"
                      placeholder="https://..."
                    />
                  </div>
                  <button
                    onClick={() => deleteBGM(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded mt-5"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VN 设置 */}
      <div className="card bg-slate-750">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <i className="fas fa-cog text-yellow-400"></i>
          VN 模式设置
        </h3>
        <div className="space-y-3">
          <div>
            <label className="label text-xs">自定义设置 (JSON)</label>
            <AutoResizeTextarea
              value={JSON.stringify(storyline.vn_settings, null, 2)}
              onChange={(e) => {
                try {
                  const settings = JSON.parse(e.target.value);
                  onChange({ ...storyline, vn_settings: settings });
                } catch {
                  // 忽略无效的 JSON
                }
              }}
              placeholder='{"key": "value"}'
              minRows={3}
              className="font-mono text-sm"
            />
            <p className="text-xs text-slate-500 mt-1">
              可以添加自定义的 VN 模式配置（JSON 格式）
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
