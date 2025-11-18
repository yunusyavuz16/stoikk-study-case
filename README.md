# React Native Developer Case Study

## Merhaba 👋

Bu dokümantasyon, Instagram klonu case study projesinin teknik mimarisi, karar gerekçeleri ve implementasyon detaylarını içermektedir.

---

## 📋 İçindekiler

1. [Proje Amacı & Kapsam](#proje-amacı--kapsam)
2. [Hızlı Başlama](#hızlı-başlama)
3. [Feature Listesi](#feature-listesi)
4. [Teknik Mimari](#teknik-mimari)
5. [Folder Structure](#folder-structure)
6. [Media Handling Stratejisi](#media-handling-stratejisi)
7. [Video Davranışı](#video-davranışı)
8. [Performans Optimizasyonları](#performans-optimizasyonları)
9. [Authentication & Secure Storage](#authentication--secure-storage)
10. [Test, Lint, TypeScript & SonarQube](#test-lint-typescript--sonarqube)
11. [Bilinen Sınırlamalar](#bilinen-sınırlamalar)

---

## 🎯 Proje Amacı & Kapsam

**Production-ready** bir Instagram klonu case study'si. Temel gereksinimler:

- ✅ Instagram benzeri feed ekranı (scrollable post listesi)
- ✅ Post'lar: 2 görsel (swipeable carousel) veya 1 video
- ✅ Güvenli login ekranı ve credential storage
- ✅ Search ekranı (grid layout, video autoplay)
- ✅ Mock API ile veri yönetimi
- ✅ Tamamen custom component yapısı (Atomic Design)
- ✅ 10MB+ görseller için optimize edilmiş performans
- ✅ React Hooks tabanlı mimari
- ✅ Responsive design (tüm ekran boyutları)

**Teknik Hedefler:**
- TypeScript strict mode
- Test coverage ≥80%
- Lint & TypeScript check geçişi
- SonarQube entegrasyonu

---

## 🚀 Hızlı Başlama

### Gereksinimler

- Node.js >= 20
- React Native CLI
- iOS: Xcode, CocoaPods
- Android: Android Studio, JDK

### Kurulum

```bash
# Dependencies yükle
npm install

# iOS için CocoaPods (sadece ilk kurulumda)
cd ios && pod install && cd ..

# Metro bundler'ı başlat
npm start

# Android'de çalıştır
npm run android

# iOS'ta çalıştır
npm run ios
```

### Kalite Kontrolleri

```bash
npm run lint              # Lint kontrolü
npx tsc --noEmit         # TypeScript type check
npm test                 # Test çalıştır
npm test -- --coverage   # Test coverage raporu
```

---

## ✅ Feature Listesi

### 1. Feed Ekranı
- `FlatList` ile optimize edilmiş infinite scroll
- Post tipleri: 2 görsel (swipeable) veya 1 video
- Like işlevi (optimistic updates)
- Pagination: `page` ve `limit` parametreleri

### 2. Login Ekranı
- Username/password input'ları
- Mock authentication (herhangi bir input başarılı)
- `react-native-keychain` ile secure storage (iOS Keychain / Android Keystore)
- RTK Query ile session management

### 3. Search Ekranı
- Feed ekranının üstünde search bar
- Responsive grid layout (3-5 kolon)
- **Sadece thumbnail gösterimi** (yüksek performans için)
- Video autoplay (viewport tracking ile)
- Basit string matching (caption)

### 4. Video Handling
- Pexels videos kaynağı
- Autoplay: Viewport'ta olduğunda otomatik oynatma
- Auto-pause: Viewport'tan çıktığında otomatik durdurma
- Error fallback: Video yüklenemezse thumbnail gösterimi
- Video hazır olana kadar props ile yönetilen thumbnail gösterme özelliği

### 5. Mock API
- `postService` ile mock data generation
- Page-based pagination
- 500ms delay simülasyonu

### 6. Custom Component Yapısı
- **Atomic Design Pattern**: Atoms → Molecules → Organisms
- Her component kendi folder'ında (styles, types, tests ile)
- Ekran kodları sadece component'leri kullanır

### 7. Büyük Görseller (10MB+) Optimizasyonu
- **Progressive Loading**: Öncelikle Thumbnail → High-res image
- **Image Caching**: `react-native-fast-image` (disk + memory)
- **Prefetching**: Görünür item'ların önceden yüklenmesi
- CPU/UI thread optimize edilmiş

### 8. React Hooks
- Functional components only
- Custom hooks: `useAuthRTK`, `useGetPosts`, `useSearchRTK`, `useImagePrefetch`, `useMediaPlayerVisibility`, `useBreakpoint`

### 9. Responsive Design
- Breakpoint system: xs, sm, md, lg, xl
- Dynamic layout: `useBreakpoint` hook
- Grid columns: 3 (phone) → 4 (tablet) → 5 (desktop)

---

## 🏗️ Teknik Mimari

### State Management: Redux Toolkit + RTK Query

**Neden RTK Query?**
- Built-in caching ve invalidation
- Automatic loading/error states
- TypeScript-first API
- Minimal boilerplate

**Slice Yapısı:**
- `authSlice`: User session, access token
- `authApi`: Login, logout, checkAuth endpoints
- `postApi`: GetPosts, searchPosts endpoints

### Navigation: React Navigation v6

- Native Stack Navigator
- Type-safe navigation (`RootStackParamList`)
- Auth-based routing (`isAuthenticated` state'ine göre)

### Styling: StyleSheet.create + Theme System

- Theme Context (Light/Dark mode desteği)
- StyleSheet.create (runtime performance)
- Responsive styles (breakpoint-based)

### Type Safety: TypeScript Strict Mode

```typescript
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true
}
```

---

## 📁 Folder Structure

```
src/
├── app.tsx                    # App entry point
├── components/
│   ├── Atoms/                 # Icon, ThemedText, ThemedView
│   ├── Molecules/             # Button, Input, ImageWithThumbnail, CustomVideo
│   └── Organisms/             # Post, PostImageCarousel, MediaGrid
├── screens/
│   ├── Feed/                  # Feed screen + hooks + styles
│   ├── Login/                 # Login screen + hooks + styles
│   ├── Search/                # Search screen + hooks + styles
│   └── Profile/               # Profile screen
├── navigation/
│   ├── AppNavigator.tsx       # Main navigator
│   └── types.ts               # Navigation types
├── services/
│   ├── authService.ts         # Mock auth logic
│   ├── postService.ts         # Mock post data
│   ├── secureStorageService.ts # Keychain wrapper
│   └── imageCacheService.ts   # Image cache management
├── store/
│   ├── store.ts               # Redux store config
│   ├── api/                   # RTK Query API slices
│   └── slices/                # Redux slices
├── hooks/                     # Custom hooks
├── contexts/                  # Theme context
├── types/                     # TypeScript types
├── constants/                 # Constants
└── utils/                     # Utilities
```

**Path Aliases:**
- `@/` → `src/`
- `@components/`, `@screens/`, `@services/`, `@hooks/`, vb.

---

## 🖼️ Media Handling Stratejisi

### Feed Ekranı: Progressive Loading (Thumbnail → High-Res)

**Strateji:**
1. İlk render: Thumbnail göster (hızlı, düşük bandwidth)
2. Arka planda: High-resolution image yükle
3. Yüklenince: Thumbnail fade-out, high-res fade-in

**Neden?**
- UX: Anında görsel feedback
- Performance: 10MB+ görseller decode edilirken UI donmaz
- Memory: Thumbnail memory'de, high-res lazy load

**Implementasyon:** `ImageWithThumbnail` component, `useProgressiveImage` hook, FastImage layers

### Search Ekranı: Sadece Thumbnail

**Strateji:** Grid'de sadece thumbnail göster, high-res yükleme yok

**Neden?**
- Grid Density: 12-20+ item aynı anda görünür
- Memory: 20x 10MB = 200MB+ (kabul edilemez)
- CPU: Decode işlemi çok maliyetli
- UX: Grid'de preview yeterli, detay sayfası yok

**Implementasyon:** `MediaGridItem` component, sadece thumbnail URI

### Prefetch & Cache Stratejisi

**Prefetch:**
- Feed: İlk 5 post'un media'sı (thumbnail HIGH priority, full image NORMAL)
- Search: Viewport'taki ilk 12 item'ın thumbnail'leri (HIGH priority)

**Cache (react-native-fast-image):**
- Memory Cache: RAM'de decoded images
- Disk Cache: Persistent storage
- Cache Modes: `immutable` (default), `web`, `cacheOnly`
- Priority: HIGH (thumbnails), NORMAL (full images)

---

## 🎥 Video & Performans Optimizasyonları

### Video Davranışı

**Autoplay & Auto-pause:**
- `useMediaPlayerVisibility` hook ile viewport tracking (50% threshold)
- Viewport'ta değilse otomatik pause
- Error fallback: Video yüklenemezse thumbnail gösterimi
- Grid'de autoplay (Instagram/TikTok benzeri UX)

**Video Performance:**
- Buffer configuration: 15-50s buffer, 2.5s playback buffer
- `aggressiveMemoryMode: true` → Background memory release
- Native video player (hardware acceleration)

### Performans Optimizasyonları

**FlatList:**
- Stable key props (`post.id`)
- Memoization: `React.memo`, `useCallback`, `useMemo`
- Infinite scroll pagination

**Memory & CPU:**
- FastImage native decode (UI thread'i block etmez)
- Viewport dışındaki videolar unmount (virtualizasyon)
- Lazy loading: Sadece görünür item'lar yüklenir
- `react-native-reanimated` → UI thread'de 60 FPS animations

**Android Debug vs Release:**
- Debug mode: FPS drop normal (30-40 FPS) - Metro bundler overhead
- Release mode: 60 FPS smooth - Hermes optimizations, minification
- **Not:** Release build'de test edilmelidir

---

## 🔐 Authentication & Secure Storage

**Authentication Flow:**
1. User login → `useLogin` hook → RTK Query mutation
2. Mock auth (her input başarılı) → `authService.login()`
3. Refresh token Keychain'de saklanır (`secureStorageService`)
4. Access token Redux state'te (memory-only)
5. Navigation → Feed screen

**Session Management:**
- App açılışında `checkAuth` query → Keychain'den token okuma
- Token varsa → Session restore, Feed screen
- Token yoksa → Login screen

**Secure Storage (react-native-keychain):**
- iOS: Keychain Services (encrypted, hardware-backed)
- Android: Keystore (hardware-backed encryption)
- Access token: Memory-only (Redux state)
- Refresh token: Secure storage (Keychain)

---

## 🧪 Test, Lint, TypeScript & SonarQube

### Test Coverage (≥80%)

**Jest + React Native Testing Library:**
- Component, hook, service tests
- Coverage threshold: branches, functions, lines, statements ≥80%

```bash
npm test                    # Test çalıştır
npm test -- --coverage     # Coverage raporu
```

### ESLint & TypeScript

- ESLint: `@react-native/eslint-config`, TypeScript-aware rules
- TypeScript: Strict mode (`strict: true`, `noImplicitAny`, `strictNullChecks`)

```bash
npm run lint                # Lint check
npx tsc --noEmit           # Type check
```

![Test, Lint & TypeScript Check Results](./documents/test-lint-tsc-check.png)

### SonarQube

- Configuration: `sonar-project.properties`
- Quality gates: Coverage ≥80%, code smells, security vulnerabilities
- LCOV report integration

![SonarQube Analysis Results](./documents/sonarqube.png)

---

## ⚠️ Bilinen Sınırlamalar

### Android Debug Mode Performance

- **FPS Drop**: Debug mode'da FPS düşüklüğü normal (30-40 FPS)
- **Çözüm**: Release build'de test et (`./gradlew assembleRelease`)

### iOS Simulator Limitations

- **Video Playback**: Simulator'da video decode yavaş olabilir
- **Keychain**: Simulator Keychain bazen sync olmayabilir
- **Çözüm**: Real device'da test et

### Network Simulation

- `API_CONFIG.MOCK_DELAY = 500ms` → Gerçek network latency simülasyonu
- **Not**: Production'da gerçek API'ye geçildiğinde bu delay kaldırılmalı

### Image Loading Edge Cases

- 10MB+ images: İlk yüklemede decode süresi uzun olabilir (1-2 saniye)
- Thumbnail strategy ile bu sorun minimize edilir
- **Not**: Production'da CDN + image optimization önerilir

---

## 📧 Teslimat ve İletişim

### Repository

- **Branch**: `main`

### Delivery Checklist

✅ Kod tamamlandı
✅ Test coverage ≥80%
✅ Lint & TypeScript check geçti
✅ SonarQube analizi yapıldı
✅ README dokümantasyonu hazır

---

## 🙏 Teşekkürler

Zamanınız için şimdiden çok teşekkürler!

**Başarılar! 🚀**
