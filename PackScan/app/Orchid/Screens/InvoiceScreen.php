<?php

namespace App\Orchid\Screens;

use App\Models\Invoice;
use App\Models\Storage;
use App\Models\Packer;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\DropDown;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Actions\ModalToggle;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Fields\DateTimer;
use Orchid\Screen\Fields\Radio;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class InvoiceScreen extends Screen
{
    /**
     * @var Invoice|null
     */
    public $invoice = null;

    /**
     * Fetch data to be displayed on the screen.
     *
     * @return array
     */
    public function query(): iterable
    {
        return [
            'invoices' => Invoice::filters()->defaultSort('invoice_id', 'desc')->paginate(),
        ];
    }

    /**
     * The name of the screen displayed in the header.
     *
     * @return string|null
     */
    public function name(): ?string
    {
        return 'Invoices';
    }

    /**
     * The screen's action buttons.
     *
     * @return \Orchid\Screen\Action[]
     */
    public function commandBar(): iterable
    {
        return [
            ModalToggle::make('Add Invoice')
                ->modal('invoiceModal')
                ->modalTitle('Create Invoice')
                ->method('save')
                ->icon('plus'),
        ];
    }

    /**
     * The screen's layout elements.
     *
     * @return \Orchid\Screen\Layout[]|string[]
     */
    public function layout(): iterable
    {
        return [
            Layout::table('invoices', [
                TD::make('invoice_id', 'Invoice ID')
                    ->sort()
                    ->filter(Input::make()),
                TD::make('storage')
                    ->sort()
                    ->filter(Input::make())
                    ->render(function (Invoice $invoice) {
                        return $invoice->storage->name;
                    }),
                TD::make('statement'),
                TD::make('pharmacist')
                    ->sort()
                    ->filter(Input::make()),
                TD::make('date')
                    ->sort()
                    ->filter(Input::make())
                    ->render(function (Invoice $invoice) {
                        return $invoice->date ? date('Y-m-d', strtotime($invoice->date)) : 'N/A';
                    }),
                TD::make('status')
                    ->sort()
                    ->filter(Input::make()),
                TD::make('Actions')
                    ->alignRight()
                    ->render(function (Invoice $invoice) {
                        return DropDown::make()
                            ->icon('fa.chevron-down')
                            ->list([
                                ModalToggle::make('Edit Invoice')
                                    ->icon('fa.pen')
                                    ->modal('invoiceModal')
                                    ->modalTitle("Edit Invoice: {$invoice->invoice_id}")
                                    ->method('save')
                                    ->asyncParameters([
                                        'invoice' => $invoice->id,
                                    ]),
                                Link::make('Manage Items')
                                    ->icon('fa.list')
                                    ->route('platform.screens.invoice.items', ['invoice' => $invoice->id]),
                                ModalToggle::make('Mark as')
                                    ->icon('fa.tag')
                                    ->modal('markAsModal')
                                    ->modalTitle("Mark Invoice: {$invoice->invoice_id}")
                                    ->method('markAs')
                                    ->asyncParameters([
                                        'invoice' => $invoice->id,
                                    ]),
                                Button::make('Delete Invoice')
                                    ->icon('fa.trash')
                                    ->confirm("Are you sure you want to delete this invoice? - ID: {$invoice->invoice_id}")
                                    ->method('delete', ['invoice' => $invoice->id])
                            ])
                            ->style('background-color: black; color: white; border-radius: 10px; padding: 5px 10px');
                    }),
            ]),

            Layout::modal(
                'invoiceModal',
                Layout::rows([
                    Input::make('invoice.id')
                        ->readonly(),
                    Input::make('invoice.invoice_id')
                        ->title('Invoice ID')
                        ->placeholder('Enter invoice ID')
                        ->required(),
                    Input::make('invoice.statement')
                        ->title('Statement')
                        ->placeholder('Enter statement')
                        ->required(),
                    DateTimer::make('invoice.date')
                        ->title('Date')
                        ->format('Y-m-d')
                        ->required(),
                    Input::make('invoice.status')
                        ->title('Status')
                        ->readonly(),
                    Select::make('invoice.storage_id')
                        ->title('Storage')
                        ->fromModel(Storage::class, 'name')
                        ->required(),
                    Input::make('invoice.pharmacist')
                        ->title('Pharmacist')
                        ->placeholder('Enter pharmacist name')
                        ->required(),
                    Input::make('invoice.net_price')
                        ->type('number')
                        ->step(1)
                        ->title('Net Price')
                        ->placeholder('Enter net price')
                        ->required(),
                    Input::make('invoice.packer_id')
                        ->title('Packer Id')
                        ->readonly()
                        ->value(function ($invoice) {
                            return $invoice['packer_id'] ?? 'Null';
                        }),
                    Input::make('invoice_id')
                        ->type('hidden')
                ])
            )
                ->async('asyncGetInvoice')
                ->applyButton('Save Invoice'),

            Layout::modal(
                'markAsModal',
                Layout::rows([
                    Input::make('invoice.id')
                        ->type('hidden'),
                    Select::make('invoice.status')
                        ->title('Status')
                        ->options([
                            'Pending' => 'Pending',
                            'In Progress' => 'In Progress',
                            'Done' => 'Done',
                            'Sent' => 'Sent',
                        ])
                        ->required(),
                    Select::make('invoice.packer_id')
                        ->title('Packer')
                        ->fromModel(Packer::where('is_invoice_admin', true), 'name')
                        ->help('Only packers with admin permissions to change status are valid')
                        ->required()
                ])
            )
                ->async('asyncGetInvoiceForMarkAs')
                ->applyButton('Save Changes'),
        ];
    }

    /**
     * @param string|null $invoice
     *
     * @return array
     */
    public function asyncGetInvoice(?string $invoice = null): array
    {
        if (!$invoice) {
            return [
                'invoice' => [
                    'id' => '',
                    'invoice_id' => '',
                    'storage_id' => '',
                    'statement' => '',
                    'pharmacist' => '',
                    'date' => date('Y-m-d'),
                    'status' => 'draft',
                    'net_price' => 0,
                    'packer_id' => '',
                ],
                'invoice_id' => null,
            ];
        }

        $invoiceModel = Invoice::findOrFail($invoice);

        return [
            'invoice' => [
                'id' => $invoiceModel->id,
                'invoice_id' => $invoiceModel->invoice_id,
                'storage_id' => $invoiceModel->storage_id,
                'statement' => $invoiceModel->statement,
                'pharmacist' => $invoiceModel->pharmacist,
                'date' => $invoiceModel->date,
                'status' => $invoiceModel->status,
                'net_price' => $invoiceModel->net_price,
                'packer_id' => $invoiceModel->packer_id,
            ],
            'invoice_id' => $invoiceModel->id,
        ];
    }

    /**
     * @param string|null $invoice
     *
     * @return array
     */
    public function asyncGetInvoiceForMarkAs(?string $invoice = null): array
    {
        if (!$invoice) {
            return [
                'invoice' => [
                    'id' => '',
                    'status' => 'Pending',
                    'packer_id' => '',
                ],
            ];
        }

        $invoiceModel = Invoice::findOrFail($invoice);

        return [
            'invoice' => [
                'id' => $invoiceModel->id,
                'status' => $invoiceModel->status,
                'packer_id' => $invoiceModel->packer_id,
            ],
        ];
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function save(Request $request)
    {
        $invoice_id = $request->input('invoice_id');
        $isEdit = !empty($invoice_id);

        $request->validate([
            'invoice.invoice_id' => 'required|string|max:255',
            'invoice.storage_id' => 'required',
            'invoice.date' => 'required|date',
            'invoice.status' => 'required|string',
            'invoice.net_price' => 'required|numeric',
            'invoice.packer_id' => 'required',
        ]);

        $invoiceData = [
            'invoice_id' => $request->input('invoice.invoice_id'),
            'storage_id' => $request->input('invoice.storage_id'),
            'statement' => $request->input('invoice.statement'),
            'pharmacist' => $request->input('invoice.pharmacist'),
            'date' => $request->input('invoice.date'),
            'status' => $request->input('invoice.status'),
            'net_price' => $request->input('invoice.net_price'),
            'packer_id' => $request->input('invoice.packer_id'),
        ];

        if ($isEdit) {
            $invoice = Invoice::findOrFail($invoice_id);
            $invoice->update($invoiceData);
        } else {
            Invoice::create($invoiceData);
        }
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function markAs(Request $request)
    {
        $request->validate([
            'invoice.id' => 'required',
            'invoice.status' => 'required|in:Pending,In Progress,Done,Sent',
            'invoice.packer_id' => 'required',
        ]);

        $invoice = Invoice::findOrFail($request->input('invoice.id'));
        $packer = Packer::findOrFail($request->input('invoice.packer_id'));

        if (!$packer->is_invoice_admin) {
            Toast::error('Selected packer does not have permission to mark invoices');
            return;
        }

        $invoice->update([
            'status' => $request->input('invoice.status'),
            'packer_id' => $packer->id,
        ]);

        Toast::success('Invoice status updated successfully');
    }

    /**
     * @param Invoice $invoice
     *
     * @return void
     */
    public function delete(Invoice $invoice)
    {
        $invoice->invoiceItems()->delete();

        $invoice->delete();
    }
}
