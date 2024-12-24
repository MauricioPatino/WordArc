import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { TextInput } from 'react-native-gesture-handler';
import { Colors } from '@/constants/Colors';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

enum LoginStrategy {
  Google = 'oauthGoogle',
  Apple = 'oauthApple',
}

const login = () => {

const router = useRouter();

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });

const AUTH_STRATEGIES = {
  [LoginStrategy.Google]: googleAuth,
  [LoginStrategy.Apple]: appleAuth,
};

const onSelectAuth = async (strategy: LoginStrategy) => {
  const selectedAuth = AUTH_STRATEGIES[strategy];

  if (!selectedAuth) {
    console.error(`Invalid strategy: ${strategy}`);
    return;
  }

  try {
    const { createdSessionId, setActive } = await selectedAuth();

    if (createdSessionId) {
      setActive?.({ session: createdSessionId }); 
      router.replace('/'); 
    }
  } catch (err) {
    console.error('OAuth error', err);
  }
};

  return (
    <View style={styles.container}>

      <Text>Enter your email address</Text>
      <TextInput placeholder='email' style={styles.emailInput} value={email} onChangeText={setEmail}></TextInput>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Continue with email</Text>
      </TouchableOpacity>


      <View style={styles.seperatorView}>
        <View
          style={{
            flex: 1,
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text style={styles.seperator}>OR</Text>
        <View
          style={{
            flex: 1,
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>

        <TouchableOpacity style={styles.btnOutline} onPress={() => onSelectAuth(LoginStrategy.Google)}>
          <Ionicons name="logo-google" size={24} style={styles.btnIcon} />
          <Text style={styles.btnOutlineText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnOutline} onPress={() => onSelectAuth(LoginStrategy.Apple)}>
          <Ionicons name="logo-apple" size={24} style={styles.btnIcon} />
          <Text style={styles.btnOutlineText}>Continue with Apple</Text>
        </TouchableOpacity>
    </View>
  );
}

export default login;

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        width: '60%',
        paddingHorizontal: 8,
      },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 10,
      },
    emailInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        width: '60%',
    },
      btnOutline: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
        height: 50,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
      },
      btnOutlineText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '500',
      },
      btnIcon: {
        paddingRight: 10,
      },
      btn: {
        height: 50,
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        padding: 10,
      },
      btnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
      },
      seperatorView: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginVertical: 30,
      },
      seperator: {
        fontFamily: 'mon-sb',
        color: Colors.light.gray,
        fontSize: 16,
      },
});