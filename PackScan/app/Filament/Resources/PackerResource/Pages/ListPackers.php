<?php

namespace App\Filament\Resources\PackerResource\Pages;

use App\Filament\Resources\PackerResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPackers extends ListRecords
{
    protected static string $resource = PackerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
