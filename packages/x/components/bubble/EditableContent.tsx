import { Input } from 'antd';
import React from 'react';
import { BubbleProps } from './interface';

export const EditableContent: React.FC<{
  content: string;
  onEditing?: BubbleProps['onEditing'];
}> = ({ content, onEditing }) => {
  if (typeof content !== 'string') throw new Error('Content of editable Bubble should be string');

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => onEditing?.(e.target.value),
    [onEditing],
  );

  return <Input.TextArea variant="borderless" value={content} onChange={onChange} />;
};
