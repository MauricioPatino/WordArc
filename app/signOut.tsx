import { StyleSheet, View} from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler';

const signOut = () => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your email" 
        keyboardType="email-address" 
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry={true} 
      />
      <TextInput
        style={styles.input}        
        secureTextEntry={true} 
        placeholder='Confirm Password'
      />
    </View>
  );
}

export default signOut;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        width: '60%',
      },
});