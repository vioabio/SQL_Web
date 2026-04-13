// 运行结果对比

/**
 * 结果状态枚举
 */
export const RESULT_STATUS_ENUM = {
  DEFAULT: -1,
  ERROR: 0,
  SUCCEED: 1,
};

/**
 * 结果状态信息映射
 */
export const RESULT_STATUS_INFO_MAP = {
  "-1": "未执行",
  0: "❌ 错误",
  1: "✅ 正确",
};

/**
 * 判断结果是否正确
 * @param {Array} result 用户结果
 * @param {Array} answerResult 答案结果
 */
export const checkResult = (result, answerResult) => {
  console.log('验证结果:', { result, answerResult });
  
  if (!result?.[0] || !answerResult?.[0]) {
    console.log('验证失败: 结果为空');
    return RESULT_STATUS_ENUM.ERROR;
  }
  
  // 列名需要一致
  const resultColumns = result[0].columns;
  const answerResultColumns = answerResult[0].columns;
  console.log('列名比较:', { user: resultColumns, answer: answerResultColumns });
  
  if (JSON.stringify(resultColumns) !== JSON.stringify(answerResultColumns)) {
    console.log('验证失败: 列名不一致');
    return RESULT_STATUS_ENUM.ERROR;
  }
  
  // 数据需要一致
  const resultValues = result[0].values;
  const answerResultValues = answerResult[0].values;
  console.log('数据比较:', { user: resultValues, answer: answerResultValues });
  
  if (JSON.stringify(resultValues) === JSON.stringify(answerResultValues)) {
    console.log('验证成功: 结果匹配');
    return RESULT_STATUS_ENUM.SUCCEED;
  }
  
  console.log('验证失败: 数据不一致');
  return RESULT_STATUS_ENUM.ERROR;
};
