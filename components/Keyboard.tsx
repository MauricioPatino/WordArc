import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';

type OnScreenKeyboardProps = {
  onKeyPressed: (key: string) => void;
  letterGreen: string[];
  letterYellow: string[];
  letterGray: string[];
};

export const ENTER = 'ENTER';
export const BACKSPACE = 'BACKSPACE';

const keys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  [BACKSPACE, 'z', 'x', 'c', 'v', 'b', 'n', 'm', ENTER],
];

const Keyboard = ({
  onKeyPressed,
  letterGreen,
  letterYellow,
  letterGray,
}: OnScreenKeyboardProps) => {
  const { width } = useWindowDimensions();
  const keyWidth = Platform.OS === 'android' ? 30 : (width - 60) / keys[0].length;
  const keyHeight = 60;
  const isSpecialKey = (key: string) => key === ENTER || key === BACKSPACE;

  const isInLetters = (key: string) =>
    [...letterGreen, ...letterYellow, ...letterGray].includes(key);

  // Determine the background color for a key
  const getKeyBackgroundColor = (key: string) => {
    if (letterGreen.includes(key)) return Colors.light.green;
    if (letterYellow.includes(key)) return Colors.light.yellow;
    if (letterGray.includes(key)) return Colors.light.gray;
    return '#ddd';
  };

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((key, keyIndex) => (
            <Pressable
              key={`key-${key}`}
              onPress={() => onKeyPressed(key)}
              style={({ pressed }) => [
                styles.key,
                { width: keyWidth, height: keyHeight },
                isSpecialKey(key) && { width: keyWidth * 1.5 },
                { backgroundColor: getKeyBackgroundColor(key) },
                pressed && { backgroundColor: '#868686' },
              ]}
            >
              <Text
                style={[
                  styles.keyText,
                  key === 'ENTER' && { fontSize: 12 },
                  isInLetters(key) && { color: '#fff' },
                ]}
              >
                {isSpecialKey(key) ? (
                  key === ENTER ? (
                    'ENTER'
                  ) : (
                    <Ionicons name="backspace-outline" size={35} color="black" />
                  )
                ) : (
                  key.toUpperCase()
                )}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
};

export default Keyboard;
const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    gap: 6,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  key: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  keyText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});