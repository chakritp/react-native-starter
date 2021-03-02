# typescriptstarter
TypescriptStarter

## Development

#### Prerequisites
- Android Studio
- XCode 12 + Command Line Tools (iOS devs)
- Node.js

#### Install dependencies
```
npm install
# iOS only
cd ios && pod install
cd ..
```

#### Launch App

Run metro bundler and cosmos server (Keep this process running).
```
npm run dev
```

Run on iOS Simulator
```
# Use default simulator
npm run ios

# Specify simulator
npm run ios -- --simulator "iPhone 8"
```

Run on iOS Device
1. Plug device into your workstation
2. `npm run ios -- --device "My Device"`

Run on Android Emulator
1. Open the repo in Android Studio
2. Open the AVD Manager and launch an emulator
3. `npm run android`

Run on Android Device
1. Plug device into your workstation
2. Make sure device has USB debugging enabled
3. Setup debugger proxy: `adb reverse tcp:8081 tcp:8081`
4. Setup api proxy: `adb reverse tcp:3000 tcp:3000`
5. `npm run android`

#### Cosmos
Cosmos UI is available at http://localhost:5000

Switch entrypoint between the app and Cosmos:
```
npm run entry:switch
```
Set entrypoint:
```
npm run entry <app|cosmos>
```

#### Other Scripts
```
# Show Android debug menu
npm run android:menu

# Reload Android app
npm run android:reload
```
