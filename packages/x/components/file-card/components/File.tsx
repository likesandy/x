import classnames from 'classnames';
import React, { useMemo } from 'react';
import { SemanticType } from '../FileCard';
import { getSize } from '../utils';

interface FileProps {
  styles?: Partial<Record<SemanticType, React.CSSProperties>>;
  classNames?: Partial<Record<SemanticType, string>>;
  prefixCls?: string;
  name?: string;
  ext?: string;
  showSize?: 'small' | 'default';
  size?: number;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  iconColor?: string;
  onClick?: () => void;
  mask?: React.ReactNode;
}

const File: React.FC<FileProps> = (props) => {
  const {
    styles = {},
    classNames = {},
    prefixCls,
    name,
    ext,
    size,
    showSize,
    description,
    icon,
    iconColor,
    onClick,
    mask,
  } = props;
  const compCls = `${prefixCls}-file`;

  const mergedCls = classnames(
    compCls,
    classNames.file,
    {
      [`${compCls}-small`]: showSize === 'small',
    },
  );

  const desc = useMemo(() => {
    if (description) {
      return description;
    }
    if (typeof size === 'number') {
      return getSize(size);
    }
    return '';
  }, [description, size]);

  return (
    <div className={mergedCls} style={styles.file} onClick={onClick}>
      <div
        className={classnames(`${compCls}-icon`, classNames.icon)}
        style={{ color: iconColor, ...styles.icon }}
      >
        {icon}
      </div>
      <div className={`${compCls}-content`}>
        <div className={classnames(`${compCls}-name`, classNames.name)} style={styles.name}>
          <span className={`${compCls}-name-prefix`}>{name}</span>
          <span className={`${compCls}-name-suffix`}>{ext}</span>
        </div>
        {desc && (
          <div
            className={classnames(`${compCls}-description`, classNames.description)}
            style={styles.description}
          >
            {desc}
          </div>
        )}
      </div>
      {mask && (
        <div className={`${compCls}-mask`}>
          <div className={`${compCls}-mask-info`}>{mask}</div>
        </div>
      )}
    </div>
  );
};

export default File;
