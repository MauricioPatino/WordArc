import OnScreenKeyboard, { BACKSPACE, ENTER } from '@/components/Keyboard';
import { Colors } from '@/constants/Colors';
import { allWords } from '@/utils/allWords';
import { words } from '@/utils/targetWords';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

const ROWS = 6;  //Change the number to 1 for debugging purposes

const Page = () => {
  const [word, setWord] = useState(words[Math.floor(Math.random() * words.length)]);
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].gameBg;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const grayColor = Colors[colorScheme ?? 'light'].gray;
  const router = useRouter();

  console.log('The word is:', word);

  const wordLetters = word.split('');

  const [rows, setRows] = useState<string[][]>(new Array(ROWS).fill(new Array(5).fill(''))); //fills out row with 5 empty strings
  const [curRow, setCurRow] = useState(0);
  const [curCol, _setCurCol] = useState(0);

  const [letterGreen, setGreenLetter] = useState<string[]>([]);
  const [letterYellow, setYellowLetter] = useState<string[]>([]);
  const [letterGray, setGrayLetter] = useState<string[]>([]);

  const colStateRef = useRef(curCol);
  const setCurCol = (data: number) => {
    colStateRef.current = data;
    _setCurCol(data);
  };

  const keyAdd = (key: string) => {
    console.log('CURRENT: ', colStateRef.current);

    const newRows = rows.map((row) => [...row]);
  
    switch (key) {
      case 'ENTER':
        checkWord();
        break;
  
      case 'BACKSPACE':
        handleBackspace(newRows);
        break;
  
      default:
        handleLetterInput(newRows, key);
        break;
    }
  };
  
  const handleBackspace = (newRows: string[][]) => {
    if (colStateRef.current === 0) {
      newRows[curRow][0] = '';
      setRows(newRows);
      return;
    }
  
    newRows[curRow][colStateRef.current - 1] = '';
    setCurCol(colStateRef.current - 1);
    setRows(newRows);
  };

  const handleLetterInput = (newRows: string[][], key: string) => {
    if (colStateRef.current >= newRows[curRow].length) return;
  
    console.log('keyAdd ~ curCol', colStateRef.current);
  
    newRows[curRow][colStateRef.current] = key;
    setRows(newRows);
    setCurCol(colStateRef.current + 1);
  };
  

  const checkWord = () => {
    const currentWord = rows[curRow].join('');
  
    if (currentWord.length < word.length) {
      shakeRow();
      return;
    }

    if (!allWords.includes(currentWord)) {
      console.log('Not a valid word');
      shakeRow();
      return;
    }
  
    evaluateWord(currentWord);
  
    handleGameEnd(currentWord);
  
    setCurRow(curRow + 1);
    setCurCol(0);
  };

  const evaluateWord = (currentWord: string) => {
    flipRow();
  
    const newGreen: string[] = [];
    const newYellow: string[] = [];
    const newGray: string[] = [];
  
    currentWord.split('').forEach((letter, index) => {
      if (letter === wordLetters[index]) {
        newGreen.push(letter);
      } else if (wordLetters.includes(letter)) {
        newYellow.push(letter);
      } else {
        newGray.push(letter);
      }
    });
  
    setGreenLetter([...letterGreen, ...newGreen]);
    setYellowLetter([...letterYellow, ...newYellow]);
    setGrayLetter([...letterGray, ...newGray]);
  };
  
  const handleGameEnd = (currentWord: string) => {
    setTimeout(() => {
      if (currentWord === word) {
        console.log('Check word: ');
        router.push(`/endGame?win=true&word=${word}&gameField=${JSON.stringify(rows)}`);
      } else if (curRow + 1 >= rows.length) {
        console.log('GAME OVER');
        router.push(`/endGame?win=false&word=${word}&gameField=${JSON.stringify(rows)}`);
      }
    }, 1500);
  };

  useEffect(() => {
    const handleKeyDown = (a: any) => {
      if (a.key === 'Enter') {
        keyAdd(ENTER);
      } else if (a.key === 'Backspace') {
        keyAdd(BACKSPACE);
      } else if (a.key.length === 1) {
        keyAdd(a.key);
      }
    };

    if (Platform.OS === 'web') {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (Platform.OS === 'web') {
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [curCol]);

  // Animations
  const setCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (curRow >= rowIndex) {
      if (wordLetters[cellIndex] === cell) {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.green)
        );
      } else if (wordLetters.includes(cell)) {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.yellow)
        );
      } else {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(grayColor)
        );
      }
    } else {
      cellBackgrounds[rowIndex][cellIndex].value = withTiming('transparent', { duration: 100 });
    }
  };

  const setBorderColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (curRow > rowIndex && cell !== '') {
      if (wordLetters[cellIndex] === cell) {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.green)
        );
      } else if (wordLetters.includes(cell)) {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.yellow)
        );
      } else {
        cellBorders[rowIndex][cellIndex].value = withDelay(cellIndex * 200, withTiming(grayColor));
      }
    }
    return Colors.light.gray;
  };

  const offsetShakes = Array.from({ length: ROWS }, () => useSharedValue(0));

  const rowStyles = Array.from({ length: ROWS }, (_, index) =>
    useAnimatedStyle(() => {
      return {
        transform: [{ translateX: offsetShakes[index].value }],
      };
    })
  );

  const tileRotates = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue(0))
  );

  const cellBackgrounds = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue('transparent'))
  );

  const cellBorders = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue(Colors.light.gray))
  );

  const tileStyles = Array.from({ length: ROWS }, (_, index) => {
    return Array.from({ length: 5 }, (_, tileIndex) =>
      useAnimatedStyle(() => {
        return {
          transform: [{ rotateX: `${tileRotates[index][tileIndex].value}deg` }],
          borderColor: cellBorders[index][tileIndex].value,
          backgroundColor: cellBackgrounds[index][tileIndex].value,
        };
      })
    );
  });

  const shakeRow = () => {
    const TIME = 85;
    const OFFSET = 12;

    offsetShakes[curRow].value = withSequence(
      withTiming(-OFFSET, { duration: TIME / 2 }),
      withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
      withTiming(0, { duration: TIME / 2 })
    );
  };

  const flipRow = () => {
    const TIME = 310;
    const OFFSET = 100;

    tileRotates[curRow].forEach((value, index) => {
      value.value = withDelay(
        index * 100,
        withSequence(
          withTiming(OFFSET, { duration: TIME }, () => {}),
          withTiming(0, { duration: TIME })
        )
      );
    });
  };

  useEffect(() => {
    if (curRow === 0) return;

    rows[curRow - 1].map((cell, cellIndex) => {
      setCellColor(cell, curRow - 1, cellIndex);
      setBorderColor(cell, curRow - 1, cellIndex);
    });
  }, [curRow]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.gameField}>
        {rows.map((row, rowIndex) => (
          <Animated.View style={[styles.gameFieldRow, rowStyles[rowIndex]]} key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <Animated.View
                entering={ZoomIn.delay(50 * cellIndex)}
                key={`cell-${rowIndex}-${cellIndex}`}>
                <Animated.View
                  style={[
                    styles.cell,
                    tileStyles[rowIndex][cellIndex],
                  ]}>
                  <Animated.Text
                    style={[
                      styles.cellText,
                      {
                        color: curRow > rowIndex ? '#fff' : textColor,
                      },
                    ]}>
                    {cell}
                  </Animated.Text>
                </Animated.View>
              </Animated.View>
            ))}
          </Animated.View>
        ))}
      </View>
      <OnScreenKeyboard
        onKeyPressed={keyAdd}
        letterGreen={letterGreen}
        letterYellow={letterYellow}
        letterGray={letterGray}
      />
    </View>
  );
};
export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
  },
  gameField: {
    alignItems: 'center',
    gap: 8,
  },
  gameFieldRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: '#fff',
    width: 45,
    height: 45,
  },
  cellText: {
    fontSize: 30,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  }
});