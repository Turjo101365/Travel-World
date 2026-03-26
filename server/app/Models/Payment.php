<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'tour_guide_id',
        'transaction_id',
        'amount',
        'currency',
        'days',
        'card_holder_name',
        'card_brand',
        'card_last_four',
        'status',
        'paid_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'days' => 'integer',
        'paid_at' => 'datetime',
    ];

    /**
     * Payment belongs to an user.
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Payment belongs to a tour guide.
     *
     * @return BelongsTo
     */
    public function guide(): BelongsTo
    {
        return $this->belongsTo(TourGuide::class, 'tour_guide_id');
    }
}
