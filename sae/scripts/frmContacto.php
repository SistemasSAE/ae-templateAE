<?php
// Cabeceras CORS (ajusta el dominio si es necesario)
header('Access-Control-Allow-Origin: https://asistescolar.com');
header('Content-Type: application/json; charset=utf-8');

$json = [];

// --- 1. Verificar que llegaron los datos ----------------------
if ( !isset($_POST['g-recaptcha-response']) || !isset($_POST['info']) ) {
    http_response_code(502);
    exit;
}

// --- 2. Verificar reCAPTCHA v3 con Google --------------------
$secretKey    = '6LdAUWgsAAAAAIqDrw19wMmpZB7_ET8Lir5YE011';
$recaptchaRes = $_POST['g-recaptcha-response'];
$scoreMinimo  = 0.5; // Umbral: 0.0 (bot) – 1.0 (humano)

$verify = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret='
    . urlencode($secretKey)
    . '&response='
    . urlencode($recaptchaRes)
);
$captchaData = json_decode($verify, true);

if ( !$captchaData['success'] || $captchaData['score'] < $scoreMinimo || $captchaData['action'] !== 'contacto' ) {
    http_response_code(403);
    $json['data']['success'] = 'recaptcha-fail';
    echo json_encode($json);
    exit;
}

// --- 3. Extraer y sanitizar campos ---------------------------
$info      = (array) json_decode($_POST['info']);

$nombre    = htmlspecialchars(trim($info['txtNombre']   ?? ''), ENT_QUOTES, 'UTF-8');
$email     = filter_var(trim($info['txtEmail']    ?? ''), FILTER_SANITIZE_EMAIL);
$telefono  = htmlspecialchars(trim($info['txtTelefono'] ?? ''), ENT_QUOTES, 'UTF-8');
$empresa   = htmlspecialchars(trim($info['txtEmpresa']  ?? ''), ENT_QUOTES, 'UTF-8');
$rol       = htmlspecialchars(trim($info['txtRol']      ?? ''), ENT_QUOTES, 'UTF-8');
$servicio  = htmlspecialchars(trim($info['txtServicio'] ?? ''), ENT_QUOTES, 'UTF-8');
$estado    = htmlspecialchars(trim($info['txtEstado']   ?? ''), ENT_QUOTES, 'UTF-8');
$ciudad    = htmlspecialchars(trim($info['txtCiudad']   ?? ''), ENT_QUOTES, 'UTF-8');
$mensaje   = htmlspecialchars(trim($info['txtMensaje']  ?? ''), ENT_QUOTES, 'UTF-8');

$correoDestino = 'byc.computacion@gmail.com';

// --- 4. Cargar PHPMailer v5 ----------------------------------
require('../../phpmail/class.phpmailer.php');  // ← ajusta esta ruta
require('../../phpmail/class.smtp.php');        // ← ajusta esta ruta

// --- 5. Configurar y enviar ----------------------------------
$phpmail = new PHPMailer();

$phpmail->Username   = 'no-responder@asistescolar.com';
$phpmail->Password   = 'L=*mop58QT+i';
$phpmail->SMTPSecure = 'ssl';
$phpmail->Host       = 'mail.asistescolar.com';
$phpmail->Port       = 465;
$phpmail->IsSMTP();
$phpmail->SMTPAuth   = true;
$phpmail->CharSet    = 'UTF-8';

$phpmail->setFrom('no-responder@asistescolar.com', 'AsistEscolar');
$phpmail->Subject    = 'CONTACTO - AsistEscolar Principal';
$phpmail->IsHTML(true);

$phpmail->Body  = '<h3 style="color:#333;">AsistEscolar.com — Nuevo Contacto</h3>';
$phpmail->Body .= '<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;">';
$phpmail->Body .= '<tr><td><b>Nombre:</b></td><td>'    . $nombre   . '</td></tr>';
$phpmail->Body .= '<tr><td><b>Email:</b></td><td>'     . $email    . '</td></tr>';
$phpmail->Body .= '<tr><td><b>Teléfono:</b></td><td>'  . $telefono . '</td></tr>';
$phpmail->Body .= '<tr><td><b>Institución:</b></td><td>'. $empresa . '</td></tr>';
$phpmail->Body .= '<tr><td><b>Rol:</b></td><td>'       . $rol      . '</td></tr>';
$phpmail->Body .= '<tr><td><b>Servicio:</b></td><td>'  . $servicio . '</td></tr>';
$phpmail->Body .= '<tr><td><b>Estado:</b></td><td>'    . $estado   . '</td></tr>';
$phpmail->Body .= '<tr><td><b>Ciudad:</b></td><td>'    . $ciudad   . '</td></tr>';
$phpmail->Body .= '</table>';
$phpmail->Body .= '<br><b>Mensaje:</b><br><p style="font-family:Arial;font-size:14px;">' . nl2br($mensaje) . '</p>';
$phpmail->Body .= '<br><hr><small><a href="https://asistescolar.com">asistescolar.com</a></small>';

if (filter_var($correoDestino, FILTER_VALIDATE_EMAIL)) {
    $phpmail->AddAddress($correoDestino);
    if ($phpmail->Send()) {
        $json['data']['success'] = 'exito';
    } else {
        $json['data']['success'] = 'xdebug-error';
    }
} else {
    $json['data']['success'] = 'mail-novalid';
}

echo json_encode($json);
?>