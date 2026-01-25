# Manual Testing Guide

Complete guide for manual testing of the MRF Educational Platform.

---

## [1] Cross-Browser Testing

### Desktop Browsers

#### Chrome (Latest)
- [ ] Homepage loads correctly
- [ ] Navigation works (all links)
- [ ] Forms submit properly
- [ ] Animations smooth
- [ ] Videos play
- [ ] Modals open/close
- [ ] Dark mode toggle works
- [ ] RTL layout correct
- [ ] No console errors

#### Firefox (Latest)
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Forms submit properly
- [ ] Animations smooth
- [ ] Videos play
- [ ] Modals open/close
- [ ] Dark mode toggle works
- [ ] RTL layout correct
- [ ] No console errors

#### Safari (Latest)
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Forms submit properly
- [ ] Animations smooth (check for webkit issues)
- [ ] Videos play
- [ ] Modals open/close
- [ ] Dark mode toggle works
- [ ] RTL layout correct
- [ ] No console errors

#### Edge (Latest)
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Forms submit properly
- [ ] Animations smooth
- [ ] Videos play
- [ ] Modals open/close
- [ ] Dark mode toggle works
- [ ] RTL layout correct
- [ ] No console errors

### Mobile Browsers

#### Safari iOS
- [ ] Homepage loads on iPhone
- [ ] Touch targets work (44x44px)
- [ ] Swipe gestures work
- [ ] Forms work with iOS keyboard
- [ ] Videos play inline
- [ ] Modals work on mobile
- [ ] Bottom navigation accessible
- [ ] No layout issues
- [ ] No console errors

#### Chrome Android
- [ ] Homepage loads on Android
- [ ] Touch targets work
- [ ] Swipe gestures work
- [ ] Forms work with Android keyboard
- [ ] Videos play
- [ ] Modals work on mobile
- [ ] Bottom navigation accessible
- [ ] No layout issues
- [ ] No console errors

### Browser-Specific Issues to Check

**Safari:**
- [ ] Date inputs work
- [ ] Flexbox layout correct
- [ ] CSS Grid layout correct
- [ ] Backdrop-filter works
- [ ] Smooth scrolling works

**Firefox:**
- [ ] Scrollbar styling
- [ ] Input autofill styling
- [ ] CSS custom properties work

**Edge:**
- [ ] All Chromium features work
- [ ] No legacy Edge issues

---

## [2] Device Testing

### iPhone Testing

#### iPhone SE (Small Screen - 375px)
- [ ] All content visible
- [ ] No horizontal scroll
- [ ] Touch targets accessible
- [ ] Text readable (not too small)
- [ ] Forms usable
- [ ] Navigation works
- [ ] Bottom nav doesn't overlap content

#### iPhone 12/13/14 (Standard - 390px)
- [ ] Layout optimal
- [ ] All features accessible
- [ ] Performance smooth
- [ ] Animations 60fps

#### iPhone 14 Pro Max (Large - 430px)
- [ ] Content scales well
- [ ] No wasted space
- [ ] Optimal use of screen

### Android Testing

#### Small Android (360px)
- [ ] All content visible
- [ ] No horizontal scroll
- [ ] Touch targets work
- [ ] Text readable

#### Standard Android (412px)
- [ ] Layout optimal
- [ ] All features work
- [ ] Performance good

#### Large Android (480px)
- [ ] Content scales well
- [ ] Layout optimized

### Tablet Testing

#### iPad (768px)
- [ ] Desktop or mobile layout?
- [ ] Navigation appropriate
- [ ] Content layout optimal
- [ ] Touch targets sized well

#### iPad Pro (1024px)
- [ ] Desktop layout
- [ ] All features work
- [ ] Content not stretched

#### Android Tablet (800px)
- [ ] Layout appropriate
- [ ] All features work

### Screen Sizes to Test
- [ ] 320px (iPhone SE portrait)
- [ ] 375px (iPhone 12/13 portrait)
- [ ] 390px (iPhone 14 portrait)
- [ ] 430px (iPhone 14 Pro Max portrait)
- [ ] 768px (iPad portrait)
- [ ] 1024px (iPad landscape)
- [ ] 1280px (Desktop)
- [ ] 1920px (Full HD)
- [ ] 2560px (2K)

---

## [3] Keyboard Navigation Testing

