import { TokenCache } from '@clerk/clerk-expo/dist/cache';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';


/**
 * Creates a token cache that uses Expo SecureStore as the underlying storage.
 *
 * @returns A TokenCache that implements the getToken and saveToken methods.
 */
const createTokenCache = (): TokenCache => {
  /**
   * Retrieves a token from the store using the provided key.
   *
   * @param key The key to retrieve the token by.
   * @returns The stored token or null if the key is not found.
   */
  const getToken = async (key: string): Promise<string | null> => {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used `);
      } else {
        console.log('No values stored under key: ' + key);
      }
      return item;
    } catch (error) {
      console.error('Secure store item not retrieved error: ', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  };

  /**
   * Saves a token to the store using the provided key.
   *
   * @param key The key to store the token by.
   * @param token The token to store.
   * @returns A promise that resolves when the token is saved.
   */
  const saveToken = (key: string, token: string): Promise<void> => {
    return SecureStore.setItemAsync(key, token);
  };

  return {
    getToken,
    saveToken,
  };
};

export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined;