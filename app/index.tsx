import { Text, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { Link } from "expo-router";
import Animated, { FadeInLeft } from 'react-native-reanimated';
import React from "react";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import Icon from '@/assets/images/wordArc.svg';


const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
} 

export default function Index() {

  const { signOut } = useAuth();

  const signOutFunction = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        onPress: () => signOut(),
      },
    ]);
  };

  return (
    <Animated.View style={styles.container}>
      <Icon width={240} height={200}  />
      <Animated.View entering={FadeInLeft}>
        <Text style={styles.wordArc}>WordArc</Text>
      </Animated.View>

        <Link href={"/game"} asChild>
          <AnimatedTouchableOpacity entering={FadeInLeft} style={styles.btn}>
            <Text style={styles.btnText}>Play</Text>
          </AnimatedTouchableOpacity>
        </Link>

      <SignedOut>
        <Link href={"/login"} asChild>
          <AnimatedTouchableOpacity entering={FadeInLeft} style={styles.btn}>
            <Text style={styles.btnText}>Login</Text>
          </AnimatedTouchableOpacity>
        </Link>
      </SignedOut>

      <SignedIn>
          <AnimatedTouchableOpacity entering={FadeInLeft} style={styles.btn} onPress={() => signOutFunction()}>
            <Text style={styles.btnText}>Sign Out</Text>
          </AnimatedTouchableOpacity>
      </SignedIn>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 10,
  },
  wordArc: {
    fontSize: 40,
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "lightblue",
    padding: 10,
    borderWidth: 2,
    borderRadius: 5,
    width: '60%',
    maxWidth: 150,
  },
  btnText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  }
});