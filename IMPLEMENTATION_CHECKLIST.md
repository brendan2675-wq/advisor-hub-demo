# DASH Advisor Portal - Implementation Verification Checklist

Use this document to verify all features from the original prompt have been implemented.

---

## Core Requirements

### Visual Design
- [ ] Modern fintech aesthetic with clean, professional design
- [ ] Retail mode: Teal accent (#14B8A6)
- [ ] Private mode: Deep navy accent (#1E3A8A)
- [ ] White backgrounds, light gray surfaces, dark text
- [ ] Professional sans-serif typography with clear hierarchy
- [ ] Header + navigation + main content area layout

---

## Feature Checklist

### 1. Global Header with Context Switcher
- [ ] DASH logo/text on the left
- [ ] Dropdown showing: "Retail Clients", "Private Clients", "All Clients"
- [ ] Icons on right: Search, User profile, Help (?)
- [ ] Visual indicator changes based on context (teal vs navy)

### 2. Navigation (Updated to Horizontal Tabs)
- [ ] Tab items: Dashboard, Portfolio, Performance, Gains & Losses, Transactions, Details, Reports
- [ ] Active tab is highlighted
- [ ] Clicking tabs switches content

### 3. Portfolio Holdings Page

**Page Header Controls:**
- [ ] Client selector dropdown with badge (Retail/Private)
- [ ] Date selector for portfolio snapshot
- [ ] Grouping dropdown: Asset Class, Account, GICs
- [ ] View toggle button: Compact View / Detailed View
- [ ] Export button with options: PDF, CSV

**Compact Portfolio Table:**
- [ ] Columns: Name, Code, Units, Price (AUD), Value (AUD), Port%
- [ ] Holdings grouped by Asset Class

**Detailed Portfolio Table:**
- [ ] Additional columns: Cost Base, Avg Unit Cost, Unrealised Gain/Loss ($), Unrealised Gain/Loss (%), Est. Income, Est. Yield
- [ ] Gains colored green, losses colored red

### 4. Onboarding Modal
- [ ] Triggers first time user clicks "Detailed View"
- [ ] Welcome header: "Welcome to Detailed Portfolio View"
- [ ] Brief description with bullet points
- [ ] Two buttons: "Skip Tour" and "Show Me Around"
- [ ] Uses localStorage to remember if user has seen onboarding

### 5. Onboarding Tour (3 Steps)
- [ ] Step 1: Popover pointing to grouping dropdown
- [ ] Step 2: Popover pointing to column header (Unrealised Gains)
- [ ] Step 3: Popover pointing to help icon
- [ ] Each step has: Previous, Next, Done buttons

### 6. Context Switching Visual Feedback
- [ ] Header accent color changes (teal ↔ navy) with smooth transition
- [ ] Toast notification: "Switched to [X] Clients view"
- [ ] Client badge updates (Retail teal vs Private navy)
- [ ] All UI accents change color throughout the page

### 7. Tooltips on Column Headers
- [ ] Cost Base tooltip
- [ ] Unrealised Gains % tooltip
- [ ] Est. Income tooltip
- [ ] Est. Yield tooltip

### 8. Help Panel
- [ ] Opens from (?) icon in header
- [ ] Slides in from right side
- [ ] Quick Reference Guide section
- [ ] Column Definitions section
- [ ] Common Workflows section
- [ ] "Contact Support" button
- [ ] "Was this helpful?" with thumbs up/down
- [ ] Close button (X)

---

## Tab Functionality

### Dashboard Tab
- [ ] Summary cards (Total Value, Unrealised Gain/Loss, Est. Annual Income, Holdings)
- [ ] Asset allocation breakdown
- [ ] Top holdings list

### Performance Tab
- [ ] Performance period selectors
- [ ] Performance by asset class
- [ ] Top/bottom performers

### Gains & Losses Tab
- [ ] Total unrealised gains card
- [ ] Total unrealised losses card
- [ ] Net position card
- [ ] Detailed table with all holdings

### Transactions Tab
- [ ] Transaction history table
- [ ] Transaction type icons/badges
- [ ] Summary cards by transaction type

### Details Tab
- [ ] Client personal information
- [ ] Account information
- [ ] Adviser details

### Reports Tab
- [ ] Report categories
- [ ] Report generation status
- [ ] Recent downloads section

---

## Mock Data

### Client 1: John Smith (Retail)
- [ ] Total portfolio: ~$4,166,250
- [ ] 8-10 holdings across asset classes
- [ ] Australian Equities, Fixed Income, Cash, International Equities

### Client 2: Sarah Chen (Private)
- [ ] Total portfolio: ~$8,425,000
- [ ] Higher values than retail clients

### Client 3: Michael Roberts (Retail)
- [ ] Total portfolio: ~$2,150,000
- [ ] Similar structure to Client 1

### Each Holding Has:
- [ ] Name, code, units, current price, cost base
- [ ] Calculated: value, unrealised gain/loss, unrealised %, estimated income, estimated yield
- [ ] Mix of positive and negative gains

---

## Key Interactions Test

1. [ ] Page loads with compact view by default
2. [ ] Toggle to detailed view shows onboarding modal (first time only)
3. [ ] Complete onboarding tour - all 3 steps work
4. [ ] Refresh page - onboarding doesn't show again
5. [ ] Switch from Retail to Private - colors change, toast appears
6. [ ] Hover on column headers - tooltips appear
7. [ ] Click help icon - panel slides in from right
8. [ ] Change grouping - holdings regroup correctly
9. [ ] Switch clients - data updates
10. [ ] All tabs navigate and display content correctly

---

## Design Tokens (from index.css)

Verify these are used throughout (not hardcoded colors):
- [ ] `--primary` for main accent
- [ ] `--private` for private client mode
- [ ] `--gain` for positive values (green)
- [ ] `--loss` for negative values (red)
- [ ] `--background`, `--foreground`, `--muted`, etc.

---

## Files Created

- `src/context/AppContext.tsx` - Global state management
- `src/data/mockData.ts` - Mock clients and holdings data
- `src/components/layout/Header.tsx` - Global header
- `src/components/layout/ClientHeader.tsx` - Client info + tabs
- `src/components/layout/Toast.tsx` - Toast notifications
- `src/components/holdings/HoldingsHeader.tsx` - Table controls
- `src/components/holdings/HoldingsTable.tsx` - Portfolio table
- `src/components/holdings/PortfolioHero.tsx` - Portfolio value display
- `src/components/holdings/ColumnTooltip.tsx` - Column tooltips
- `src/components/onboarding/OnboardingModal.tsx` - Welcome modal
- `src/components/onboarding/TourPopover.tsx` - Guided tour
- `src/components/help/HelpPanel.tsx` - Help side panel
- `src/components/tabs/DashboardTab.tsx`
- `src/components/tabs/PerformanceTab.tsx`
- `src/components/tabs/GainsLossesTab.tsx`
- `src/components/tabs/TransactionsTab.tsx`
- `src/components/tabs/DetailsTab.tsx`
- `src/components/tabs/ReportsTab.tsx`

---

## Interview Demo Flow

1. Start in compact view: "This is the familiar portfolio view"
2. Toggle to detailed: Show onboarding modal
3. Complete tour: Guide through new features
4. Show tooltips: Hover over column headers
5. Open help panel: Click (?) icon
6. Switch contexts: Retail → Private, note color change + toast
7. Navigate tabs: Show Dashboard, Performance, etc.
