import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { doc, DocumentData, getDoc, setDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/utils/firebaseConfig';
import { SignedIn, useUser } from '@clerk/clerk-expo';

const endGame = () => {
    const { win, word, gameField } = useLocalSearchParams<{
        win: string;
        word: string;
        gameField?: string;
      }>();

    const router = useRouter();
    const [userScore, setUserScore] = useState<any>();
    const {user} = useUser();

    useEffect(() => {
      updateHighscore();
    }, [user]);

    
    const updateHighscore = async () => {
      if (!user) return;
    
      const docRef = doc(FIRESTORE_DB, `highscore/${user.id}`);
      const userScoreDoc = await getDoc(docRef);
    
      // Initialize new score object
      const initialScore = {
        played: 1,
        wins: win === 'true' ? 1 : 0,
        lastGame: win === 'true' ? 'win' : 'loss',
        currentStreak: win === 'true' ? 1 : 0,
      };
    
      const calculateUpdatedScore = (existingData: DocumentData) => ({
        played: existingData.played + 1,
        wins: win === 'true' ? existingData.wins + 1 : existingData.wins,
        lastGame: win === 'true' ? 'win' : 'loss',
        currentStreak: win === 'true' && existingData.lastGame === 'win' 
          ? existingData.currentStreak + 1 
          : win === 'true' 
            ? 1 
            : 0,
      });
    
      // Use existing data if available
      const updatedScore = userScoreDoc.exists()
        ? calculateUpdatedScore(userScoreDoc.data())
        : initialScore;
    
      await setDoc(docRef, updatedScore);
      setUserScore(updatedScore);
    };
    

    const condition = () => {
      if (win === 'true') {
        return <Text style={{ fontSize: 20, fontWeight: 'bold' }}>You won! The word was {word}</Text>;
      } else {
        return <Text style={{ fontSize: 20, fontWeight: 'bold' }}>You lost! The word was {word}</Text>;
      }
      
    };
    console.log(userScore?.wins, userScore?.played, userScore?.currentStreak);

    const goBack = () => {
        router.dismissAll();
        router.replace('/');
        }

  return (
    <View style={styles.container}>
      <View style={styles.condition}>
      {condition()}
      </View>
      <View style = {styles.statsContainer}>
      <SignedIn>
          <Text style={styles.text}>Statistics</Text>
          <View style={styles.stats}>
            <View>
              <Text style={styles.score}>{userScore?.played}</Text>
              <Text>Played</Text>
            </View>
            <View>
              <Text style={styles.score}>{userScore?.wins}</Text>
              <Text>Wins</Text>
            </View>
            <View>
              <Text style={styles.score}>{userScore?.currentStreak}</Text>
              <Text>Current Streak</Text>
            </View>
          </View>
        </SignedIn>
      </View>
      <TouchableOpacity onPress={() => goBack()} >
        <Text style={styles.playAgain}>Play Again?</Text>
        </TouchableOpacity>


    </View>
  )
}

export default endGame;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    condition: {
        marginBottom: 20, 
        borderWidth: 1,
        borderColor: 'black', 
        borderRadius: 5,
        padding: 15, 
        backgroundColor: 'white', 
        alignItems: 'center', 
    },
    playAgain: {
        backgroundColor: 'lightblue',
        padding: 10,
        borderRadius: 5,
        textAlign: 'center',
        marginTop: 20,
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      alignSelf: 'center',
    },
    statsContainer: {
      marginTop: 20,
    },
    stats: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '100%',
      gap: 40,
    },
    score: {
      fontSize: 40,
      fontWeight: 'bold',
    },
})