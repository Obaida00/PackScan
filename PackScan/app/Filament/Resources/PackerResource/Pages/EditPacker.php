<?php

namespace App\Filament\Resources\PackerResource\Pages;

use App\Filament\Resources\PackerResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPacker extends EditRecord
{
    protected static string $resource = PackerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
