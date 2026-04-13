/**
 * DeepSeek AI API 客户端
 * 支持流式输出的对话接口
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

/**
 * 保存 API Key
 */
export const saveApiKey = (key) => {
  localStorage.setItem('deepseek_api_key', key);
};

/**
 * 获取 API Key
 */
export const getApiKey = () => {
  return localStorage.getItem('deepseek_api_key') || '';
};

/**
 * 检查 API Key 是否已配置
 */
export const hasApiKey = () => {
  return !!getApiKey();
};

/**
 * DeepSeek 流式对话
 * @param {Object} options
 * @param {Array} options.messages - 消息历史
 * @param {string} options.apiKey - DeepSeek API Key
 * @param {Function} options.onChunk - 收到数据块回调
 * @param {Function} options.onComplete - 完成回调
 * @param {Function} options.onError - 错误回调
 * @returns {AbortController}
 */
export const streamChat = async ({
  messages,
  apiKey,
  onChunk,
  onComplete,
  onError,
}) => {
  const controller = new AbortController();

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        stream: true,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API 请求失败: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      chunk.split('\n').forEach((line) => {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;

          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              fullContent += content;
              onChunk(content, fullContent);
            }
          } catch {
            // 忽略解析错误
          }
        }
      });
    }

    onComplete(fullContent);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('请求已取消');
    } else {
      onError(error);
    }
  }

  return controller;
};

/**
 * 生成带上下文的提示词
 */
export const buildContextPrompt = (userQuestion, currentLevel = null) => {
  if (!currentLevel) {
    return userQuestion;
  }

  return `
当前你正在帮助用户解答 SQL 学习平台的题目。

当前题目信息：
- 题目名称：${currentLevel.title || '无'}
- 题目描述：${currentLevel.content || '无'}
- 参考答案：${currentLevel.answer || '无'}

用户问题：${userQuestion}

请结合当前题目的上下文，用简洁易懂的方式回答用户的 SQL 问题。如果用户询问的是解题思路，可以给出适当的提示但不要直接给出完整答案。
  `.trim();
};
