export interface LorebookEntry {
  id?: number;
  keys: string;
  secondary_keys: string;
  content: string;
  position: string;
  order: number;
  enabled: boolean;
  selective_logic: number;
  constant: boolean;
  probability: number;
  case_sensitive: boolean;
  match_whole_words: boolean;
  use_regex: boolean;
  depth: number;
  role: number;
  exclude_recursion: boolean;
  prevent_recursion: boolean;
  delay_until_recursion: boolean;
  sticky: number;
  cooldown: number;
  delay: number;
  group: string;
  group_weight: number;
}

export interface LorebookConfig {
  scan_depth: number;
  token_budget: number;
  recursive_scanning: boolean;
  max_recursion_depth: number;
}

export interface RegexScript {
  id?: number;
  name: string;
  regex: string;
  replace: string;
  placement: string;
}

export interface QuickReply {
  id?: number;
  label: string;
  content: string;
  order: number;
  enabled: boolean;
}

export interface VNAssets {
  [key: string]: any;
}

export interface VNSettings {
  [key: string]: any;
}

export interface Storyline {
  id?: number;
  display_id?: string;
  name: string;
  character_name?: string;
  avatar: string;
  cover_image: string;
  portrait: string;
  personality: string;
  scenario: string;
  first_mes: string;
  mes_example: string;
  creator_notes: string;
  system_prompt: string;
  post_history_instructions: string;
  response_format: string;
  world_view: string;
  is_published: boolean;
  published_at?: string | null;
  review_status?: string;
  reject_reason?: string;
  sort_order: number;
  category: string;
  vn_mode_enabled: boolean;
  vn_assets: VNAssets;
  vn_settings: VNSettings;
  bgm_list: string[];
  lorebook_config: LorebookConfig;
  world_info: LorebookEntry[];
  regex_scripts: RegexScript[];
  quick_replies: QuickReply[];
}

export interface Character {
  id?: number;
  display_id?: number;
  name: string;
  avatar: string;
  banner: string;
  description: string;
  tags: string;
  is_public: boolean;
  review_status?: string;
  reject_reason?: string;
  target_orientation: string;
  target_gender: string;
  species: string;
  storylines: Storyline[];
}

export const createDefaultLorebookEntry = (): LorebookEntry => ({
  keys: '',
  secondary_keys: '',
  content: '',
  position: 'after_char',
  order: 0,
  enabled: true,
  selective_logic: 0,
  constant: false,
  probability: 100,
  case_sensitive: false,
  match_whole_words: false,
  use_regex: false,
  depth: 4,
  role: 0,
  exclude_recursion: false,
  prevent_recursion: false,
  delay_until_recursion: false,
  sticky: 0,
  cooldown: 0,
  delay: 0,
  group: '',
  group_weight: 0
});

export const createDefaultRegexScript = (): RegexScript => ({
  name: '',
  regex: '',
  replace: '',
  placement: 'ai'
});

export const createDefaultQuickReply = (): QuickReply => ({
  label: '',
  content: '',
  order: 0,
  enabled: true
});

export const createDefaultStoryline = (): Storyline => ({
  name: '默认故事线',
  avatar: '',
  cover_image: '',
  portrait: '',
  personality: '',
  scenario: '',
  first_mes: '',
  mes_example: '',
  creator_notes: '',
  system_prompt: '',
  post_history_instructions: '',
  response_format: '',
  world_view: '',
  is_published: false,
  sort_order: 0,
  category: '',
  vn_mode_enabled: false,
  vn_assets: {},
  vn_settings: {},
  bgm_list: [],
  lorebook_config: {
    scan_depth: 2,
    token_budget: 500,
    recursive_scanning: true,
    max_recursion_depth: 3
  },
  world_info: [],
  regex_scripts: [],
  quick_replies: []
});

export const createDefaultCharacter = (): Character => ({
  name: '新角色',
  avatar: '',
  banner: '',
  description: '',
  tags: '',
  is_public: false,
  target_orientation: 'both',
  target_gender: 'both',
  species: 'human',
  storylines: [createDefaultStoryline()]
});
