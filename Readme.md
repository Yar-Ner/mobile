REACT NATIVE MAKRAB APP
========================

This app only works  on Android devices


## Develop

1.Set up a development environment according to the documentation from the link: [Official React Native doc](https://reactnative.dev/docs/environment-setup)

### For Huawei (Optional)
2. Clone project
3. Registering a Huawei ID , if you don`t have one, follow the instructions [here](https://developer.huawei.com/consumer/en/doc/10104).
4. Create app in [developer console](https://developer.huawei.com/consumer/en/console) and auth with your Huawei ID.Follow the instructions in [this](https://developer.huawei.com/consumer/en/doc/distribution/app/agc-create_app) tutorial to create an application.
5. Create a Signing Certificate Fingerprint.To create one, go to JDK directory’s bin folder and open a terminal in this directory. Execute the following command:
`keytool -genkey -keystore <application_project_dir>\android\app\<signing_certificate_fingerprint_filename>.keystore -storepass <store_password> -alias <alias> -keypass <key_password> -keysize 2048 -keyalg RSA -validity 36500`
6. ype the following command in terminal: `keytool -list -v -keystore <application_project_dir>\android\app\<signing_certificate_fingerprint_filename>.keystore`.
7. After an authentication copy the SHA256 key and visit Huawei Developer console/<your_project>/General Information. and paste it to the field SHA-256 certificate fingerprint.
8. Enable the push kit from Project Setting/Manage APIs.
9. Then, download  the `agconnect-services.json` file from your project in app gallery from the General Information tab. Place the file in android/app directory in your React Native project.



### For All (Necessarily)
1. Run `yarn install` in project folder
2. Run `react-native link` for linking dependencies
3. Run `yarn android` for starting debugging app on device or emulator

## Building
1.Generate a keystore if you didn't do it in the section for Huawei. Go to JDK directory’s bin folder and open a terminal in this directory. Execute the following command:
`keytool -genkey -keystore <application_project_dir>\android\app\<signing_certificate_fingerprint_filename>.keystore -storepass <store_password> -alias <alias> -keypass <key_password> -keysize 2048 -keyalg RSA -validity 36500`
2.Go to <application_project_dir>\android\app\build.gradle and add the keystore configuration:
`android {
....
signingConfigs {
release {
storeFile file('your_key_name.keystore')
storePassword 'your_key_store_password'
keyAlias 'your_key_alias'
keyPassword 'your_key_file_alias_password'
}
}
buildTypes {
release {
....
signingConfig signingConfigs.release
}
}
}`

For Huawei see 5-9 steps in For Huawei section

3. Run in project folder the next command for building apk: `yarn gradle:release`
4. You can find the generated APK at android/app/build/outputs/apk/app-release.apk


## Publish in Stores

### For Google Play Store
1. Generate Building APK with instructions from Building section
2. Check your app with [pre-launch checklist](https://developer.android.com/distribute/best-practices/launch/launch-checklist)
3. Sign up your developer account with the next instruction: [link](https://support.google.com/googleplay/android-developer/answer/6112435#zippy=,%D1%88%D0%B0%D0%B3-%D0%B7%D0%B0%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B8%D1%80%D1%83%D0%B9%D1%82%D0%B5-%D0%B0%D0%BA%D0%BA%D0%B0%D1%83%D0%BD%D1%82-%D1%80%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%87%D0%B8%D0%BA%D0%B0-google-play)
4. Then upload app in Google Play Console
### For Huawei App Gallery
1. Generate Building APK with instructions from Building section
2. Follow the next instructions for upload app in Huawei App Gallery: [link](https://developer.huawei.com/consumer/en/doc/distribution/app/agc-help-releaseapkrpk-0000001106463276)
