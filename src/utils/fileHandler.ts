import { Character } from '../types/character';

export const importCharacter = (file: File): Promise<Character> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // 验证基本字段
        if (!data.name) {
          throw new Error('角色卡缺少必要字段: name');
        }

        // 确保storylines存在
        if (!data.storylines || !Array.isArray(data.storylines)) {
          data.storylines = [];
        }

        // 处理每个故事线的 VN 模式数据
        data.storylines = data.storylines.map((storyline: any) => {
          // 处理 vn_assets：如果是字符串则解析为对象
          if (typeof storyline.vn_assets === 'string') {
            try {
              storyline.vn_assets = JSON.parse(storyline.vn_assets || '{}');
            } catch {
              storyline.vn_assets = {};
            }
          } else if (!storyline.vn_assets) {
            storyline.vn_assets = {};
          }

          // 处理 vn_settings：如果是字符串则解析为对象
          if (typeof storyline.vn_settings === 'string') {
            try {
              storyline.vn_settings = JSON.parse(storyline.vn_settings || '{}');
            } catch {
              storyline.vn_settings = {};
            }
          } else if (!storyline.vn_settings) {
            storyline.vn_settings = {};
          }

          // 处理 bgm_list：如果是字符串则解析为数组
          if (typeof storyline.bgm_list === 'string') {
            try {
              storyline.bgm_list = JSON.parse(storyline.bgm_list || '[]');
            } catch {
              storyline.bgm_list = [];
            }
          } else if (!Array.isArray(storyline.bgm_list)) {
            storyline.bgm_list = [];
          }

          // 确保 world_info 是数组
          if (!Array.isArray(storyline.world_info)) {
            storyline.world_info = [];
          }

          // 确保 regex_scripts 是数组
          if (!Array.isArray(storyline.regex_scripts)) {
            storyline.regex_scripts = [];
          }

          // 确保 quick_replies 是数组
          if (!Array.isArray(storyline.quick_replies)) {
            storyline.quick_replies = [];
          }

          // 确保 lorebook_config 存在
          if (!storyline.lorebook_config) {
            storyline.lorebook_config = {
              scan_depth: 2,
              token_budget: 500,
              recursive_scanning: true,
              max_recursion_depth: 3
            };
          }

          return storyline;
        });

        resolve(data as Character);
      } catch (error) {
        reject(new Error(`解析角色卡失败: ${error instanceof Error ? error.message : '未知错误'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('读取文件失败'));
    };

    reader.readAsText(file);
  });
};

export const exportCharacter = (character: Character) => {
  const sanitizedName = character.name.replace(/[^a-z0-9\u4e00-\u9fa5]/gi, '_');
  const filename = `${sanitizedName}_export.json`;

  // 深拷贝角色数据以避免修改原始数据
  const exportData = JSON.parse(JSON.stringify(character));

  // 确保 VN 模式数据正确导出（保持为对象格式，不转换为字符串）
  // 后端会在导入时自动处理字符串和对象两种格式
  exportData.storylines = exportData.storylines.map((storyline: any) => {
    // 确保 vn_assets 是对象
    if (typeof storyline.vn_assets === 'string') {
      try {
        storyline.vn_assets = JSON.parse(storyline.vn_assets);
      } catch {
        storyline.vn_assets = {};
      }
    }

    // 确保 vn_settings 是对象
    if (typeof storyline.vn_settings === 'string') {
      try {
        storyline.vn_settings = JSON.parse(storyline.vn_settings);
      } catch {
        storyline.vn_settings = {};
      }
    }

    // 确保 bgm_list 是数组
    if (typeof storyline.bgm_list === 'string') {
      try {
        storyline.bgm_list = JSON.parse(storyline.bgm_list);
      } catch {
        storyline.bgm_list = [];
      }
    }

    return storyline;
  });

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportStorylinePreset = (storyline: any, _characterName: string) => {
  // 深拷贝以避免修改原始数据
  const preset = JSON.parse(JSON.stringify({
    personality: storyline.personality,
    scenario: storyline.scenario,
    world_view: storyline.world_view,
    first_mes: storyline.first_mes,
    mes_example: storyline.mes_example,
    response_format: storyline.response_format,
    world_info: storyline.world_info,
    regex_scripts: storyline.regex_scripts,
    quick_replies: storyline.quick_replies,
    vn_mode_enabled: storyline.vn_mode_enabled,
    vn_assets: storyline.vn_assets,
    vn_settings: storyline.vn_settings,
    bgm_list: storyline.bgm_list
  }));

  // 确保 VN 数据是对象格式
  if (typeof preset.vn_assets === 'string') {
    try {
      preset.vn_assets = JSON.parse(preset.vn_assets);
    } catch {
      preset.vn_assets = {};
    }
  }

  if (typeof preset.vn_settings === 'string') {
    try {
      preset.vn_settings = JSON.parse(preset.vn_settings);
    } catch {
      preset.vn_settings = {};
    }
  }

  if (typeof preset.bgm_list === 'string') {
    try {
      preset.bgm_list = JSON.parse(preset.bgm_list);
    } catch {
      preset.bgm_list = [];
    }
  }

  const sanitizedName = storyline.name.replace(/[^a-z0-9\u4e00-\u9fa5]/gi, '_');
  const filename = `${sanitizedName}_preset.json`;

  const json = JSON.stringify(preset, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

