<?php

namespace App\Orchid\Screens;

use App\Models\Packer;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\DropDown;
use Orchid\Screen\Actions\ModalToggle;
use Orchid\Screen\Fields\CheckBox;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Facades\Layout;

class PackerScreen extends Screen
{
    /**
     * @var Packer|null
     */
    public $packer = null;

    /**
     * Fetch data to be displayed on the screen.
     *
     * @return array
     */
    public function query(): iterable
    {
        return [
            'packers' => Packer::filters()->defaultSort('name')->paginate(),
        ];
    }

    /**
     * The name of the screen displayed in the header.
     *
     * @return string|null
     */
    public function name(): ?string
    {
        return 'Packers';
    }

    /**
     * The screen's action buttons.
     *
     * @return \Orchid\Screen\Action[]
     */
    public function commandBar(): iterable
    {
        return [
            ModalToggle::make('Add Packer')
                ->modal('packerModal')
                ->modalTitle('Create Packer')
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
            Layout::table('packers', [
                TD::make('id'),
                TD::make('name')
                    ->sort()
                    ->filter(Input::make()),
                TD::make('Can Manually Submit')
                    ->sort()
                    ->render(function (Packer $packer) {
                        return $packer->can_manually_submit ? 'YES' : 'NO';
                    }),
                TD::make('Can Submit Important Invoices')
                    ->sort()
                    ->render(function (Packer $packer) {
                        return $packer->can_submit_important_invoices ? 'YES' : 'NO';
                    }),
                TD::make('Is Invoice Admin')
                    ->sort()
                    ->render(function (Packer $packer) {
                        return $packer->is_invoice_admin ? 'YES' : 'NO';
                    }),
                TD::make('Actions')
                    ->alignRight()
                    ->render(function (Packer $packer) {
                        return DropDown::make()
                            ->icon('fa.chevron-down')
                            ->list([
                                ModalToggle::make('Edit Packer')
                                    ->icon('fa.pen')
                                    ->modal('packerModal')
                                    ->modalTitle('Edit Packer: ' . $packer->name)
                                    ->method('save')
                                    ->asyncParameters([
                                        'packer' => $packer->id,
                                    ]),
                                Button::make('Delete Packer')
                                    ->icon('fa.trash')
                                    ->confirm("Are you sure you want to delete this packer? - name: {$packer->name}")
                                    ->method('delete', ['packer' => $packer->id])
                            ])
                            ->style('background-color: black; color: white; border-radius: 10px; padding: 5px 10px');
                    }),
            ]),

            Layout::modal('packerModal', Layout::rows([
                Input::make('packer.id')
                    ->title('Id')
                    ->placeholder('Enter packer ID')
                    ->required(),
                Input::make('packer.name')
                    ->title('Name')
                    ->placeholder('Enter packer name')
                    ->required(),
                CheckBox::make('packer.can_manually_submit')
                    ->title('Can Manually Submit')
                    ->placeholder('Permission to manually submit invoices')
                    ->sendTrueOrFalse(),
                CheckBox::make('packer.can_submit_important_invoices')
                    ->title('Can Submit Important Invoices')
                    ->placeholder('Permission to submit important invoices')
                    ->sendTrueOrFalse(),
                Input::make('packer_id')
                    ->type('hidden')
            ]))
                ->async('asyncGetPacker')
                ->applyButton('Save Packer'),
        ];
    }

    /**
     * @param int|null $packer
     *
     * @return array
     */
    public function asyncGetPacker(?int $packer = null): array
    {
        if (!$packer) {
            return [
                'packer' => [
                    'id' => '',
                    'name' => '',
                    'can_manually_submit' => false,
                    'can_submit_important_invoices' => false,
                ],
                'packer_id' => null,
            ];
        }

        $packerModel = Packer::findOrFail($packer);

        return [
            'packer' => [
                'id' => $packerModel->id,
                'name' => $packerModel->name,
                'can_manually_submit' => $packerModel->can_manually_submit,
                'can_submit_important_invoices' => $packerModel->can_submit_important_invoices,
            ],
            'packer_id' => $packerModel->id,
        ];
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function save(Request $request)
    {
        $packer_id = $request->input('packer_id');
        $isEdit = !empty($packer_id);

        // Validate the input data
        $request->validate([
            'packer.id' => 'required|integer',
            'packer.name' => 'required|string|max:255',
            'packer.can_manually_submit' => 'required|boolean',
            'packer.can_submit_important_invoices' => 'required|boolean'
        ]);

        $packerData = [
            'id' => $request->input('packer.id'),
            'name' => $request->input('packer.name'),
            'can_manually_submit' => $request->input('packer.can_manually_submit'),
            'can_submit_important_invoices' => $request->input('packer.can_submit_important_invoices')
        ];

        if ($isEdit) {
            $packer = Packer::findOrFail($packer_id);

            // Check if ID has changed
            if ($packer->id != $packerData['id']) {
                // Delete the old record and create a new one with the updated ID
                $packer->delete();
                Packer::create($packerData);
            } else {
                // Normal update when ID hasn't changed
                $packer->update($packerData);
            }
        } else {
            // Create a new packer
            Packer::create($packerData);
        }
    }

    /**
     * @param Packer $packer
     *
     * @return void
     */
    public function delete(Packer $packer)
    {
        $packer->delete();
    }
}