### Basic Navigation
- [ ] Tab key moves focus forward
- [ ] Shift+Tab moves focus backward
- [ ] Focus order logical
- [ ] Focus visible on all elements
- [ ] No keyboard traps

### Interactive Elements
- [ ] Buttons activate with Enter/Space
- [ ] Links activate with Enter
- [ ] Dropdowns open with Enter/Space
- [ ] Dropdowns navigate with Arrow keys
- [ ] Modals close with Escape
- [ ] Forms submit with Enter

### Skip Links
- [ ] Skip to main content link visible on focus
- [ ] Skip link works correctly
- [ ] Skip link moves focus to main content

### Keyboard Shortcuts
- [ ] Document all keyboard shortcuts
- [ ] Test each shortcut works
- [ ] No conflicts with browser shortcuts

### Focus Management
- [ ] Focus moves to modal when opened
- [ ] Focus returns when modal closed
- [ ] Focus trapped in modal
- [ ] Focus visible in dropdowns
- [ ] Focus visible in menus

---

## [4] Screen Reader Testing

### NVDA (Windows - Free)

#### Installation
1. Download from https://www.nvaccess.org/
2. Install and restart
3. NVDA starts automatically

#### Testing Checklist
- [ ] Page title announced
- [ ] Headings announced correctly (h1, h2, h3)
- [ ] Landmarks announced (header, nav, main, footer)
- [ ] Links announced with purpose
- [ ] Buttons announced with label
- [ ] Form labels announced
- [ ] Error messages announced
- [ ] Success messages announced
- [ ] Images have alt text
- [ ] Decorative images ignored (alt="")
- [ ] Tables have proper headers
- [ ] Lists announced correctly

### JAWS (Windows - Paid)

#### Testing Checklist
- [ ] Same as NVDA checklist
- [ ] Test with virtual cursor
- [ ] Test forms mode
- [ ] Test table navigation

### VoiceOver (Mac/iOS - Built-in)

#### Mac Testing
1. Enable: System Preferences > Accessibility > VoiceOver
2. Shortcut: Cmd+F5

#### Testing Checklist
- [ ] Page title announced
- [ ] Headings navigation works (VO+Cmd+H)
- [ ] Landmarks navigation works
- [ ] Links announced
- [ ] Buttons announced
- [ ] Forms work correctly
- [ ] Rotor navigation works
- [ ] Arabic content read correctly (RTL)

#### iOS Testing
1. Enable: Settings > Accessibility > VoiceOver
2. Triple-click home button

#### Testing Checklist
- [ ] Touch exploration works
- [ ] Swipe navigation works
- [ ] Double-tap activates
- [ ] Forms accessible
- [ ] Arabic content read correctly

### Common Issues to Check
- [ ] Missing alt text on images
- [ ] Missing form labels
- [ ] Poor heading hierarchy
- [ ] Missing ARIA labels
- [ ] Incorrect ARIA roles
- [ ] Missing landmark regions
- [ ] Poor link text ("click here")
- [ ] Missing error announcements
- [ ] Missing live regions for dynamic content

---

## [5] Accessibility Testing

### Color Contrast
Tool: https://webaim.org/resources/contrastchecker/

- [ ] Body text: 4.5:1 minimum (WCAG AA)
- [ ] Large text (18pt+): 3:1 minimum
- [ ] UI components: 3:1 minimum
- [ ] Badges: 4.5:1 minimum
- [ ] Links: 4.5:1 minimum
- [ ] Buttons: 4.5:1 minimum
- [ ] Test in dark mode too

### Touch Targets
- [ ] All buttons: 44x44px minimum
- [ ] All links: 44x44px minimum
- [ ] All icons: 44x44px minimum
- [ ] Form controls: 44x44px minimum
- [ ] Adequate spacing between targets

### Focus Indicators
- [ ] All interactive elements have focus indicator
- [ ] Focus indicator visible (2px minimum)
- [ ] Focus indicator high contrast
- [ ] Focus indicator not hidden

### Forms
- [ ] All inputs have labels
- [ ] Labels properly associated (for/id)
- [ ] Required fields marked
- [ ] Error messages clear
- [ ] Error messages announced
- [ ] Success feedback provided

---

## [6] Performance Testing

### Page Load
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.8s
- [ ] Total Blocking Time < 300ms
- [ ] Cumulative Layout Shift < 0.1

