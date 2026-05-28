# WII Farmer App — APK Build Guide
## Build a shareable Android APK from this project

---

## PREREQUISITES (install once)

| Tool | Download | Notes |
|------|----------|-------|
| **Node.js 18+** | https://nodejs.org | Required for Capacitor CLI |
| **Android Studio** | https://developer.android.com/studio | Required for Android SDK + build tools |
| **JDK 17** | Included in Android Studio | Or download from adoptium.net |

After installing Android Studio:
1. Open Android Studio → Settings → SDK Manager
2. Install **Android SDK** (API 34 recommended)
3. Install **Android Build Tools 34.0.0**
4. Note your **SDK path** (you'll need it)

---

## STEP 1 — Install dependencies

```bash
cd wii-farmer-app
npm install
```

---

## STEP 2 — Add Android platform

```bash
npx cap add android
```

This creates the `android/` folder with a full Gradle project.

---

## STEP 3 — Sync web assets

```bash
npx cap sync android
```

This copies `www/` into the Android project.

---

## STEP 4 — Configure signing (for shareable APK)

Create a keystore file (do this ONCE, keep it safe):

```bash
keytool -genkeypair -v \
  -keystore wii-release.keystore \
  -alias wii-key \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -dname "CN=WII Farmer, OU=WII, O=WII Insurance, L=Harare, S=Harare, C=ZW"
```

Enter a password when prompted (remember it).

---

## STEP 5 — Build Release APK

Option A — Using Android Studio (easiest):
```
npx cap open android
```
Then in Android Studio:
→ Build → Generate Signed Bundle/APK
→ Choose APK
→ Select your keystore file
→ Enter alias + passwords
→ Release build
→ APK saved to: android/app/release/app-release.apk

Option B — Command line:

Edit `android/gradle.properties`, add:
```
MYAPP_UPLOAD_STORE_FILE=../wii-release.keystore
MYAPP_UPLOAD_KEY_ALIAS=wii-key
MYAPP_UPLOAD_STORE_PASSWORD=your_password
MYAPP_UPLOAD_KEY_PASSWORD=your_password
```

Edit `android/app/build.gradle`, add inside `android { ... }`:
```gradle
signingConfigs {
    release {
        storeFile file(MYAPP_UPLOAD_STORE_FILE)
        storePassword MYAPP_UPLOAD_STORE_PASSWORD
        keyAlias MYAPP_UPLOAD_KEY_ALIAS
        keyPassword MYAPP_UPLOAD_KEY_PASSWORD
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

Then run:
```bash
cd android
./gradlew assembleRelease
```

APK output: `android/app/build/outputs/apk/release/app-release.apk`

---

## STEP 6 — Share the APK

The output file `app-release.apk` (~4-6 MB) can be:

- **WhatsApp / Telegram** — send directly as a file
- **Google Drive / Dropbox** — share a download link
- **Email** — attach and send
- **USB** — copy to phone directly

---

## INSTALLING ON OTHER PHONES

Recipients must enable "Install from Unknown Sources":

**Android 8+:**
Settings → Apps → Special App Access → Install Unknown Apps
→ Allow from WhatsApp / Files / Browser

**Android 7 and below:**
Settings → Security → Unknown Sources → Enable

Then tap the APK file to install.

---

## FREE CLOUD BUILD (no Android Studio needed)

If you don't have Android Studio, use **GitHub Actions** free CI:

1. Push this project to a GitHub repository
2. Create `.github/workflows/build.yml`:

```yaml
name: Build APK
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18' }
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: '17' }
      - name: Install deps
        run: npm install
      - name: Add Android
        run: npx cap add android
      - name: Sync
        run: npx cap sync android
      - name: Build APK
        run: cd android && ./gradlew assembleDebug
      - uses: actions/upload-artifact@v4
        with:
          name: wii-debug-apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
```

3. Push to GitHub → Actions tab → Download the APK artifact

---

## APP DETAILS

| Property | Value |
|----------|-------|
| App ID | zw.co.wii.farmer |
| App Name | WII Farmer |
| Min Android | API 22 (Android 5.1+) |
| Target Android | API 34 (Android 14) |
| Permissions | Internet, Storage |
| Offline | Yes — localStorage |

---

## TROUBLESHOOTING

**`ANDROID_HOME` not set:**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

**Gradle build fails:**
```bash
cd android && ./gradlew clean && ./gradlew assembleRelease
```

**Font not loading on device (offline):**
The app loads Google Fonts from CDN. For fully offline font support, download the font files and embed them in `www/fonts/` — instructions in the README below.
