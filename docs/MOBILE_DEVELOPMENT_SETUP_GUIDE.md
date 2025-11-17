# Mobile Development Setup Guide - VeroField Mobile App

**Date:** January 16, 2025  
**Platform:** Windows 10/11  
**Target:** Android & iOS Development  
**Status:** Setup Required

---

## 🎯 **SETUP OVERVIEW**

This guide will help you set up the complete development environment for the VeroField Mobile App, including:

- ✅ **Android Studio** - For Android development and emulation
- ✅ **Java Development Kit (JDK)** - Required for Android development
- ✅ **Android SDK** - Android development tools and APIs
- ✅ **Android Emulator** - For testing Android apps
- ✅ **iOS Development** - Setup instructions (if you have access to macOS)
- ✅ **React Native CLI** - Mobile app development tools

---

## 📋 **SYSTEM REQUIREMENTS**

### **Current System Status:**
- ✅ **OS**: Windows 10/11 (Windows_NT)
- ✅ **Node.js**: v22.18.0 (Latest LTS)
- ✅ **npm**: v11.5.2
- ❌ **Java**: Not installed (Required for Android)
- ❌ **Android Studio**: Not installed
- ❌ **Android SDK**: Not installed

### **Minimum Requirements:**
- **RAM**: 8GB (16GB recommended)
- **Storage**: 10GB free space
- **CPU**: Intel/AMD 64-bit processor
- **OS**: Windows 10/11 (64-bit)

---

## 🚀 **STEP 1: INSTALL JAVA DEVELOPMENT KIT (JDK)**

### **Why Java is Required:**
- Android development requires Java
- React Native Android builds use Java
- Android Studio requires JDK

### **Installation Steps:**

1. **Download JDK 21 (Recommended)**
   - Go to: https://adoptium.net/
   - Select: **JDK 21 (LTS)**
   - Platform: **Windows x64**
   - Download: **.msi installer**

