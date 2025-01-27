
export const isEmptyObj = (obj: unknown): boolean => {
    if (
      obj &&
      Object.keys(obj).length === 0 &&
      Object.getPrototypeOf(obj) === Object.prototype
    ) {
      return true;
    }
    return false;
  };
  
  
  export const getDataFromLocalStorage = <T = unknown>(key: string): T | null => {
    const storedData = localStorage.getItem(key);
  
    if (storedData) {
      try {
        return JSON.parse(storedData) as T;
      } catch (error) {
        console.log(
          `Error parsing localStorage data for key '${key}': ${(error as Error).message}`
        );
      }
    }
  
    return null;
  };

  export const setDataInLocalStorage = <T = unknown>(key: string, data: T): void => {
    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
    } catch (error) {
      console.error(`Error setting localStorage data for key '${key}': ${(error as Error).message}`);
    }
  };
  
  
  export const removeItemFrmLocalStorage = (keysToRemove: string[] = []): void => {
    if (keysToRemove.length) {
      for (const key of keysToRemove) {
        localStorage.removeItem(key);
      }
    }
  };
  