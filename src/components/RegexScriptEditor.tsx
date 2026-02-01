import { Storyline, RegexScript, createDefaultRegexScript } from '../types/character';

interface Props {
  storyline: Storyline;
  onChange: (storyline: Storyline) => void;
}

export default function RegexScriptEditor({ storyline, onChange }: Props) {
  const addScript = () => {
    const newScript = createDefaultRegexScript();
    onChange({
      ...storyline,
      regex_scripts: [...storyline.regex_scripts, newScript]
    });
  };

  const updateScript = (index: number, script: RegexScript) => {
    const newScripts = [...storyline.regex_scripts];
    newScripts[index] = script;
    onChange({ ...storyline, regex_scripts: newScripts });
  };

  const deleteScript = (index: number) => {
    if (!confirm('确定要删除这条正则脚本吗？')) return;
    const newScripts = storyline.regex_scripts.filter((_, i) => i !== index);
    onChange({ ...storyline, regex_scripts: newScripts });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">正则脚本 ({storyline.regex_scripts.length})</h3>
        <button onClick={addScript} className="btn btn-primary flex items-center gap-2">
          <i className="fas fa-plus"></i>
          添加脚本
        </button>
      </div>

      {storyline.regex_scripts.length === 0 ? (
        <div className="card text-center py-8 text-gray-400">
          <p>还没有正则脚本</p>
          <p className="text-sm mt-2">正则脚本可以用来替换或修改AI的输出</p>
        </div>
      ) : (
        <div className="space-y-3">
          {storyline.regex_scripts.map((script, index) => (
            <div key={index} className="card bg-gray-750">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{script.name || `脚本 ${index + 1}`}</h4>
                <button
                  onClick={() => deleteScript(index)}
                  className="p-2 text-red-400 hover:text-red-300"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="label">脚本名称</label>
                  <input
                    type="text"
                    value={script.name || ''}
                    onChange={(e) => updateScript(index, { ...script, name: e.target.value })}
                    className="input"
                    placeholder="给脚本起个名字"
                  />
                </div>

                <div>
                  <label className="label">正则表达式 *</label>
                  <input
                    type="text"
                    value={script.regex || ''}
                    onChange={(e) => updateScript(index, { ...script, regex: e.target.value })}
                    className="input font-mono"
                    placeholder="例如: /\*\*(.+?)\*\*/"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    使用JavaScript正则表达式语法
                  </p>
                </div>

                <div>
                  <label className="label">替换文本</label>
                  <input
                    type="text"
                    value={script.replace || ''}
                    onChange={(e) => updateScript(index, { ...script, replace: e.target.value })}
                    className="input font-mono"
                    placeholder="例如: <strong>$1</strong>"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    可以使用 $1, $2 等引用捕获组
                  </p>
                </div>

                <div>
                  <label className="label">应用位置</label>
                  <select
                    value={script.placement || 'ai'}
                    onChange={(e) => updateScript(index, { ...script, placement: e.target.value })}
                    className="input"
                  >
                    <option value="ai">AI输出</option>
                    <option value="user">用户输入</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
