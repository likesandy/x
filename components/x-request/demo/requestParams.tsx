import { LoadingOutlined, TagsOutlined } from '@ant-design/icons';
import type { ThoughtChainItem } from '@ant-design/x';
import { ThoughtChain, XRequest } from '@ant-design/x';
import { Button, Descriptions, Splitter } from 'antd';
import React from 'react';
import { getApiConfig } from '../config';

// Load configuration from environment variables
const config = getApiConfig();

const exampleRequest = XRequest({
  baseURL: config.baseURL,
  model: config.model,

  /** 🔥🔥 Its dangerously! */
  dangerouslyApiKey: config.apiKey,
});

const App = () => {
  const [status, setStatus] = React.useState<ThoughtChainItem['status']>();
  const [lines, setLines] = React.useState<Record<string, string>[]>([]);

  async function request() {
    setStatus('pending');

    await exampleRequest.create(
      {
        stream: true,
        messages: [{ role: 'user', content: '你是谁啊' }],
      },
      {
        onSuccess: (messages) => {
          setStatus('success');
          console.log('onSuccess', messages);
        },
        onError: (error) => {
          setStatus('error');
          console.error('onError', error);
        },
        onUpdate: (msg) => {
          setLines((pre) => [...pre, msg]);
          console.log('onUpdate', msg);
        },
      },
    );
  }

  return (
    <Splitter>
      <Splitter.Panel>
        <Button type="primary" disabled={status === 'pending'} onClick={request}>
          Request - {config.baseURL}
        </Button>
      </Splitter.Panel>
      <Splitter.Panel style={{ marginLeft: 16 }}>
        <ThoughtChain
          items={[
            {
              title: 'Request Log',
              status: status,
              icon: status === 'pending' ? <LoadingOutlined /> : <TagsOutlined />,
              description:
                status === 'error' &&
                'Please configure your API settings in the .env file. Check .env.example for reference.',
              content: (
                <Descriptions column={1}>
                  <Descriptions.Item label="Status">{status || '-'}</Descriptions.Item>
                  <Descriptions.Item label="Update Times">{lines.length}</Descriptions.Item>
                </Descriptions>
              ),
            },
          ]}
        />
      </Splitter.Panel>
    </Splitter>
  );
};

export default App;
