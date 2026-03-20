import mainLevels from "./mainLevels";
import customLevels from "./levels/customLevels";


export const allLevels = [...mainLevels, ...customLevels];


export const getLevelByKey = (levelKey) => {
  return (
    allLevels.find((level) => {
      return level.key === levelKey;
    }) || allLevels[0]
  );
};


export const getCurrentLevelNum = (currentLevel) => {
  return allLevels.findIndex((level) => level.key === currentLevel.key);
};


export const getPrevLevel = (currentLevel) => {
  const num = getCurrentLevelNum(currentLevel);
  if (num <= 0) {
    return;
  }
  return allLevels[num - 1];
};


export const getNextLevel = (currentLevel) => {
  const num = getCurrentLevelNum(currentLevel);
  if (num >= allLevels.length - 1) {
    return;
  }
  return allLevels[num + 1];
};
