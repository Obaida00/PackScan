<?php

namespace App\Orchid\Screens;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\DropDown;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Actions\ModalToggle;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class InvoiceItemsScreen extends Screen
{
    public $invoice;

    public function query(Invoice $invoice): iterable
    {
        $this->invoice = $invoice;
        return [
            'items' => $invoice->invoiceItems()->with('product')->get(),
        ];
    }

    public function name(): ?string
    {
        return "Invoice Items: {$this->invoice->invoice_id}";
    }

    public function commandBar(): iterable
    {
        return [
            ModalToggle::make('Add Item')
                ->modal('addItemModal')
                ->method('addItem')
                ->icon('plus'),
            Link::make('Back to Invoices')
                ->icon('arrow-left')
                ->route('platform.screens.invoices'),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::table('items', [
                TD::make('product_id', 'Product')
                    ->render(function (InvoiceItem $item) {
                        return $item->product->name;
                    }),
                TD::make('current_count', 'Current Count'),
                TD::make('total_count', 'Quantity'),
                TD::make('unit_price', 'Unit Price'),
                TD::make('total_price', 'Total Price'),
                TD::make('Actions')
                    ->alignRight()
                    ->render(function (InvoiceItem $item) {
                        return DropDown::make()
                            ->icon('fa.chevron-down')
                            ->list([
                                ModalToggle::make('Edit')
                                    ->icon('pencil')
                                    ->modal('editItemModal')
                                    ->modalTitle('Edit Item: ' . $item->product->name)
                                    ->method('updateItem')
                                    ->asyncParameters(['item' => $item->id]),
                                Button::make('Delete')
                                    ->icon('trash')
                                    ->confirm("Are you sure you want to delete this item?")
                                    ->method('deleteItem', ['item' => $item->id])
                            ])
                            ->style('background-color: black; color: white; border-radius: 10px; padding: 5px 10px');
                    }),
            ]),

            Layout::modal(
                'addItemModal',
                Layout::rows([
                    Select::make('item.product_id')
                        ->fromModel(Product::class, 'name')
                        ->title('Product')
                        ->required(),
                    Input::make('item.total_count')
                        ->type('number')
                        ->title('Total Count')
                        ->required(),
                    Input::make('item.unit_price')
                        ->type('number')
                        ->title('Unit Price')
                        ->required(),
                    Input::make('invoice_id')
                        ->type('hidden')
                        ->value($this->invoice->id),
                ])
            )
                ->title('Add New Item')
                ->applyButton('Add Item'),

            Layout::modal(
                'editItemModal',
                Layout::rows([
                    Select::make('item.product_id')
                        ->fromModel(Product::class, 'name')
                        ->title('Product')
                        ->required(),
                    Input::make('item.current_count')
                        ->type('number')
                        ->title('Current Count')
                        ->required(),
                    Input::make('item.total_count')
                        ->type('number')
                        ->title('Quantity')
                        ->required(),
                    Input::make('item.unit_price')
                        ->type('number')
                        ->title('Unit Price')
                        ->required(),
                    Input::make('invoice_id')
                        ->type('hidden')
                        ->value($this->invoice->id),
                ])
            )
                ->async('asyncGetItem')
                ->applyButton('Update Item'),
        ];
    }

    public function asyncGetItem(string $item): array
    {
        $invoiceItem = InvoiceItem::findOrFail($item);
        return [
            'item' => [
                'product_id' => $invoiceItem->product_id,
                'total_count' => $invoiceItem->total_count,
                'current_count' => $invoiceItem->current_count,
                'unit_price' => $invoiceItem->unit_price,
            ],
            'invoice_id' => $this->invoice->id,
        ];
    }
    public function addItem(Request $request)
    {
        $data = $request->validate([
            'item.product_id' => 'required',
            'item.total_count' => 'required|numeric',
            'item.unit_price' => 'required|numeric',
            'invoice_id' => 'required',
        ]);

        if ($this->ProductExistsInInvoice($data['invoice_id'], $data['item']['product_id']))
            return;

        $data['item']['total_price'] = $data['item']['total_count'] * $data['item']['unit_price'];

        InvoiceItem::create([
            'invoice_id' => $data['invoice_id'],
            'product_id' => $data['item']['product_id'],
            'total_count' => $data['item']['total_count'],
            'unit_price' => $data['item']['unit_price'],
            'total_price' => $data['item']['total_price'],
        ]);

        $invoice = Invoice::find($data['invoice_id']);
        $invoice->update([
            'net_price' => $invoice->invoiceItems()->sum('total_price')
        ]);
    }

    public function updateItem(Request $request)
    {
        $item = InvoiceItem::findOrFail($request->query('item'));
        $data = $request->validate([
            'item.product_id' => 'required',
            'item.current_count' => 'required|numeric',
            'item.total_count' => 'required|numeric',
            'item.unit_price' => 'required|numeric',
            'invoice_id' => 'required',
        ]);

        if ($item->product_id != $data['item']['product_id']) {
            if ($this->ProductExistsInInvoice($data['invoice_id'], $data['item']['product_id']))
                return;
        }

        $data['item']['total_price'] = $data['item']['total_count'] * $data['item']['unit_price'];

        $item->update([
            'product_id' => $data['item']['product_id'],
            'current_count' => $data['item']['current_count'],
            'total_count' => $data['item']['total_count'],
            'unit_price' => $data['item']['unit_price'],
            'total_price' => $data['item']['total_price'],
        ]);

        $invoice = Invoice::find($data['invoice_id']);
        $invoice->update([
            'net_price' => $invoice->invoiceItems()->sum('total_price')
        ]);
    }
    public function deleteItem(InvoiceItem $item)
    {
        $invoice = $item->invoice;
        $item->delete();

        $invoice->update([
            'net_price' => $invoice->invoiceItems()->sum('total_price')
        ]);
    }

    private function ProductExistsInInvoice($invoiceId, $productId): bool
    {
        $exists = InvoiceItem::where('invoice_id', $invoiceId)
            ->where('product_id', $productId)
            ->exists();

        if (!$exists) return false;

        Toast::error('That product already exists in the invoice, try updating it')
            ->delay(4000);
        return true;
    }
}
