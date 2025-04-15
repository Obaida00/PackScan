<?php

namespace App\Filament\Resources;

use App\Filament\Resources\InvoiceResource\Pages;
use App\Filament\Resources\InvoiceResource\RelationManagers;
use App\Models\Invoice;
use Filament\Forms;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Contracts\Database\Eloquent\Builder;

class InvoiceResource extends Resource
{
    protected static ?string $model = Invoice::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('invoice_id')
                    ->numeric()
                    ->required()
                    ->label('Invoice Number'),
                Select::make('storage_id')
                    ->relationship('storage', 'name')
                    ->required()
                    ->label('Storage'),
                Toggle::make('is_missing')
                    ->label('Is Missing')
                    ->reactive()
                    ->afterStateUpdated(function (callable $set, $state) {
                        if ($state) {
                            $set('statement', null);
                            $set('pharmacist', null);
                            $set('date', null);
                            $set('status', null);
                            $set('net_price', null);
                            $set('total_price', null);
                            $set('total_discount', null);
                            $set('balance', null);
                            $set('net_price_in_words', null);
                            $set('deputy_number', null);
                        }
                    }),
                Toggle::make('is_important')
                    ->label('Is Important')
                    ->default(false),
                TextInput::make('statement')
                    ->label('Statement')
                    ->visible(fn($get) => !$get('is_missing')),
                TextInput::make('pharmacist')
                    ->label('Pharmacist')
                    ->required(fn($get) => !$get('is_missing'))
                    ->visible(fn($get) => !$get('is_missing')),
                DatePicker::make('date')
                    ->label('Date')
                    ->required(fn($get) => !$get('is_missing'))
                    ->visible(fn($get) => !$get('is_missing')),
                Select::make('status')
                    ->options([
                        'Pending' => 'Pending',
                        'In Progress' => 'InProgress',
                        'Done' => 'Done',
                        'Sent' => 'Sent',
                    ])
                    ->default('Pending')
                    ->label('Status')
                    ->required(fn($get) => !$get('is_missing'))
                    ->visible(fn($get) => !$get('is_missing')),
                TextInput::make('net_price')
                    ->numeric()
                    ->label('Net Price')
                    ->required(fn($get) => !$get('is_missing'))
                    ->visible(fn($get) => !$get('is_missing')),
                Placeholder::make('number_of_items')
                    ->label('Number of Items')
                    ->content(function ($record) {
                        return $record ? $record->invoiceItems->count() : 0;
                    }),
                TextInput::make('total_price')
                    ->numeric()
                    ->label('Total Price')
                    ->required(fn($get) => !$get('is_missing'))
                    ->visible(fn($get) => !$get('is_missing')),
                TextInput::make('total_discount')
                    ->numeric()
                    ->label('Total Discount')
                    ->required(fn($get) => !$get('is_missing'))
                    ->visible(fn($get) => !$get('is_missing')),
                TextInput::make('balance')
                    ->numeric()
                    ->label('Balance')
                    ->required(fn($get) => !$get('is_missing'))
                    ->visible(fn($get) => !$get('is_missing')),
                TextInput::make('net_price_in_words')
                    ->label('Net Price in Words')
                    ->required(fn($get) => !$get('is_missing'))
                    ->visible(fn($get) => !$get('is_missing')),
                TextInput::make('deputy_number')
                    ->numeric()
                    ->label('Deputy Number')
                    ->required(fn($get) => !$get('is_missing'))
                    ->visible(fn($get) => !$get('is_missing')),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('invoice_id')
                    ->label('Invoice Number')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('storage.name')
                    ->label('Storage')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('status')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('date')
                    ->sortable(),
                TextColumn::make('total_price')
                    ->sortable(),
                TextColumn::make('net_price')
                    ->sortable(),
                TextColumn::make('number_of_items')
                    ->label('Number of Items')
                    ->sortable(),
                IconColumn::make('is_missing')
                    ->boolean()
                    ->label('Missing'),
                IconColumn::make('is_important')
                    ->boolean()
                    ->label('Important'),
            ])
            ->modifyQueryUsing(function (Builder $query) {
                return $query->withCount('invoiceItems');
            })
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'Pending' => 'Pending',
                        'In Progress' => 'InProgress',
                        'Done' => 'Done',
                        'Sent' => 'Sent',
                    ])
                    ->label('Status'),
                SelectFilter::make('storage')
                    ->relationship('storage', 'name')
                    ->label('Storage'),
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
            RelationManagers\InvoiceItemsRelationManager::class
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListInvoices::route('/'),
            'create' => Pages\CreateInvoice::route('/create'),
            'edit' => Pages\EditInvoice::route('/{record}/edit'),
        ];
    }
}
