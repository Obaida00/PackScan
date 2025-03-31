<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PackerResource\Pages;
use App\Models\Packer;
use Filament\Forms\Form;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class PackerResource extends Resource
{
    protected static ?string $model = Packer::class;

    protected static ?string $navigationIcon = 'heroicon-o-user';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                    ->required()
                    ->label('Name'),
                Toggle::make('can_manually_submit')
                    ->label('Can Manually Submit')
                    ->default(false),
                Toggle::make('can_submit_important_invoices')
                    ->label('Can Submit Important Invoices')
                    ->default(false),
                Toggle::make('is_invoice_admin')
                    ->label('Is Invoice Admin')
                    ->default(false),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Name')
                    ->sortable()
                    ->searchable(),
                IconColumn::make('can_manually_submit')
                    ->label('Manual Submit')
                    ->boolean(),
                IconColumn::make('can_submit_important_invoices')
                    ->label('Important Invoices')
                    ->boolean(),
                IconColumn::make('is_invoice_admin')
                    ->label('Invoice Admin')
                    ->boolean(),
                TextColumn::make('invoices_count')
                    ->counts('invoices')
                    ->label('Invoices'),
            ])
            ->filters([
                TernaryFilter::make('can_manually_submit')
                    ->label('Can Manually Submit'),
                TernaryFilter::make('can_submit_important_invoices')
                    ->label('Can Submit Important Invoices'),
                TernaryFilter::make('is_invoice_admin')
                    ->label('Is Invoice Admin'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPackers::route('/'),
            'create' => Pages\CreatePacker::route('/create'),
            'edit' => Pages\EditPacker::route('/{record}/edit'),
        ];
    }
}
