# Gas Delivery Platform - Mobile Design Guidelines

## Authentication & Onboarding

**Auth Method:** Email + Password (Django JWT), Social sign-in (Apple/Google)

**Flow:** Splash → Welcome → Registration (role selection: Client/Livreur/Station) → Email verification → Phone verification (Livreur/Station only)

**Auth Screens:**
- Login: Email, password, "Mot de passe oublié" link
- Registration: Role picker (radio buttons with icons), form fields
- Password reset: Email input → confirmation
- Profile: Logout (confirm: "Êtes-vous sûr?"), Delete account (double confirmation)

## Navigation Architecture

**CLIENT** - Bottom Tabs (4):
- Accueil (Home) | Panier (Cart with badge) | Commandes | Profil

**LIVREUR** - Bottom Tabs (4):
- Bouteilles | Livraisons (badge + header toggle: Disponible/Indisponible) | Statistiques | Profil

**STATION** - Bottom Tabs (5):
- Catalogue | **Ajouter (center)** | Commandes (badge) | Livreurs | Profil

**ADMIN** - Drawer:
- Dashboard, Utilisateurs, Stations, Bouteilles, Commandes, Paiements, Zones, Rapports, Paramètres

## Screen Layout Patterns

### Insets & Root Views
- **Transparent header:** Top inset = headerHeight + 24dp, ScrollView
- **Default header:** Top inset = 24dp, ScrollView/FlatList
- **Bottom inset:** tabBarHeight + 24dp (all tabbed screens)

### Key Screens

**CLIENT - Accueil:**
- Transparent header, search bar, notification bell
- Horizontal filter chips, 2-column bottle grid
- Floating filter button (bottom-right, 16dp + tabBarHeight)

**CLIENT - Panier:**
- Cart items (swipe delete), address selector with map, zone/price calc, total summary
- "Passer au paiement" sticky bottom

**CLIENT - Paiement:**
- Scrollable form: Order summary (collapsed), payment method (radio cards), form fields
- Success: Full-screen modal, checkmark animation, order number

**LIVREUR - Livraisons:**
- FlatList with pull-refresh, availability toggle in header
- Active delivery: Expanded card with map, "Appeler client", status buttons

**STATION - Catalogue:**
- FlatList, stock progress bars, quick edit button
- FAB "+" (bottom-right with shadow)

**STATION - Ajouter/Modifier:**
- Form: Image picker (square), inputs (nom, marque, prix, stock), type dropdown
- "Annuler" (left header) | "Enregistrer" (right header)

## Design System

### Colors

**Primary (Gas Blue):**
- 500: `#1976D2` | 600: `#1565C0` (pressed) | 100: `#BBDEFB` (bg)

**Secondary (Energy Orange):**
- 500: `#FF9800` | 600: `#F57C00`

**Status:**
- Success: `#4CAF50` | Warning: `#FFA726` | Info: `#29B6F6` | Active: `#66BB6A` | Error: `#EF5350`

**Neutral:**
- Background: `#F5F7FA` | Surface: `#FFFFFF` | Text Primary: `#1A1A1A` | Text Secondary: `#616161` | Border: `#E0E0E0`

**Role Accents:**
- Client: `#1976D2` | Livreur: `#00C853` | Station: `#6200EA` | Admin: `#D32F2F`

### Typography (System: SF Pro/Roboto)
- Hero: 32sp Bold | H1: 24sp Bold | H2: 20sp Semibold | H3: 18sp Semibold
- Body Large: 16sp Regular | Body: 14sp Regular | Caption: 12sp Regular | Button: 16sp Semibold

### Spacing
xs: 4dp | sm: 8dp | md: 12dp | lg: 16dp | xl: 24dp | xxl: 32dp

### Components

**Bottle Card (Grid):**
- Width: (screen - 48dp) / 2, image 16:9 (8dp radius), padding 12dp, border 1dp
- Press: Scale 0.98, opacity 0.7

**Bottle Card (List - Livreur):**
- Full width horizontal, image 80x80dp (8dp radius), shadow
- Press: Background → Primary 100

**Primary Button:**
- Height 48dp, radius 8dp, background Primary 500, white text (Button size)
- Press: Primary 600, scale 0.98, icon spacing 8dp

**FAB:**
- 56x56dp circle (radius 28dp), Secondary 500, white icon 24dp
- Shadow: offset (0,2), opacity 0.10, radius 2
- Press: Scale 0.95, Secondary 600

**Status Badge:**
- Height 24dp, padding 8dp horizontal, radius 12dp
- Background: Status @ 20% opacity, text: Caption Semibold (darker status color)

**Tab Bar:**
- Height: 56dp + insets.bottom, white surface, icons 24dp, Caption labels
- Active: Role accent | Inactive: Text Secondary

**Forms:**
- Input: 48dp height, 1dp border (focus: Primary 500 2dp), 8dp radius
- Label: Caption, Text Secondary (above), Error: Caption, Error color (below)

### Visual Rules

**Icons:** Feather (@expo/vector-icons), 20dp (inline) | 24dp (standalone) | 32dp (featured), **no emojis**

**Images:** Products 16:9, Avatars circular (40dp small, 80dp large), Placeholder: gray + icon

**Maps:** 12dp radius (cards), 0dp (fullscreen), role-specific marker colors, blue pulse for user

**Touch Feedback:**
- Cards: Opacity 0.7 | Buttons: Color change + scale 0.98 | Lists: Primary 100 overlay | Icons: Opacity 0.6 | FAB: Shadow + scale 0.95

### Accessibility

**Touch Targets:** Min 44dp (iOS) / 48dp (Android), 8dp spacing between
**Contrast:** Text 4.5:1 ratio, status badges readable
**Screen Readers:** Alt text (commercial names), form labels, descriptive buttons
**Language:** French primary, support RTL, no hardcoded text

## Critical Assets

**App Icon:** Gas bottle + delivery theme (blue/orange gradient)
**Splash:** Logo + "GazExpress" wordmark
**Empty States:** Cart (shopping bag), Orders (truck), Search (magnifying glass)
**Bottle Types:** 6kg, 12kg, 15kg silhouettes
**Onboarding:** Browse (grid), Track (map route), Delivery (truck) - 3 slides
**Role Icons:** Client (user + bag), Livreur (helmet), Station (pump/building)
**User Content:** Profile avatars (upload or 6 preset geometric patterns), station logos, bottle photos

## Animations

- **Transitions:** Slide right (iOS), fade + slide up (Android)
- **Modals:** Slide up 300ms ease-out
- **Loading:** Skeleton shimmer (no spinners)
- **Status:** Color 200ms, checkmark scale
- **Maps:** Camera 500ms smooth focus
- **Refresh:** Standard platform pull-to-refresh

---

**Token Count:** ~1,950 tokens | **Preserved:** All core rules, code specs, accessibility, colors, typography, role-specific navigation, critical screen layouts, component measurements, animations, asset requirements