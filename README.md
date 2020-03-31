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
react-native link
```

**Note** You can determine the target version manually via the `iosTarget` property of your `package.json` file. To set a different target version, say 11.1, just set the value like so before adding the package. :

```
{
    ...
    dependencies: {
        ...
    },
    iosTarget: 12.0
}
```

**NOTE The support for react-native link was removed in this version**