### Runtime Performance
- [ ] Animations 60fps
- [ ] Smooth scrolling
- [ ] No janky interactions
- [ ] Fast button responses
- [ ] Quick page transitions

### Network Conditions
Test on:
- [ ] Fast 3G
- [ ] Slow 3G
- [ ] Offline (service worker)

---

## [7] Visual Regression Testing

### Setup Percy or Chromatic

#### Percy Setup
```bash
npm install --save-dev @percy/cli @percy/playwright
export PERCY_TOKEN=your_token_here
npx percy exec -- playwright test
```

#### Chromatic Setup
```bash
npm install --save-dev chromatic
npx chromatic --project-token=your_token_here
```

### Pages to Capture
- [ ] Homepage (light mode)
- [ ] Homepage (dark mode)
- [ ] Dashboard
- [ ] Lectures page
- [ ] Quiz page
- [ ] Achievements page
- [ ] Leaderboard
- [ ] Profile page
- [ ] Settings page
- [ ] All modals
- [ ] All empty states
- [ ] All error states

### Viewports to Test
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1280px)
- [ ] Large desktop (1920px)

---

## [8] Functional Testing

### Authentication
- [ ] Login works
- [ ] Logout works
- [ ] Session persists
- [ ] Protected routes redirect
- [ ] Token refresh works

### Navigation
- [ ] All links work
- [ ] Back button works
- [ ] Forward button works
- [ ] Breadcrumbs work
- [ ] Mobile menu works
- [ ] Bottom nav works

### Forms
- [ ] All forms submit
- [ ] Validation works
- [ ] Error messages show
- [ ] Success messages show
- [ ] Loading states show

### Gamification
- [ ] XP displays correctly
- [ ] Achievements unlock
- [ ] Leaderboard updates
- [ ] Streaks track correctly
- [ ] Level up animation plays

### Video Player
- [ ] Videos load
- [ ] Play/pause works
- [ ] Volume control works
- [ ] Fullscreen works
- [ ] Progress saves

### Quiz Engine
- [ ] Questions display
- [ ] Answers selectable
- [ ] Submit works
- [ ] Results show
- [ ] Progress saves

---

## [9] Edge Cases

### Empty States
- [ ] No lectures available
- [ ] No quizzes available
- [ ] No achievements yet
- [ ] No leaderboard data
- [ ] No search results

### Error States
- [ ] Network error
- [ ] 404 page
- [ ] 500 error
- [ ] Form validation errors
- [ ] API errors

### Long Content
- [ ] Long names
- [ ] Long descriptions
- [ ] Many items in list
- [ ] Large images
- [ ] Long videos

### Special Characters
- [ ] Arabic text
- [ ] Emojis
- [ ] Special symbols
- [ ] Numbers in Arabic
- [ ] Mixed RTL/LTR

---

## [10] Security Testing

### Input Validation
- [ ] XSS prevention
- [ ] SQL injection prevention
- [ ] CSRF protection
- [ ] Input sanitization

### Authentication
- [ ] Secure token storage
- [ ] Token expiration
- [ ] Secure logout
- [ ] Session management

### Data Protection
- [ ] HTTPS only
- [ ] Secure cookies
- [ ] No sensitive data in URLs
- [ ] No sensitive data in localStorage

---

## Testing Tools

### Browser DevTools
- Chrome DevTools
- Firefox Developer Tools
- Safari Web Inspector

### Accessibility Tools
- axe DevTools (browser extension)
- WAVE (browser extension)
- Lighthouse (Chrome DevTools)
- NVDA (screen reader)
- JAWS (screen reader)
- VoiceOver (screen reader)

### Performance Tools
- Lighthouse
- WebPageTest
- Chrome DevTools Performance tab

### Visual Testing
- Percy
- Chromatic
- BackstopJS

---

## Reporting Issues

### Issue Template
```
Title: [Component] Brief description

Environment:
- Browser: Chrome 120
- OS: Windows 11
- Device: Desktop
- Screen size: 1920x1080

Steps to Reproduce:
1. Go to...
2. Click on...
3. See error

Expected Behavior:
Should do X

Actual Behavior:
Does Y instead

Screenshots:
[Attach screenshots]

Console Errors:
[Paste console errors]

Severity:
- [ ] Critical (blocks usage)
- [ ] High (major feature broken)
- [ ] Medium (minor issue)
- [ ] Low (cosmetic)
```

---

**Status:** All testing checklists complete. Ready for manual testing phase.

