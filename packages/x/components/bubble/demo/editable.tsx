import { CheckOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { Actions, Bubble } from '@ant-design/x';
import { Avatar, Flex } from 'antd';
import React, { useState } from 'react';

const App = () => {
  const [editable, setEditable] = useState(false);
  const [content, setContent] = useState('editable bubble');

  return (
    <Flex vertical gap="small">
      <Flex gap="small" wrap>
        <Bubble
          editable={editable}
          content={content}
          typing
          components={{
            avatar: <Avatar icon={<UserOutlined />} />,
            footer: (
              <Actions
                items={[
                  editable
                    ? { key: 'done', icon: <CheckOutlined />, label: 'done' }
                    : {
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: 'edit',
                      },
                ]}
                onClick={({ key }) => setEditable(key === 'edit')}
              />
            ),
          }}
          onEditing={(content) => {
            // 应该对 content 做 xss 处理
            setContent(content);
          }}
        />
      </Flex>
    </Flex>
  );
};

export default App;
