$users = DB::table('users')->whereNotNull('avatar')->where('avatar', '!=', '')->get();
foreach ($users as $u) {
  $path = storage_path('app/public/' . $u->avatar);
  if (!file_exists($path)) {
    echo $u->id . ' ' . $u->email . ' ' . $u->avatar . "\n";
  }
}
