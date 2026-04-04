<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TourDestination extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'slug',
        'title',
        'country',
        'city',
        'location_label',
        'image',
        'short_description',
        'description',
        'duration',
        'price',
        'rating',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rating' => 'float',
    ];

    /**
     * Get the guides for the destination.
     *
     * @return HasMany
     */
    public function guides(): HasMany
    {
        return $this->hasMany(TourGuide::class, 'destination_id');
    }
}
