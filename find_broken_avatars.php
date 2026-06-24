<?php
require '/var/www/procncmaroc/backend/vendor/autoload.php';
$capsule = new Illuminate\Database\Capsule\Manager;
$capsule->addConnection(require '/var/www/procncmaroc/backend/config/database.php');
$capsule->setAsGlobal();
$users = $capsule->table('users')->whereNotNull('avatar')->where('avatar', '!=', '')->get();
foreach ($users as $u) {
  $path = '/var/www/procncmaroc/backend/storage/app/public/' . $u->avatar;
  if (!file_exists($path)) { echo $u->id . ' ' . $u->email . ' ' . $u->avatar . PHP_EOL; }
}
