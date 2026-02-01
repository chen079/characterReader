import { Character, createDefaultStoryline } from '../types/character';
import { exportStorylinePreset } from '../utils/fileHandler';

interface Props {
  character: Character;
  onChange: (character: Character) => void;
  onEdit: (index: number) => void;
}

export default function StorylineList({ character, onChange, onEdit }: Props) {
  const addStoryline = () => {
    const newStoryline = createDefaultStoryline();
    newStoryline.name = `故事线 ${character.storylines.length + 1}`;
    newStoryline.sort_order = character.storylines.length;
    onChange({
      ...character,
      storylines: [...character.storylines, newStoryline]
    });
    // Automatically enter edit mode for new storyline
    onEdit(character.storylines.length);
  };

  const deleteStoryline = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('确定要删除这条故事线吗？')) return;
    const newStorylines = character.storylines.filter((_, i) => i !== index);
    onChange({ ...character, storylines: newStorylines });
  };

  const duplicateStoryline = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const original = character.storylines[index];
    const duplicate = JSON.parse(JSON.stringify(original));
    duplicate.name = `${original.name} (副本)`;
    duplicate.sort_order = character.storylines.length;
    delete duplicate.id;
    delete duplicate.display_id;
    onChange({
      ...character,
      storylines: [...character.storylines, duplicate]
    });
  };

  const moveStoryline = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= character.storylines.length) return;

    const newStorylines = [...character.storylines];
    [newStorylines[index], newStorylines[newIndex]] = [newStorylines[newIndex], newStorylines[index]];

    // 更新 sort_order
    newStorylines.forEach((s, i) => {
      s.sort_order = i;
    });

    onChange({ ...character, storylines: newStorylines });
  };

  const handleExport = (storyline: any, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    exportStorylinePreset(storyline, name);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">故事线列表</h2>
        <button onClick={addStoryline} className="btn btn-primary flex items-center gap-2">
          <i className="fas fa-plus"></i>
          <span className="hidden sm:inline">添加故事线</span>
        </button>
      </div>

      {character.storylines.length === 0 ? (
        <div className="card text-center py-8 text-gray-400">
          <p>还没有故事线，点击上方按钮添加第一条故事线</p>
        </div>
      ) : (
        <div className="space-y-3">
          {character.storylines.map((storyline, index) => (
            <div 
              key={index} 
              className="card hover:shadow-2xl transition-all cursor-pointer hover:border-blue-500/50 group p-4 sm:p-6"
              onClick={() => onEdit(index)}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* 顶部/左侧：序号和基本信息 */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="flex-shrink-0 w-6 text-center text-slate-500 font-mono text-sm">
                    {index + 1}
                  </div>

                  {/* 移动端显示的图片组 */}
                  <div className="flex gap-2 sm:hidden flex-shrink-0">
                    {storyline.avatar ? (
                      <img src={storyline.avatar} className="w-10 h-10 rounded object-cover border border-slate-700" alt="" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-slate-700/50 flex items-center justify-center border border-slate-700">
                        <i className="fas fa-user text-xs text-slate-500"></i>
                      </div>
                    )}
                  </div>

                  <div className="sm:hidden flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate group-hover:text-blue-400 transition-colors">
                      {storyline.name || '未命名故事线'}
                    </h3>
                  </div>
                </div>

                {/* 中间：大屏显示的头像和封面 */}
                <div className="hidden sm:flex gap-3 flex-shrink-0">
                  {/* 头像 */}
                  <div className="relative">
                    {storyline.avatar ? (
                      <img
                        src={storyline.avatar}
                        alt={storyline.name}
                        className="w-16 h-16 rounded-lg object-cover border-2 border-slate-700 group-hover:border-blue-500 transition-colors"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23334155" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%2394a3b8" font-size="30" font-family="sans-serif"%3E头像%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-slate-700/50 flex items-center justify-center border-2 border-slate-700 group-hover:border-blue-500 transition-colors">
                        <i className="fas fa-user text-2xl text-slate-500"></i>
                      </div>
                    )}
                  </div>

                  {/* 封面 */}
                  <div className="relative">
                    {storyline.cover_image ? (
                      <img
                        src={storyline.cover_image}
                        alt={`${storyline.name} 封面`}
                        className="w-24 h-16 rounded-lg object-cover border-2 border-slate-700 group-hover:border-purple-500 transition-colors"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100"%3E%3Crect fill="%23334155" width="150" height="100"/%3E%3Ctext x="75" y="50" text-anchor="middle" dy=".3em" fill="%2394a3b8" font-size="20" font-family="sans-serif"%3E封面%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="w-24 h-16 rounded-lg bg-slate-700/50 flex items-center justify-center border-2 border-slate-700 group-hover:border-purple-500 transition-colors">
                        <i className="fas fa-image text-xl text-slate-500"></i>
                      </div>
                    )}
                  </div>
                </div>

                {/* 右侧：主要信息 */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 w-full">
                      <div className="hidden sm:flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg truncate group-hover:text-blue-400 transition-colors">
                          {storyline.name || '未命名故事线'}
                        </h3>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] sm:text-xs font-medium border border-blue-500/20">
                          <i className="fas fa-tag"></i>
                          {storyline.category || '未分类'}
                        </span>
                        {storyline.is_published && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] sm:text-xs font-medium border border-green-500/20">
                            <i className="fas fa-check-circle"></i>
                            已发布
                          </span>
                        )}
                      </div>
                      
                      {storyline.creator_notes && (
                        <p className="text-sm text-slate-400 whitespace-pre-wrap break-words mt-2">
                          {storyline.creator_notes}
                        </p>
                      )}
                    </div>

                    {/* 操作按钮组 */}
                    <div className="flex items-center gap-1 flex-shrink-0 flex-wrap pt-2 sm:pt-0 border-t border-slate-700/30 sm:border-0 w-full sm:w-auto justify-end sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => moveStoryline(index, 'up', e)}
                        disabled={index === 0}
                        className="p-2 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded disabled:opacity-30"
                        title="上移"
                      >
                        <i className="fas fa-arrow-up"></i>
                      </button>
                      <button
                        onClick={(e) => moveStoryline(index, 'down', e)}
                        disabled={index === character.storylines.length - 1}
                        className="p-2 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded disabled:opacity-30"
                        title="下移"
                      >
                        <i className="fas fa-arrow-down"></i>
                      </button>
                      <div className="w-px h-4 bg-slate-700 mx-1 hidden sm:block"></div>
                      <button
                        onClick={(e) => handleExport(storyline, character.name, e)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded"
                        title="导出预设"
                      >
                        <i className="fas fa-download"></i>
                      </button>
                      <button
                        onClick={(e) => duplicateStoryline(index, e)}
                        className="p-2 text-green-400 hover:text-green-300 hover:bg-green-900/30 rounded"
                        title="复制"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                      <button
                        onClick={(e) => deleteStoryline(index, e)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded"
                        title="删除"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
