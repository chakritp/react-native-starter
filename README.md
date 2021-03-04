# typescriptstarter
TypescriptStarter

## Development

#### Prerequisites
- Android Studio
- XCode 12 + Command Line Tools (iOS devs)
- Node.js
- Yarn
- Fastlane

#### Install dependencies
```
yarn
yarn ios:install
```

### Launch App

Run metro bundler and cosmos server (Keep this process running).
```
yarn dev
```

Run on iOS Simulator
```
# Use default simulator
yarn ios

# Specify simulator
yarn ios -- --simulator "iPhone 8"
```

Run on iOS Device
1. Plug device into your workstation
2. `yarn ios --device "My Device"`

Run on Android Emulator
1. Open the repo in Android Studio
2. Open the AVD Manager and launch an emulator
3. `yarn android`

Run on Android Device
1. Plug device into your workstation
2. Make sure device has USB debugging enabled
3. Setup debugger proxy: `adb reverse tcp:8081 tcp:8081`
4. Setup api proxy: `adb reverse tcp:3000 tcp:3000`
5. `yarn android`

### Cosmos
Cosmos UI is available at http://localhost:5000

Switch entrypoint between the app and Cosmos:
```
yarn entry:switch
```
Set entrypoint:
```
yarn entry <app|cosmos>
```

### Deployment
Deploy Beta
```
fastlane <ios|android> beta_dev
```

Deploy Prod Release
```
fastlane <ios|android> release_prod
```

#### Other Scripts
```
# Show Android debug menu
yarn android:menu

# Reload Android app
yarn android:reload
```
