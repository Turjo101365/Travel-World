<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TourGuide extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'destination_id',
        'name',
        'photo',
        'description',
        'rating',
        'location',
        'experience_years',
        'languages',
        'hire_cost',
        'phone',
        'email',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'destination_id' => 'integer',
        'rating' => 'integer',
        'experience_years' => 'integer',
        'hire_cost' => 'decimal:2',
    ];

    /**
     * Get all payments made for this guide.
     *
     * @return HasMany
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'tour_guide_id');
    }

    /**
     * Get the destination that owns the guide.
     *
     * @return BelongsTo
     */
    public function destination(): BelongsTo
    {
        return $this->belongsTo(TourDestination::class, 'destination_id');
    }
}
