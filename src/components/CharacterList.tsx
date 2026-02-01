import { CharacterRecord } from '../utils/indexedDB';

interface Props {
  characters: CharacterRecord[];
  currentCharacterId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
}

export default function CharacterList({ characters, currentCharacterId, onSelect, onDelete, onExport }: Props) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (characters.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="w-20 h-20 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-inbox text-4xl text-slate-500"></i>
        </div>
        <h3 className="text-lg font-medium text-slate-300 mb-2">暂无角色</h3>
        <p className="text-slate-400 text-sm">导入或创建你的第一个角色</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <i className="fas fa-list text-blue-400"></i>
          角色列表
          <span className="text-sm text-slate-400">({characters.length})</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {characters.map((record) => (
          <div
            key={record.id}
            className={`card cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl ${
              currentCharacterId === record.id
                ? 'ring-2 ring-blue-500 bg-blue-900/20'
                : ''
            }`}
            onClick={() => onSelect(record.id)}
          >
            <div className="flex items-start gap-3">
              {record.character.avatar ? (
                <img
                  src={record.character.avatar}
                  alt={record.character.name}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-slate-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23334155" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%2394a3b8" font-size="40" font-family="sans-serif"%3E%3F%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-slate-700/50 flex items-center justify-center border-2 border-slate-700">
                  <i className="fas fa-user text-2xl text-slate-500"></i>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate mb-1">
                  {record.character.name}
                </h3>
                <p className="text-sm text-slate-400 line-clamp-2 mb-2">
                  {record.character.description || '暂无描述'}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <i className="fas fa-book"></i>
                    {record.character.storylines.length} 故事线
                  </span>
                  {record.character.tags && (
                    <span className="flex items-center gap-1">
                      <i className="fas fa-tags"></i>
                      {record.character.tags.split(',').length} 标签
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                <i className="fas fa-clock mr-1"></i>
                {formatDate(record.updatedAt)}
              </span>

              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onExport(record.id)}
                  className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded transition-colors"
                  title="导出"
                >
                  <i className="fas fa-download"></i>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`确定要删除角色"${record.character.name}"吗？`)) {
                      onDelete(record.id);
                    }
                  }}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors"
                  title="删除"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
