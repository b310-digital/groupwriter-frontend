export const DEFAULT_COLOR_CLASS = 'bg-transparent';
export const Y_MAP_COMMENT_KEY = 'comments';

export const DEFAULT_COMMENT_OPTIONS = {
  commentType: 'comment' as const,
  draft: false,
  resolved: false,
  colorClass: DEFAULT_COLOR_CLASS,
  parentId: null
};