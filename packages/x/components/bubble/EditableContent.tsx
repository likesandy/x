import { useEvent } from 'rc-util';
import React from 'react';
import { BubbleProps } from './interface';

export const EditableContent: React.FC<{
  content: string;
  onEditing?: BubbleProps['onEditing'];
}> = ({ content, onEditing }) => {
  const mockInputRef = React.useRef<HTMLDivElement>(null);

  const onInput = useEvent((e: React.ChangeEvent<HTMLDivElement>) =>
    // textContent 拒绝直接 xss
    // 但 onEditing 端应该对入参做 xss 防护
    onEditing?.(e.target.textContent || ''),
  );

  React.useEffect(() => {
    mockInputRef.current!.textContent = content;
  }, []);

  // 拒绝非 string content，保证 div 渲染纯文本（Text Node）而不是 HTML
  if (typeof content !== 'string') throw new Error('Content of editable Bubble should be string');

  // 避免组件更新，影响光标位置
  // 初始化文本使用 content，后续由编辑内容确定
  const memoedMockInput = React.useMemo(
    () => (
      /**
       * 为什么使用 div
       * input、textarea 是固定行为、固定宽高的元素，无法对内容自适应，体验差
       * div.contentEditable 提供了编辑 innerHTML 的能力，同时具备内容自适应能力，体验好
       */
      <div ref={mockInputRef} contentEditable onInput={onInput} />
    ),
    [],
  );

  return memoedMockInput;
};
