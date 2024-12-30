import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, DocumentData } from "firebase/firestore";
import { useUser } from '@clerk/clerk-expo';
import { FIRESTORE_DB } from '@/utils/firebaseConfig';


const Leaderboard = () => {
  const {user}  = useUser();
  const [userScore, setUserScore] = useState<any>();

  useEffect(() => {
    const fetchUserScore = async () => {
      if (!user) return; // Ensure user exists before fetching data

      try {
        const docRef = doc(FIRESTORE_DB, `highscore/${user.id}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserScore(docSnap.data().wins); // Set the score from Firestore
        } else {
          console.log("No such document!"); // Handle when the document does not exist
        }
      } catch (error) {
        console.error("Error fetching user score:", error); // Log any errors
      }
    };

    fetchUserScore(); // Call the function
  }, [user]); 


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your wins: {userScore}</Text>
    </View>
  )
}

export default Leaderboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  }
})