2. **Install JDK**
   - Run the downloaded .msi file
   - Follow installation wizard
   - **Important**: Note the installation path (usually `C:\Program Files\Eclipse Adoptium\jdk-21.x.x.x-hotspot\`)

3. **Set Environment Variables**
   - Open **System Properties** → **Environment Variables**
   - Add new system variable:
     - **Variable name**: `JAVA_HOME`
     - **Variable value**: `C:\Program Files\Eclipse Adoptium\jdk-21.x.x.x-hotspot\`
   - Edit **Path** variable and add: `%JAVA_HOME%\bin`

4. **Verify Installation**
   ```powershell
   java -version
   javac -version
   ```

---

## 🤖 **STEP 2: INSTALL ANDROID STUDIO**

### **Why Android Studio:**
- Official Android development IDE
- Includes Android SDK
- Built-in emulator
- React Native Android support

### **Installation Steps:**

1. **Download Android Studio**
   - Go to: https://developer.android.com/studio
   - Download: **Android Studio Hedgehog** (Latest)
   - File size: ~1GB

2. **Install Android Studio**
   - Run the downloaded installer
   - Choose **Standard** installation
   - Accept all license agreements
   - **Important**: Let it install Android SDK automatically

3. **First Launch Setup**
   - Launch Android Studio
   - Complete the setup wizard
   - Install recommended SDK components
   - Set up Android Virtual Device (AVD)

---

## 📱 **STEP 3: CONFIGURE ANDROID SDK**

### **SDK Components to Install:**

1. **Open SDK Manager**
   - In Android Studio: **Tools** → **SDK Manager**

2. **Install Required Components:**
   - ✅ **Android 14 (API 34)** - Latest stable
   - ✅ **Android 13 (API 33)** - Recommended
   - ✅ **Android 12 (API 31)** - Minimum for React Native
   - ✅ **Android SDK Build-Tools** (Latest)
   - ✅ **Android SDK Platform-Tools**
   - ✅ **Android SDK Tools**
   - ✅ **Intel x86 Emulator Accelerator (HAXM)**

3. **Set Environment Variables**
   - Add to system **Path**:
     - `%LOCALAPPDATA%\Android\Sdk\platform-tools`
     - `%LOCALAPPDATA%\Android\Sdk\tools`
     - `%LOCALAPPDATA%\Android\Sdk\tools\bin`

---

## 🖥️ **STEP 4: SET UP ANDROID EMULATOR**

### **Create Virtual Device:**

1. **Open AVD Manager**
   - In Android Studio: **Tools** → **AVD Manager**

2. **Create New Virtual Device**
   - Click **Create Virtual Device**
   - Choose **Phone** → **Pixel 7** (Recommended)
   - Select **API 34** (Android 14)
   - Click **Finish**

3. **Configure Emulator**
   - **RAM**: 4GB (if you have 16GB+ system RAM)
   - **Storage**: 8GB
   - **Graphics**: Hardware - GLES 2.0

---

## 🍎 **STEP 5: iOS DEVELOPMENT SETUP (OPTIONAL)**

### **Requirements for iOS Development:**
- **macOS** computer (MacBook, iMac, Mac Mini)
- **Xcode** (Latest version)
- **iOS Simulator**
- **Apple Developer Account** (for device testing)

### **If You Have macOS Access:**

1. **Install Xcode**
   - Download from Mac App Store
   - Install Xcode Command Line Tools:
     ```bash
     xcode-select --install
     ```

2. **Install CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

3. **Set up iOS Simulator**
   - Open Xcode
   - **Window** → **Devices and Simulators**
   - Add iOS simulators

---

## ⚙️ **STEP 6: CONFIGURE REACT NATIVE**

### **Install React Native CLI:**
```powershell
npm install -g @react-native-community/cli
```

### **Install Additional Tools:**
```powershell
npm install -g react-native-cli
```

### **Verify React Native Setup:**
```powershell
npx react-native doctor
```

---

## 🧪 **STEP 7: TEST MOBILE APP BUILD**

### **Navigate to Mobile App:**
```powershell
cd VeroFieldMobile
```

### **Install Dependencies:**
```powershell
npm install
```

### **Test Android Build:**
```powershell
npx react-native run-android
```

### **Test iOS Build (if on macOS):**
```powershell
npx react-native run-ios
```

---

## 🔧 **STEP 8: TROUBLESHOOTING COMMON ISSUES**

### **Java Issues:**
- **Problem**: `java` command not found
- **Solution**: Verify JAVA_HOME and Path environment variables

### **Android SDK Issues:**
- **Problem**: SDK not found
- **Solution**: Set ANDROID_HOME environment variable:
  - `ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk`

### **Emulator Issues:**
- **Problem**: Emulator won't start
- **Solution**: Enable virtualization in BIOS (Intel VT-x or AMD-V)

### **Build Issues:**
- **Problem**: Gradle build fails
- **Solution**: Clear cache and rebuild:
  ```powershell
  cd android
  ./gradlew clean
  cd ..
  npx react-native run-android
  ```

---

## 📊 **SETUP VERIFICATION CHECKLIST**

### **Java Setup:**
- [ ] Java installed and accessible
- [ ] JAVA_HOME environment variable set
- [ ] `java -version` command works

### **Android Studio:**
- [ ] Android Studio installed
- [ ] SDK components installed
- [ ] Emulator created and working

### **React Native:**
- [ ] React Native CLI installed
- [ ] `npx react-native doctor` passes
- [ ] Mobile app builds successfully

### **Development Ready:**
- [ ] Android emulator launches
- [ ] VeroField mobile app runs on emulator
- [ ] Ready for Week 2 development

---

## 🎯 **NEXT STEPS AFTER SETUP**

### **Once Setup is Complete:**
1. ✅ **Test Mobile App** - Ensure it builds and runs
2. ✅ **Verify Development Environment** - All tools working
3. ✅ **Ready for Week 2** - Photo capture and digital signatures
4. ✅ **Begin Development** - Start implementing Week 2 features

### **Week 2 Development Features:**
- 📸 **Photo Capture** - Camera integration
- ✍️ **Digital Signatures** - Signature capture
- 📱 **Enhanced UI** - Improved mobile interface
- 🔄 **Data Sync** - Offline/online synchronization

---

## 🆘 **GETTING HELP**

### **If You Encounter Issues:**
1. **Check React Native Doctor**: `npx react-native doctor`
2. **Clear Cache**: `npx react-native start --reset-cache`
3. **Rebuild**: `cd android && ./gradlew clean && cd .. && npx react-native run-android`
4. **Check Logs**: Android Studio → Logcat for detailed error messages

### **Useful Resources:**
- **React Native Docs**: https://reactnative.dev/docs/environment-setup
- **Android Studio Docs**: https://developer.android.com/studio
- **Troubleshooting**: https://reactnative.dev/docs/troubleshooting

---

## 🎉 **CONCLUSION**

Once you complete this setup guide, you'll have:

- ✅ **Complete Android Development Environment**
- ✅ **Working Android Emulator**
- ✅ **React Native Development Tools**
- ✅ **Ready for Week 2 Development**

The VeroField Mobile App will be ready for advanced features like photo capture, digital signatures, and enhanced mobile functionality.

---

*Last Updated: January 16, 2025*  
*Status: Setup Guide Ready*  
*Next: Execute Setup Steps*
