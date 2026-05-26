# DesiPlay: Build Steps & Unity Setup

## 1. Unity Project Setup
1. Create a new Unity 3D project.
2. Ensure you have the **Android Build Support** module installed via Unity Hub.
3. Open Unity, go to **File > Build Settings** and switch the platform to **Android**.
4. Copy the `Assets` folder provided in this deliverable into your new Unity project.

## 2. Firebase Integration
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named **DesiPlay**.
3. Add an Android app. Use your company package name (e.g., `com.desiplay.sitoliya`).
4. Download the `google-services.json` file and place it exactly in your Unity project's `Assets` folder.
5. In the Firebase console, enable **Authentication** (Anonymous & Google enabled).
6. Enable **Realtime Database** (Start in Test Mode initially).
7. Download the [Firebase Unity SDK](https://firebase.google.com/download/unity) and import `FirebaseAuth.unitypackage` and `FirebaseDatabase.unitypackage` via **Assets > Import Package > Custom Package**.

## 3. AdMob Integration
1. Download and import the [Google Mobile Ads Unity Plugin](https://github.com/googleads/googleads-mobile-unity/releases).
2. Go to **Assets > Google Mobile Ads > Settings**, enable AdMob, and enter your real App ID. 
3. (Optional for testing) Test App ID: `ca-app-pub-3940256099942544~3347511713`.
4. Our `AdManager.cs` currently uses a test Ad Unit ID for rewarded ads. Swap this out with your production Ad Unit ID before release.

## 4. Scene Configuration
1. Create three scenes: `Boot`, `Menu`, and `Gameplay`. Add them to **Build Settings** in that exact order (Indices 0, 1, 2).
2. **Menu Scene**: Attach `UIManager.cs` to a Canvas and link your nested Canvas Groups (Splash, Home, Lobby). Ensure you have an EventSystem.
3. **Gameplay Scene**: Create a Plane for the floor, and a stack of 7 Cubes tagged as `Stone` with Rigidbody components. Link them to the `StoneManager.cs` array.
4. **Gameplay Scene**: Create an empty GameObject `GameManager` and attach `GameManager.cs`. Create another component for `FirebaseRTDBManager.cs`.
5. **Gameplay Scene**: Create a Player object (Capsule) with a `CharacterController` and `PlayerController.cs`.

## 5. Building the APK (Optimized for Low-End)
1. Go to **Edit > Project Settings > Player > Android Settings (Android Icon)**.
2. **Other Settings**:
   - Set **Minimum API Level** to Android 5.1 (API 22) or higher to maximize reach.
   - Set **Scripting Backend** to IL2CPP.
   - Enable **ARM64** and **ARMv7** under Target Architectures.
3. **Quality Settings**:
   - Go to **Edit > Project Settings > Quality**.
   - Change the Default Android quality to **Medium** or **Low**.
   - Disable Anti-Aliasing, use hard shadows only to significantly improve performance on low-end devices.
4. Go to **File > Build Settings**. Click **Build** and choose a location to save your `DesiPlay.apk`.
