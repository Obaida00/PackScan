<?php

namespace App\Orchid\Screens;

use App\Models\Packer;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\ModalToggle;
use Orchid\Screen\Fields\CheckBox;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Facades\Layout;

class PackerScreen extends Screen
{
    /**
     * Fetch data to be displayed on the screen.
     *
     * @return array
     */
    public function query(): iterable
    {
        return [
            'packers' => Packer::latest()->get(),
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
                ->method('create')
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
                TD::make('name'),
                TD::make('can_manually_submit', 'Can Manually Submit'),
                TD::make('can_submit_important_invoices', 'Can Submit Important Invoices'),
                TD::make('Actions')
                    ->alignRight()
                    ->render(function (Packer $packer) {
                        return Button::make('Delete Packer')
                            ->confirm("Are you sure you want to delete this packer? - name: {$packer->name}")
                            ->method('delete', ['packer' => $packer->id]);
                    }),
            ]),

            Layout::modal('packerModal', Layout::rows([
                Input::make('packer.id')
                    ->title('Id')
                    ->placeholder('Enter packer ID'),
                Input::make('packer.name')
                    ->title('Name')
                    ->placeholder('Enter packer name'),
                CheckBox::make('packer.can_manually_submit')
                    ->title('Can Manually Submit')
                    ->placeholder('Permission to manually submit invoices')->sendTrueOrFalse(),
                CheckBox::make('packer.can_submit_important_invoices')
                    ->title('Can Submit Important Invoices')
                    ->placeholder('Permission to submit important invoices')->sendTrueOrFalse(),
            ]))
                ->title('Create Packer')
                ->applyButton('Add Packer'),
        ];
    }


    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function create(Request $request)
    {
        $request->validate([
            'packer.id' => 'required|integer',
            'packer.name' => 'required|string|max:255',
            'packer.can_manually_submit' => 'required|boolean',
            'packer.can_submit_important_invoices' => 'required|boolean'
        ]);

        $packer = Packer::create([
            'id' => $request->input('packer.id'),
            'name' => $request->input('packer.name'),
            'can_manually_submit' => $request->input('packer.can_manually_submit'),
            'can_submit_important_invoices' => $request->input('packer.can_submit_important_invoices')
        ]);

        $packer->save();
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
