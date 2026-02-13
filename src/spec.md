# Specification

## Summary
**Goal:** Use the AABoxes logo’s primary pink as the background color across all non-Home pages to eliminate unintended black backgrounds.

**Planned changes:**
- Sample the primary pink color directly from the provided AABoxes logo screenshot (image-12.png) and define it as a single reusable theme token in frontend styling.
- Apply this AABoxes pink background on every route except Home (“Inicio”) at `/`, which must keep its current background behavior.
- Ensure admin routes (e.g., `/admin/login`, `/admin`) and other non-Home pages no longer show any black page background.

**User-visible outcome:** All pages other than Home display the AABoxes pink page background (including admin pages), while Home remains unchanged and no route shows an unintended black background.
