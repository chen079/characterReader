import { useState, useEffect } from 'react';
import { Character, createDefaultCharacter } from './types/character';
import { importCharacter, exportCharacter } from './utils/fileHandler';
import { db, CharacterRecord } from './utils/indexedDB';
import CharacterEditor from './components/CharacterEditor';
import CharacterList from './components/CharacterList';

function App() {
  const [characters, setCharacters] = useState<CharacterRecord[]>([]);
  const [currentCharacterId, setCurrentCharacterId] = useState<string | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [isLoading, setIsLoading] = useState(true);

  // 初始化数据库并加载角色列表
  useEffect(() => {
    loadCharacters();
  }, []);

  // 自动保存当前编辑的角色
  useEffect(() => {
    if (character && currentCharacterId) {
      const timer = setTimeout(() => {
        saveCurrentCharacter();
      }, 1000); // 1秒后自动保存

      return () => clearTimeout(timer);
    }
  }, [character]);

  const loadCharacters = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      await db.init();
      const allCharacters = await db.getAllCharacters();
      setCharacters(allCharacters);
    } catch (err) {
      setError('加载角色列表失败');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const saveCurrentCharacter = async () => {
    if (!character || !currentCharacterId) return;

    try {
      await db.updateCharacter(currentCharacterId, character);
      await loadCharacters(false);
    } catch (err) {
      console.error('自动保存失败:', err);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError('');
      const imported = await importCharacter(file);

      // 保存到 IndexedDB
      const id = await db.saveCharacter(imported);
      await loadCharacters();

      // 切换到编辑器视图
      setCurrentCharacterId(id);
      setCharacter(imported);
      setView('editor');

      setSuccess('角色卡导入成功！');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '导入失败');
    }
  };

  const handleExport = async (id?: string) => {
    try {
      let charToExport: Character | null = null;

      if (id) {
        // 从列表导出
        const record = await db.getCharacter(id);
        if (record) {
          charToExport = record.character;
        }
      } else if (character) {
        // 导出当前编辑的角色
        charToExport = character;
      }

      if (charToExport) {
        exportCharacter(charToExport);
        setSuccess('角色卡导出成功！');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('导出失败');
    }
  };

  const handleNewCharacter = async () => {
    if (character && !confirm('创建新角色将丢失当前未保存的更改，确定继续吗？')) {
      return;
    }

    try {
      const newChar = createDefaultCharacter();
      const id = await db.saveCharacter(newChar);
      await loadCharacters();

      setCurrentCharacterId(id);
      setCharacter(newChar);
      setView('editor');

      setSuccess('已创建新角色');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('创建角色失败');
    }
  };

  const handleSelectCharacter = async (id: string) => {
    try {
      const record = await db.getCharacter(id);
      if (record) {
        setCurrentCharacterId(id);
        setCharacter(record.character);
        setView('editor');
      }
    } catch (err) {
      setError('加载角色失败');
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    try {
      await db.deleteCharacter(id);
      await loadCharacters();

      if (currentCharacterId === id) {
        setCurrentCharacterId(null);
        setCharacter(null);
        setView('list');
      }

      setSuccess('角色已删除');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('删除角色失败');
    }
  };

  const handleBackToList = async () => {
    if (character && currentCharacterId) {
      await saveCurrentCharacter();
    }
    setView('list');
    setCharacter(null);
    setCurrentCharacterId(null);
  };

  const handleSaveAndBack = async () => {
    if (character && currentCharacterId) {
      try {
        await db.updateCharacter(currentCharacterId, character);
        await loadCharacters();
        setSuccess('保存成功！');
        setTimeout(() => setSuccess(''), 3000);
        setView('list');
        setCharacter(null);
        setCurrentCharacterId(null);
      } catch (err) {
        setError('保存失败');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <i className="fas fa-user-edit text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Fuderation 角色编辑器
                </h1>
                <p className="text-xs text-slate-400">Character Editor</p>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {view === 'editor' && (
                <>
                  <button
                    onClick={handleBackToList}
                    className="btn btn-secondary flex items-center gap-2"
                    title="返回列表"
                  >
                    <i className="fas fa-arrow-left"></i>
                    <span className="hidden md:inline">返回列表</span>
                  </button>
                  <button
                    onClick={handleSaveAndBack}
                    className="btn btn-success flex items-center gap-2"
                    title="保存并返回"
                  >
                    <i className="fas fa-save"></i>
                    <span className="hidden md:inline">保存并返回</span>
                  </button>
                </>
              )}

              <button
                onClick={handleNewCharacter}
                className="btn btn-secondary flex items-center gap-2"
                title="新建角色"
              >
                <i className="fas fa-plus"></i>
                <span className="hidden md:inline">新建角色</span>
              </button>

              <label className="btn btn-primary flex items-center gap-2 cursor-pointer" title="导入角色卡">
                <i className="fas fa-upload"></i>
                <span className="hidden md:inline">导入角色卡</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              {view === 'editor' && character && (
                <button
                  onClick={() => handleExport()}
                  className="btn btn-success flex items-center gap-2"
                  title="导出角色卡"
                >
                  <i className="fas fa-download"></i>
                  <span className="hidden md:inline">导出角色卡</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg flex items-center gap-3 backdrop-blur-sm animate-fade-in">
            <i className="fas fa-exclamation-circle text-red-400 text-xl"></i>
            <span className="text-red-200">{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-900/30 border border-green-700/50 rounded-lg flex items-center gap-3 backdrop-blur-sm animate-fade-in">
            <i className="fas fa-check-circle text-green-400 text-xl"></i>
            <span className="text-green-200">{success}</span>
            <button
              onClick={() => setSuccess('')}
              className="ml-auto text-green-400 hover:text-green-300"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="card text-center py-20">
            <i className="fas fa-spinner fa-spin text-4xl text-blue-400 mb-4"></i>
            <p className="text-slate-400">加载中...</p>
          </div>
        ) : view === 'list' ? (
          <CharacterList
            characters={characters}
            currentCharacterId={currentCharacterId}
            onSelect={handleSelectCharacter}
            onDelete={handleDeleteCharacter}
            onExport={handleExport}
          />
        ) : character ? (
          <CharacterEditor
            character={character}
            onChange={setCharacter}
          />
        ) : null}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/50 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
            <div className="flex items-center gap-2">
              <i className="fas fa-code text-blue-400"></i>
              <span className="font-medium">Fuderation Character Editor</span>
              <span className="text-slate-500">v1.0.0</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <i className="fas fa-database text-purple-400"></i>
                IndexedDB 本地存储
              </span>
              <span className="flex items-center gap-2">
                <i className="fas fa-file-code text-purple-400"></i>
                支持 JSON 格式
              </span>
              <span className="flex items-center gap-2">
                <i className="fas fa-heart text-red-400"></i>
                Made with React
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
