Follow these steps:

npx create-expo-app wordArc

npx expo install expo-dev-client

npm install --save-dev react-native-svg-transformer

npx expo install react-native-svg

npm install @clerk/clerk-expo

npx expo install expo-secure-store

npx expo install expo-local-authentication

npx expo install firebase

npx expo run:android to run the application

Go to https://clerk.com/ and create a new project.

Select Expo option and get your clerk api key.

Create an account and enable email, Google and Apple sign ins.

Create an .env file in app project. Copy your Clerk api key into it.

Copy declarations.d.ts &&  metro.config.js into project folder. Allows for SVG images to appear.

Create a file called expo-env-d.ts and paste this, ' reference types="expo/types" ' wrapped with <> brackets. 

Go to firebase and create a new project.

Create a new web app and copy the firebaseConfig and place it into your utils folder.

That's all.
