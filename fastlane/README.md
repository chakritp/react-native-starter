fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
### update_version
```
fastlane update_version
```
Increment build numbers and set the version to match the package.json version.

----

## Android
### android beta_dev
```
fastlane android beta_dev
```
Deploy dev build to Google Play internal track
### android beta_prod
```
fastlane android beta_prod
```
Deploy prod build to Google Play internal track
### android release_prod
```
fastlane android release_prod
```
Deploy prod build to Google Play

----

## iOS
### ios beta_dev
```
fastlane ios beta_dev
```
Deploy dev build to TestFlight
### ios beta_prod
```
fastlane ios beta_prod
```
Deploy prod build to TestFlight
### ios release_prod
```
fastlane ios release_prod
```
Deploy prod build to the App Store

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
