// Shared by dashboard/page.js and dashboard/inquiries/page.js — both window
// their main inquiries query the same way (limit(windowSize), "Load older"
// widens it and re-subscribes; new docs are always newest, so they stay
// inside the window and onSnapshot keeps updating live). Each page still
// owns its own windowSize state and query shape (admin/owner/cross-partner
// differ), just the starting size is shared so they don't silently drift.
export const INQUIRIES_WINDOW_SIZE = 200;
