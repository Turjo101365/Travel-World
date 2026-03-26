<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TourPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'price',
        'duration',
        'location',
        'max_participants',
        'image_url',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
