import { LoadingOutlined, TagsOutlined } from '@ant-design/icons';
import type { ThoughtChainItem } from '@ant-design/x';
import { ThoughtChain, XRequest } from '@ant-design/x';
import { Button, Descriptions, Splitter } from 'antd';
import React from 'react';
import { getApiConfig } from '../config';

/**
 * 🔔 Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.
 */

const config = getApiConfig();

const exampleRequest = XRequest({
  baseURL: config.baseURL + config.path,
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
        messages: [{ role: 'user', content: 'hello, who are u?' }],
        stream: true,
        agentId: 111,
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
          {config.path}
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
                exampleRequest.baseURL === config.baseURL + config.path &&
                'Please replace the BASE_URL, PATH, MODEL, API_KEY with your own values.',
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
