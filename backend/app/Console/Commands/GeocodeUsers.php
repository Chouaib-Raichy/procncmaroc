<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Http\Controllers\AuthController;
use Illuminate\Console\Command;

class GeocodeUsers extends Command
{
    protected $signature = 'app:geocode-users {--force : Re-geocode users that already have coordinates}';
    protected $description = 'Geocode existing users with business_location but no coordinates';

    public function handle()
    {
        $query = User::whereNotNull('business_location');
        if (!$this->option('force')) {
            $query->whereNull('latitude');
        }
        $users = $query->get();

        $bar = $this->output->createProgressBar(count($users));
        $bar->start();

        foreach ($users as $user) {
            $coords = AuthController::geocode($user->business_location, $user->city, $user->country);
            if ($coords['lat'] && $coords['lng']) {
                $user->updateQuietly(['latitude' => $coords['lat'], 'longitude' => $coords['lng']]);
                $this->newLine();
                $this->info("  {$user->name}: {$coords['lat']}, {$coords['lng']}");
            }
            $bar->advance();
            usleep(500000);
        }

        $bar->finish();
        $this->newLine();
        $this->info('Done!');
    }
}
