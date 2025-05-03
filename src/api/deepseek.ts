import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

/**
 * 创建一个EventSource处理流式文本生成
 * @param prompt 用户输入的提示词
 * @param onMessage 处理每个文本块的回调
 * @param onError 处理错误的回调
 * @param onComplete 处理完成的回调
 * @returns 返回关闭连接的函数
 */
export const generatePoem = (
  prompt: string,
  onMessage: (text: string) => void,
  onError: () => void,
  onComplete: () => void
): () => void => {
  // 创建EventSource连接，使用GET请求
  const apiUrl = `${BASE_URL}/api/ai/generate-poem?prompt=${encodeURIComponent(prompt)}`;
  const evtSource = new EventSource(apiUrl);
  
  // 处理消息
  evtSource.onmessage = function(evt) {
    // 检查是否是结束信号
    if (evt.data === "[DONE]") {
      onComplete();
      evtSource.close();
      return;
    }
    
    // 处理返回的数据
    onMessage(evt.data);
  };
  
  // 处理错误
  evtSource.onerror = function() {
    onError();
    evtSource.close();
  };
  
  // 返回关闭连接的函数
  return () => {
    evtSource.close();
  };
};

export const analyzePoem = (
    prompt: string,
    onMessage: (text: string) => void,
    onError: () => void,
    onComplete: () => void
  ): () => void => {
    const apiUrl = `${BASE_URL}/api/ai/analyze-poem?prompt=${encodeURIComponent(prompt)}`;
    const evtSource = new EventSource(apiUrl);
    
    evtSource.onmessage = function(evt) {
      if (evt.data === "[DONE]") {
        onComplete();
        evtSource.close();
        return;
      }
      onMessage(evt.data);
    };
    
    evtSource.onerror = function() {
      onError();
      evtSource.close();
    };
    
    return () => {
      evtSource.close();
    };
  };
  