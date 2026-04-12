/**
 * 用户本地存储管理
 */

const USER_KEY = 'sql_web_user';
const HISTORY_KEY = 'sql_web_history';

/**
 * 获取用户信息
 */
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * 保存用户信息
 */
export const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * 清除用户信息
 */
export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};

/**
 * 获取做题记录
 */
export const getHistory = () => {
  const historyStr = localStorage.getItem(HISTORY_KEY);
  return historyStr ? JSON.parse(historyStr) : [];
};

/**
 * 添加做题记录
 */
export const addHistory = (record) => {
  const history = getHistory();
  const newRecord = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    ...record,
  };
  history.unshift(newRecord); // 添加到最前面
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return newRecord;
};

/**
 * 更新做题记录
 */
export const updateHistory = (id, updates) => {
  const history = getHistory();
  const index = history.findIndex((item) => item.id === id);
  if (index !== -1) {
    history[index] = { ...history[index], ...updates };
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
};

/**
 * 清除做题记录
 */
export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

/**
 * 获取用户某关卡的最近记录
 */
export const getLevelHistory = (levelKey) => {
  const history = getHistory();
  return history.filter((item) => item.levelKey === levelKey);
};

/**
 * 检查关卡是否已通过
 */
export const isLevelPassed = (levelKey) => {
  const history = getHistory();
  return history.some(
    (item) => item.levelKey === levelKey && item.status === 'success'
  );
};

/**
 * 获取用户统计数据
 */
export const getUserStats = () => {
  const history = getHistory();
  const passedLevels = new Set(
    history.filter((h) => h.status === 'success').map((h) => h.levelKey)
  );

  return {
    totalAttempts: history.length,
    passedCount: passedLevels.size,
    successRate:
      history.length > 0
        ? Math.round(
            (history.filter((h) => h.status === 'success').length /
              history.length) *
              100
          )
        : 0,
  };
};
