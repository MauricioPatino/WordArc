Follow these steps

npx create-expo-app wordArc

npx expo install expo-dev-client

npm install --save-dev react-native-svg-transformer

npx expo install react-native-svg

npm install @clerk/clerk-expo

npx expo install expo-secure-store

npx expo install expo-local-authentication

npx expo run:android to run the application

Get your clerk api key from https://clerk.com/

Create an account and enable email, Google and Apple sign ins.

Create an .env file in app project. Copy your api key into it.

Copy declarations.d.ts into project folder.

Create a file called expo-env-d.ts and paste this 

<reference types="expo/types" />

That's all.
