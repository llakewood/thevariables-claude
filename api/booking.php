<?php
/**
 * Booking API — The Variables Co.
 *
 * GET  ?date=YYYY-MM-DD  → returns booked time slots for that date
 * POST {date, time, name, email, notes} → creates a Google Calendar event
 */

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

// Only allow requests from same origin
$allowed_origin = 'https://thevariables.com';
if (isset($_SERVER['HTTP_ORIGIN'])) {
    if ($_SERVER['HTTP_ORIGIN'] === $allowed_origin) {
        header('Access-Control-Allow-Origin: ' . $allowed_origin);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, POST');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

// Load config
$config_path = __DIR__ . '/config.php';
if (!file_exists($config_path)) {
    json_response(false, 'Booking system not configured', 500);
}
require_once $config_path;

// Availability rules (same as frontend)
define('SLOT_DURATION', 20);
define('TIMEZONE', 'America/Toronto');
define('WEEKS_AHEAD', 2);

$availability = [
    1 => [['start' => '09:00', 'end' => '12:00'], ['start' => '15:30', 'end' => '16:15']], // Monday
    2 => [['start' => '15:30', 'end' => '16:15']], // Tuesday
    3 => [['start' => '15:30', 'end' => '16:15']], // Wednesday
    4 => [['start' => '15:30', 'end' => '16:15']], // Thursday
    5 => [['start' => '15:30', 'end' => '16:15']], // Friday
];

// Route
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    handle_get($availability);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    handle_post($availability);
} else {
    json_response(false, 'Method not allowed', 405);
}

// --- Handlers ---

function handle_get(array $availability): void {
    $date = $_GET['date'] ?? '';
    if (!validate_date($date)) {
        json_response(false, 'Invalid date', 400);
    }

    $booked = get_booked_slots($date);
    json_response(true, null, 200, ['booked' => $booked]);
}

function handle_post(array $availability): void {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        json_response(false, 'Invalid request body', 400);
    }

    $date  = $input['date'] ?? '';
    $time  = $input['time'] ?? '';
    $name  = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $notes = trim($input['notes'] ?? '');

    // Validate
    if (!validate_date($date)) {
        json_response(false, 'Invalid date', 400);
    }
    if (!preg_match('/^\d{2}:\d{2}$/', $time)) {
        json_response(false, 'Invalid time', 400);
    }
    if (empty($name) || strlen($name) > 200) {
        json_response(false, 'Name is required', 400);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        json_response(false, 'Valid email is required', 400);
    }
    if (strlen($notes) > 2000) {
        json_response(false, 'Notes too long', 400);
    }

    // Check the slot is valid for the given day
    $dow = (int)date('w', strtotime($date));
    if (!isset($availability[$dow])) {
        json_response(false, 'No availability on this day', 400);
    }

    $valid_slot = false;
    foreach ($availability[$dow] as $window) {
        $slots = generate_window_slots($window['start'], $window['end']);
        if (in_array($time, $slots, true)) {
            $valid_slot = true;
            break;
        }
    }
    if (!$valid_slot) {
        json_response(false, 'Invalid time slot', 400);
    }

    // Check slot isn't in the past
    $tz = new DateTimeZone(TIMEZONE);
    $now = new DateTime('now', $tz);
    $slot_dt = new DateTime($date . ' ' . $time, $tz);
    if ($slot_dt <= $now) {
        json_response(false, 'This time slot has passed', 400);
    }

    // Check slot isn't already booked
    $booked = get_booked_slots($date);
    if (in_array($time, $booked, true)) {
        json_response(false, 'This time slot is no longer available', 409);
    }

    // Create calendar event
    $end_minutes = time_to_minutes($time) + SLOT_DURATION;
    $end_time = sprintf('%02d:%02d', intdiv($end_minutes, 60), $end_minutes % 60);

    $event = create_calendar_event([
        'summary'     => "Discovery Call — {$name}",
        'description' => "Name: {$name}\nEmail: {$email}" . ($notes ? "\nNotes: {$notes}" : ''),
        'date'        => $date,
        'start_time'  => $time,
        'end_time'    => $end_time,
        'attendee'    => $email,
    ]);

    if (!$event) {
        json_response(false, 'Failed to create booking. Please try again.', 500);
    }

    // Send confirmation email to booker
    send_confirmation_email($email, $name, $date, $time, $end_time);

    json_response(true, null, 200, ['event_id' => $event['id'] ?? null]);
}

// --- Google Calendar ---

function get_access_token(): ?string {
    $key_file = GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!file_exists($key_file)) {
        error_log('Booking: Service account key file not found');
        return null;
    }

    $key_data = json_decode(file_get_contents($key_file), true);
    if (!$key_data) {
        error_log('Booking: Invalid service account key file');
        return null;
    }

    // Build JWT
    $header = base64url_encode(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
    $now = time();
    $claims = base64url_encode(json_encode([
        'iss'   => $key_data['client_email'],
        'scope' => 'https://www.googleapis.com/auth/calendar',
        'aud'   => 'https://oauth2.googleapis.com/token',
        'iat'   => $now,
        'exp'   => $now + 3600,
    ]));

    $signing_input = "{$header}.{$claims}";
    $signature = '';
    $private_key = openssl_pkey_get_private($key_data['private_key']);
    if (!$private_key) {
        error_log('Booking: Failed to parse private key');
        return null;
    }
    openssl_sign($signing_input, $signature, $private_key, OPENSSL_ALGO_SHA256);
    $jwt = $signing_input . '.' . base64url_encode($signature);

    // Exchange JWT for access token
    $ch = curl_init('https://oauth2.googleapis.com/token');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion'  => $jwt,
        ]),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
    ]);
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code !== 200) {
        error_log('Booking: Token exchange failed: ' . $response);
        return null;
    }

    $token_data = json_decode($response, true);
    return $token_data['access_token'] ?? null;
}

