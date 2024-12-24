import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams, useRouter } from 'expo-router';

const endGame = () => {
    const { win, word, gameField } = useLocalSearchParams<{
        win: string;
        word: string;
        gameField?: string;
      }>();

    

    const condition = () => {
      if (win === 'true') {
        return <Text style={{ fontSize: 20, fontWeight: 'bold' }}>You won! The word was {word}</Text>;
      } else {
        return <Text style={{ fontSize: 20, fontWeight: 'bold' }}>You lost! The word was {word}</Text>;
      }
    };

    const goBack = () => {
        router.dismissAll();
        router.replace('/');
        }

  return (
    <View style={styles.container}>
      <View style={styles.condition}>
      {condition()}
      </View>
      <TouchableOpacity onPress={() => goBack()} >
        <Text style={styles.playAgain}>Play Again</Text>
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
    }
})