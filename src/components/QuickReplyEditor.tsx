import { Storyline, QuickReply, createDefaultQuickReply } from '../types/character';
import AutoResizeTextarea from './AutoResizeTextarea';

interface Props {
  storyline: Storyline;
  onChange: (storyline: Storyline) => void;
}

export default function QuickReplyEditor({ storyline, onChange }: Props) {
  const addReply = () => {
    const newReply = createDefaultQuickReply();
    newReply.order = storyline.quick_replies.length;
    onChange({
      ...storyline,
      quick_replies: [...storyline.quick_replies, newReply]
    });
  };

  const updateReply = (index: number, reply: QuickReply) => {
    const newReplies = [...storyline.quick_replies];
    newReplies[index] = reply;
    onChange({ ...storyline, quick_replies: newReplies });
  };

  const deleteReply = (index: number) => {
    if (!confirm('确定要删除这条快捷回复吗？')) return;
    const newReplies = storyline.quick_replies.filter((_, i) => i !== index);
    onChange({ ...storyline, quick_replies: newReplies });
  };

  const moveReply = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= storyline.quick_replies.length) return;

    const newReplies = [...storyline.quick_replies];
    [newReplies[index], newReplies[newIndex]] = [newReplies[newIndex], newReplies[index]];

    // 更新 order
    newReplies.forEach((r, i) => {
      r.order = i;
    });

    onChange({ ...storyline, quick_replies: newReplies });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">快捷回复 ({storyline.quick_replies.length})</h3>
        <button onClick={addReply} className="btn btn-primary flex items-center gap-2">
          <i className="fas fa-plus"></i>
          <span className="hidden sm:inline">添加快捷回复</span>
        </button>
      </div>

      {storyline.quick_replies.length === 0 ? (
        <div className="card text-center py-8 text-gray-400">
          <p>还没有快捷回复</p>
          <p className="text-sm mt-2">快捷回复可以让用户快速发送预设的消息</p>
        </div>
      ) : (
        <div className="space-y-3">
          {storyline.quick_replies.map((reply, index) => (
            <div key={index} className="card bg-gray-750">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{reply.label || `快捷回复 ${index + 1}`}</h4>
                  {!reply.enabled && <span className="text-xs text-gray-500">(已禁用)</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveReply(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                    title="上移"
                  >
                    <i className="fas fa-arrow-up"></i>
                  </button>
                  <button
                    onClick={() => moveReply(index, 'down')}
                    disabled={index === storyline.quick_replies.length - 1}
                    className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                    title="下移"
                  >
                    <i className="fas fa-arrow-down"></i>
                  </button>
                  <button
                    onClick={() => deleteReply(index)}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="label">按钮标签 *</label>
                  <input
                    type="text"
                    value={reply.label || ''}
                    onChange={(e) => updateReply(index, { ...reply, label: e.target.value })}
                    className="input"
                    placeholder="显示在按钮上的文字"
                  />
                </div>

                <div>
                  <label className="label">回复内容 *</label>
                  <AutoResizeTextarea
                    value={reply.content}
                    onChange={(e) => updateReply(index, { ...reply, content: e.target.value })}
                    placeholder="点击按钮时发送的消息内容"
                    minRows={2}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`reply_enabled_${index}`}
                    checked={reply.enabled}
                    onChange={(e) => updateReply(index, { ...reply, enabled: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor={`reply_enabled_${index}`} className="text-sm">
                    启用此快捷回复
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