function get_booked_slots(string $date): array {
    $token = get_access_token();
    if (!$token) return [];

    $tz = new DateTimeZone(TIMEZONE);
    $start = new DateTime($date . 'T00:00:00', $tz);
    $end = new DateTime($date . 'T23:59:59', $tz);

    $params = http_build_query([
        'timeMin'      => $start->format('c'),
        'timeMax'      => $end->format('c'),
        'singleEvents' => 'true',
        'orderBy'      => 'startTime',
    ]);

    $calendar_id = urlencode(GOOGLE_CALENDAR_ID);
    $url = "https://www.googleapis.com/calendar/v3/calendars/{$calendar_id}/events?{$params}";

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_HTTPHEADER     => ["Authorization: Bearer {$token}"],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
    ]);
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code !== 200) {
        error_log("Booking: Failed to fetch events (HTTP {$http_code}): {$response}");
        return [];
    }

    $data = json_decode($response, true);
    $events = $data['items'] ?? [];

    $booked = [];
    foreach ($events as $event) {
        $event_start = $event['start']['dateTime'] ?? null;
        if (!$event_start) continue;

        $dt = new DateTime($event_start);
        $dt->setTimezone($tz);
        $booked[] = $dt->format('H:i');
    }

    return $booked;
}

function create_calendar_event(array $params): ?array {
    $token = get_access_token();
    if (!$token) return null;

    $tz = new DateTimeZone(TIMEZONE);
    $start_dt = new DateTime("{$params['date']}T{$params['start_time']}:00", $tz);
    $end_dt = new DateTime("{$params['date']}T{$params['end_time']}:00", $tz);

    $event_body = [
        'summary'     => $params['summary'],
        'description' => $params['description'],
        'start'       => [
            'dateTime' => $start_dt->format('c'),
            'timeZone' => TIMEZONE,
        ],
        'end'         => [
            'dateTime' => $end_dt->format('c'),
            'timeZone' => TIMEZONE,
        ],
        'reminders'   => [
            'useDefault' => false,
            'overrides'  => [
                ['method' => 'email', 'minutes' => 60],
                ['method' => 'popup', 'minutes' => 10],
            ],
        ],
    ];

    $calendar_id = urlencode(GOOGLE_CALENDAR_ID);
    $url = "https://www.googleapis.com/calendar/v3/calendars/{$calendar_id}/events";

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($event_body),
        CURLOPT_HTTPHEADER     => [
            "Authorization: Bearer {$token}",
            'Content-Type: application/json',
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
    ]);
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($http_code < 200 || $http_code >= 300) {
        error_log("Booking: Failed to create event (HTTP {$http_code}): {$response}");
        return null;
    }

    return json_decode($response, true);
}

// --- Email ---

function send_confirmation_email(string $to, string $name, string $date, string $start, string $end): void {
    $tz = new DateTimeZone(TIMEZONE);
    $dt = new DateTime("{$date}T{$start}:00", $tz);
    $friendly_date = $dt->format('l, F j, Y');
    $friendly_start = $dt->format('g:i A');
    $end_dt = new DateTime("{$date}T{$end}:00", $tz);
    $friendly_end = $end_dt->format('g:i A T');

    $subject = "Your Discovery Call with The Variables Co. — {$friendly_date}";

    $body = "Hi {$name},\n\n"
        . "Your discovery call is confirmed!\n\n"
        . "Date: {$friendly_date}\n"
        . "Time: {$friendly_start} – {$friendly_end}\n"
        . "Duration: " . SLOT_DURATION . " minutes\n\n"
        . "We'll follow up with a meeting link or phone number before your call.\n\n"
        . "If you need to reschedule, please reply to this email.\n\n"
        . "Looking forward to speaking with you!\n\n"
        . "— The Variables Co.\n"
        . "https://thevariables.com\n";

    $headers = implode("\r\n", [
        'From: The Variables Co. <les.lakewood@gmail.com>',
        'Reply-To: no-reply@thevariables.com',
        'Content-Type: text/plain; charset=UTF-8',
    ]);

    $sent = mail($to, $subject, $body, $headers);
    if (!$sent) {
        error_log("Booking: Failed to send confirmation email to {$to}");
    }
}

// --- Helpers ---

function validate_date(string $date): bool {
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) return false;

    $tz = new DateTimeZone(TIMEZONE);
    $dt = DateTime::createFromFormat('Y-m-d', $date, $tz);
    if (!$dt || $dt->format('Y-m-d') !== $date) return false;

    $today = new DateTime('today', $tz);
    $max = new DateTime('+' . WEEKS_AHEAD . ' weeks', $tz);

    return $dt >= $today && $dt <= $max;
}

function generate_window_slots(string $start, string $end): array {
    $start_min = time_to_minutes($start);
    $end_min = time_to_minutes($end);
    $slots = [];
    for ($m = $start_min; $m + SLOT_DURATION <= $end_min; $m += SLOT_DURATION) {
        $slots[] = sprintf('%02d:%02d', intdiv($m, 60), $m % 60);
    }
    return $slots;
}

function time_to_minutes(string $time): int {
    [$h, $m] = explode(':', $time);
    return (int)$h * 60 + (int)$m;
}

function base64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function json_response(bool $success, ?string $error = null, int $code = 200, array $extra = []): void {
    http_response_code($code);
    $response = ['success' => $success];
    if ($error) $response['error'] = $error;
    echo json_encode(array_merge($response, $extra));
    exit;
}
