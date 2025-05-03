/**
 * 通用文本格式化工具函数
 * 用于处理AI大模型返回的各种格式文本
 */

/**
 * 对不同类型的内容进行专门处理
 * @param text 原始文本
 * @param contentType 内容类型
 */
export const formatAIContent = (text: string, contentType: string = 'generic'): string => {
  if (!text) return '';

  // 基础格式化 - 适用于所有类型
  let formattedText = text
    // 在标题层次符号后添加空格 (# Title)
    .replace(/^(#{1,6})([^#\s])/gm, '$1 $2')
    // 确保段落间有适当空行
    .replace(/\n{3,}/g, '\n\n')
    // 确保冒号后有空格
    .replace(/([：:])(?=[^\s\n])/g, '$1 ')
    // 在句号、问号、叹号后添加空格（除非后面已经有空格、换行或标点）
    .replace(/([。！？])(?=[^\s\n。，、；：！？])/g, '$1 ');

  // 针对诗歌分析的专门处理
  if (contentType === 'poem') {
    formattedText = formatPoemAnalysis(formattedText);
  } 
  // 针对帖子/散文分析的专门处理
  else if (contentType === 'post') {
    formattedText = formatPostAnalysis(formattedText);
  }
  // 如有其他特殊类型，可在此添加处理逻辑
  
  return formattedText.trim();
};

/**
 * 针对诗歌分析内容的格式化
 * @param text 原始文本
 */
const formatPoemAnalysis = (text: string): string => {
  return text
    // 处理特殊emoji标记
    .replace(/(📜|🔍|💡|📌|✨)/g, '\n\n$1')
    
    // 处理标题和诗人信息
    .replace(/(📜[\s\S]*?)(【[\s\S]*?】)/g, '$1\n$2')
    
    // 处理各类分析部分标题
    .replace(/(-\s*形式分析[:：])/gi, '\n\n### $1\n')
    .replace(/(-\s*意象解读[:：])/gi, '\n\n### $1\n')
    .replace(/(-\s*情感内核[:：])/gi, '\n\n### $1\n')
    .replace(/(-\s*创作背景[:：])/gi, '\n\n### $1\n')
    .replace(/(-\s*艺术特色[:：])/gi, '\n\n### $1\n')
    .replace(/(-\s*历史意义[:：])/gi, '\n\n### $1\n')
    .replace(/(💡\s*延伸思考)/g, '\n\n### $1\n')
    
    // 处理意象解读中的子条目
    .replace(/(-\s*"[\s\S]*?")/g, '\n- $1')
    
    // 处理注释和引用
    .replace(/^(注[:：])/gm, '\n\n> $1')
    .replace(/^(引[:：])/gm, '\n\n> $1')
    
    // 确保列表项格式正确
    .replace(/\n\s*[-•]\s*/g, '\n- ');
};

/**
 * 针对帖子/散文分析内容的格式化
 * @param text 原始文本
 */
const formatPostAnalysis = (text: string): string => {
  return text
    // 处理章节和部分标题
    .replace(/^(第[一二三四五六七八九十]部分|Part \d+)[:：]/gm, '\n\n## $1:\n')
    .replace(/^([\d一二三四五六七八九十]+[\.、])/gm, '\n\n### $1 ')
    
    // 处理关键点和要点
    .replace(/^(要点|关键点|总结|结论)[:：]/gm, '\n\n### $1:\n')
    .replace(/^(优点|缺点|建议)[:：]/gm, '\n\n#### $1:\n')
    
    // 处理引用内容
    .replace(/^([「『])([^」』]*?)([」』])$/gm, '\n> $1$2$3\n')
    
    // 确保列表项格式正确
    .replace(/\n\s*[-•]\s*/g, '\n- ');
};