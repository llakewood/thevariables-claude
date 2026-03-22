<?php
/**
 * Booking API Configuration
 *
 * Copy this file to config.php and fill in your values.
 * NEVER commit config.php — it contains secrets.
 *
 * Setup instructions:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a project (or use existing)
 * 3. Enable "Google Calendar API"
 * 4. Go to IAM & Admin > Service Accounts
 * 5. Create a service account (no special roles needed)
 * 6. Create a JSON key for the service account — download it
 * 7. Place the JSON key file in this api/ directory (e.g., service-account.json)
 * 8. In Google Calendar, share your calendar with the service account email
 *    (found in the JSON key file as "client_email") — give it "Make changes to events" permission
 * 9. Copy your Google Calendar ID from Calendar Settings > Integrate calendar
 *    (for your primary calendar, this is usually your Gmail address)
 */

// Path to Google service account JSON key file
define('GOOGLE_SERVICE_ACCOUNT_KEY', __DIR__ . '/service-account.json');

// Google Calendar ID (usually your email for primary calendar)
define('GOOGLE_CALENDAR_ID', 'your-email@gmail.com');
