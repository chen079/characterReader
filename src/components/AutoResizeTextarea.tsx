import { useEffect, useLayoutEffect, useRef } from 'react';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  minRows?: number;
  maxRows?: number;
}

export default function AutoResizeTextarea({
  value,
  onChange,
  minRows = 3,
  maxRows = 999,
  className = '',
  ...props
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 保存当前的滚动位置，防止高度重置时页面跳动
    const scrollY = window.scrollY;

    // 重置高度以获取正确的 scrollHeight
    textarea.style.height = 'auto';

    // 计算行高
    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseInt(computedStyle.lineHeight) || 24;
    const paddingTop = parseInt(computedStyle.paddingTop) || 0;
    const paddingBottom = parseInt(computedStyle.paddingBottom) || 0;

    // 计算最小高度
    const minHeight = lineHeight * minRows + paddingTop + paddingBottom;
    
    // 设置新高度
    const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    
    textarea.style.height = `${newHeight}px`;

    // 恢复滚动位置
    window.scrollTo(window.scrollX, scrollY);

    // 内容完全展开，通常不需要内部滚动条
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.overflowY = 'hidden';
    }
  };

  // 使用 useLayoutEffect 确保在浏览器绘制前完成高度调整，避免闪烁
  useLayoutEffect(() => {
    adjustHeight();
  }, [value]);

  useEffect(() => {
    // 监听窗口大小变化
    window.addEventListener('resize', adjustHeight);
    return () => window.removeEventListener('resize', adjustHeight);
  }, []);

  return (
    <textarea
      ref={textareaRef}
      value={value || ''}
      onChange={onChange}
      className={`textarea ${className}`}
      style={{ resize: 'none', overflow: 'hidden' }}
      {...props}
    />
  );
}
