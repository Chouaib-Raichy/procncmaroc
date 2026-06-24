<?php
require '/var/www/procncmaroc/backend/vendor/autoload.php';
$app = require_once '/var/www/procncmaroc/backend/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$users = DB::table('users')->whereNotNull('avatar')->where('avatar', '!=', '')->get();
foreach ($users as $u) {
  $path = storage_path('app/public/' . $u->avatar);
  if (!file_exists($path)) {
    echo 'MISSING id=' . $u->id . ' email=' . $u->email . ' avatar=' . $u->avatar . "\n";
  }
}
echo "DONE\n";
}
echo "DONE\n";
