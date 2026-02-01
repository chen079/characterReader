import { useState } from 'react';
import { Storyline, LorebookEntry, createDefaultLorebookEntry } from '../types/character';
import AutoResizeTextarea from './AutoResizeTextarea';

interface Props {
  storyline: Storyline;
  onChange: (storyline: Storyline) => void;
}

export default function LorebookEditor({ storyline, onChange }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addEntry = () => {
    const newEntry = createDefaultLorebookEntry();
    newEntry.order = storyline.world_info.length;
    onChange({
      ...storyline,
      world_info: [...storyline.world_info, newEntry]
    });
    setExpandedIndex(storyline.world_info.length);
  };

  const updateEntry = (index: number, entry: LorebookEntry) => {
    const newEntries = [...storyline.world_info];
    newEntries[index] = entry;
    onChange({ ...storyline, world_info: newEntries });
  };

  const deleteEntry = (index: number) => {
    if (!confirm('确定要删除这条世界书条目吗？')) return;
    const newEntries = storyline.world_info.filter((_, i) => i !== index);
    onChange({ ...storyline, world_info: newEntries });
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

  const updateConfig = (field: string, value: any) => {
    onChange({
      ...storyline,
      lorebook_config: {
        ...storyline.lorebook_config,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="card bg-gray-750">
        <h3 className="font-medium mb-3">世界书配置</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">扫描深度</label>
            <input
              type="number"
              value={storyline.lorebook_config.scan_depth}
              onChange={(e) => updateConfig('scan_depth', parseInt(e.target.value))}
              className="input"
              min="1"
              max="10"
            />
          </div>
          <div>
            <label className="label">Token 预算</label>
            <input
              type="number"
              value={storyline.lorebook_config.token_budget}
              onChange={(e) => updateConfig('token_budget', parseInt(e.target.value))}
              className="input"
              min="100"
              max="5000"
            />
          </div>
          <div>
            <label className="label">最大递归深度</label>
            <input
              type="number"
              value={storyline.lorebook_config.max_recursion_depth}
              onChange={(e) => updateConfig('max_recursion_depth', parseInt(e.target.value))}
              className="input"
              min="1"
              max="10"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recursive_scanning"
              checked={storyline.lorebook_config.recursive_scanning}
              onChange={(e) => updateConfig('recursive_scanning', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="recursive_scanning" className="text-sm">
              启用递归扫描
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="font-medium">世界书条目 ({storyline.world_info.length})</h3>
        <button onClick={addEntry} className="btn btn-primary flex items-center gap-2">
          <i className="fas fa-plus"></i>
          <span className="hidden sm:inline">添加条目</span>
        </button>
      </div>

      {storyline.world_info.length === 0 ? (
        <div className="card text-center py-8 text-gray-400">
          <p>还没有世界书条目</p>
        </div>
      ) : (
        <div className="space-y-2">
          {storyline.world_info.map((entry, index) => (
            <div key={index} className="card bg-gray-750">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="text-gray-400 hover:text-white"
                  >
                    <i className={`fas fa-chevron-${expandedIndex === index ? 'up' : 'down'}`}></i>
                  </button>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {entry.keys || '未命名条目'} {!entry.enabled && <span className="text-gray-500">(已禁用)</span>}
                    </p>
                    <p className="text-xs text-gray-400">
                      顺序: {entry.order} • 深度: {entry.depth} • 概率: {entry.probability}%
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteEntry(index)}
                  className="p-2 text-red-400 hover:text-red-300"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>

              {expandedIndex === index && (
                <div className="mt-4 pt-4 border-t border-gray-600 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">触发关键词 *</label>
                      <input
                        type="text"
                        value={entry.keys || ''}
                        onChange={(e) => updateEntry(index, { ...entry, keys: e.target.value })}
                        className="input"
                        placeholder="用逗号分隔多个关键词"
                      />
                    </div>
                    <div>
                      <label className="label">次要关键词</label>
                      <input
                        type="text"
                        value={entry.secondary_keys || ''}
                        onChange={(e) => updateEntry(index, { ...entry, secondary_keys: e.target.value })}
                        className="input"
                        placeholder="用逗号分隔"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">内容 *</label>
                    <AutoResizeTextarea
                      value={entry.content}
                      onChange={(e) => updateEntry(index, { ...entry, content: e.target.value })}
                      placeholder="当关键词被触发时插入的内容..."
                      minRows={3}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="label">位置</label>
                      <select
                        value={entry.position || 'after_char'}
                        onChange={(e) => updateEntry(index, { ...entry, position: e.target.value })}
                        className="input"
                      >
                        <option value="before_char">角色前</option>
                        <option value="after_char">角色后</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">顺序</label>
                      <input
                        type="number"
                        value={entry.order}
                        onChange={(e) => updateEntry(index, { ...entry, order: parseInt(e.target.value) })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">深度</label>
                      <input
                        type="number"
                        value={entry.depth}
                        onChange={(e) => updateEntry(index, { ...entry, depth: parseInt(e.target.value) })}
                        className="input"
                        min="0"
                        max="10"
                      />
                    </div>
                    <div>
                      <label className="label">概率 (%)</label>
                      <input
                        type="number"
                        value={entry.probability}
                        onChange={(e) => updateEntry(index, { ...entry, probability: parseInt(e.target.value) })}
                        className="input"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="label">分组</label>
                      <input
                        type="text"
                        value={entry.group || ''}
                        onChange={(e) => updateEntry(index, { ...entry, group: e.target.value })}
                        className="input"
                        placeholder="分组名称"
                      />
                    </div>
                    <div>
                      <label className="label">分组权重</label>
                      <input
                        type="number"
                        value={entry.group_weight}
                        onChange={(e) => updateEntry(index, { ...entry, group_weight: parseInt(e.target.value) })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">选择逻辑</label>
                      <select
                        value={entry.selective_logic}
                        onChange={(e) => updateEntry(index, { ...entry, selective_logic: parseInt(e.target.value) })}
                        className="input"
                      >
                        <option value="0">AND_ANY</option>
                        <option value="1">NOT_ALL</option>
                        <option value="2">NOT_ANY</option>
                        <option value="3">AND_ALL</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={entry.enabled}
                        onChange={(e) => updateEntry(index, { ...entry, enabled: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">启用</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={entry.constant}
                        onChange={(e) => updateEntry(index, { ...entry, constant: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">常驻</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={entry.case_sensitive}
                        onChange={(e) => updateEntry(index, { ...entry, case_sensitive: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">区分大小写</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={entry.match_whole_words}
                        onChange={(e) => updateEntry(index, { ...entry, match_whole_words: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">全词匹配</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={entry.use_regex}
                        onChange={(e) => updateEntry(index, { ...entry, use_regex: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">使用正则</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
