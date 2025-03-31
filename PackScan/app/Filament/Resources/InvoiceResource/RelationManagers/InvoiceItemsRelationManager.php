<?php

namespace App\Filament\Resources\InvoiceResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class InvoiceItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'invoiceItems';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('product_id')
                    ->relationship('product', 'name') // Assumes Product has a 'name' field
                    ->required()
                    ->label('Product'),
                TextInput::make('description')
                    ->label('Description')
                    ->nullable(),
                TextInput::make('quantity')
                    ->numeric()
                    ->default(0)
                    ->label('Quantity')
                    ->afterStateUpdated(function (callable $set, $state, $get) {
                        $unitPrice = $get('unit_price');
                        if ($unitPrice && $unitPrice != -1 && $state != -1) {
                            $set('total_price', $state * $unitPrice);
                        }
                    }),
                TextInput::make('gifted_quantity')
                    ->numeric()
                    ->default(0)
                    ->label('Gifted Quantity'),
                TextInput::make('total_count')
                    ->numeric()
                    ->default(0)
                    ->label('Total Count'),
                TextInput::make('total_price')
                    ->numeric()
                    ->default(0)
                    ->label('Total Price')
                    ->readOnly(),
                TextInput::make('public_price')
                    ->numeric()
                    ->default(0)
                    ->label('Public Price'),
                TextInput::make('unit_price')
                    ->numeric()
                    ->default(0)
                    ->label('Unit Price')
                    ->afterStateUpdated(function (callable $set, $state, $get) {
                        $quantity = $get('quantity');
                        if ($quantity && $quantity != -1 && $state != -1) {
                            $set('total_price', $quantity * $state);
                        }
                    }),
                TextInput::make('discount')
                    ->numeric()
                    ->default(0)
                    ->label('Discount'),
                TextInput::make('current_count')
                    ->numeric()
                    ->default(0)
                    ->label('Current Count'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('product.name')
                    ->label('Product')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('quantity')
                    ->label('Quantity'),
                Tables\Columns\TextColumn::make('unit_price')
                    ->label('Unit Price'),
                Tables\Columns\TextColumn::make('total_price')
                    ->label('Total Price'),
                Tables\Columns\TextColumn::make('discount')
                    ->label('Discount'),
            ])
            ->filters([])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
