# react-native-fix-ios-version
Updates the version of your RN IOS project to 11.0 (by default). This is useful for automating support for newer features, like ARKit and CoreML

# Usage
```
yarn add react-native-fix-ios-version
```
**Note** You can determine the target version via the `iosTarget` property of your `package.json` file. To set a different target version, say 11.1, just set the value like so before adding the package. :
```
{
    ...
    dependencies: {
        ...
    },
    iosTarget: 11.1
}
```

