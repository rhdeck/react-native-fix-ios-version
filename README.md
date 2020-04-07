# react-native-fix-ios-version

Updates the version of your RN IOS project to 11.0 (by default). This is useful for automating support for newer features, like ARKit and CoreML

# Installation

```
yarn add react-native-fix-ios-version
```

# Usage

```
react-native set-ios-version <version>
```

This will update the ios version in your package.json. Usage for a living-on-the-edge developer:

```
react-native set-ios-version 12.0
```

**NOTE The old support for react-native link was removed in this version**
