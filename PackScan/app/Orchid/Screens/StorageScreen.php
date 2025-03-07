<?php

namespace App\Orchid\Screens;

use App\Models\Storage;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\DropDown;
use Orchid\Screen\Actions\ModalToggle;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Facades\Layout;

class StorageScreen extends Screen
{
    /**
     * Fetch data to be displayed on the screen.
     *
     * @return array
     */
    public function query(): iterable
    {
        return [
            'storages' => Storage::latest()->get(),
        ];
    }

    /**
     * The name of the screen displayed in the header.
     */
    public function name(): ?string
    {
        return 'Storages';
    }

    /**
     * The screen's action buttons.
     */
    public function commandBar(): iterable
    {
        return [
            ModalToggle::make('Add Storage')
                ->modal('storageModal')
                ->modalTitle('Create Storage')
                ->method('save')
                ->icon('plus'),
        ];
    }

    /**
     * The screen's layout elements.
     */
    public function layout(): iterable
    {
        return [
            Layout::table('storages', [
                TD::make('id'),
                TD::make('name'),
                TD::make('code'),

                TD::make('Actions')
                    ->alignRight()
                    ->render(function (Storage $storage) {
                        return DropDown::make()
                            ->icon('fa.chevron-down')
                            ->list([
                                ModalToggle::make('Edit Storage')
                                    ->icon('fa.pen')
                                    ->modal('storageModal')
                                    ->modalTitle('Edit Storage: ' . $storage->name)
                                    ->method('save')
                                    ->asyncParameters(['storage' => $storage->id]),

                                Button::make('Delete Storage')
                                    ->icon('fa.trash')
                                    ->confirm("Are you sure you want to delete this storage? - name: {$storage->name}")
                                    ->method('delete', ['storage' => $storage->id]),
                            ])
                            ->style('background-color: black; color: white; border-radius: 10px; padding: 5px 10px');
                    }),
            ]),

            Layout::modal('storageModal', Layout::rows([
                Input::make('storage.name')
                    ->title('Name')
                    ->placeholder('Enter storage name')
                    ->required(),

                Input::make('storage.code')
                    ->title('Code')
                    ->placeholder('Enter unique storage code')
                    ->required(),

                Input::make('storage_id')->type('hidden'),
            ]))
                ->async('asyncGetStorage')
                ->applyButton('Save Storage'),
        ];
    }

    /**
     * Get storage data for async operations.
     */
    public function asyncGetStorage(?string $storage = null): array
    {
        if (!$storage) {
            return [
                'storage' => ['name' => '', 'code' => ''],
                'storage_id' => null,
            ];
        }

        $storageModel = Storage::findOrFail($storage);

        return [
            'storage' => [
                'name' => $storageModel->name,
                'code' => $storageModel->code,
            ],
            'storage_id' => $storageModel->id,
        ];
    }

    /**
     * Save or update a storage entry.
     */
    public function save(Request $request)
    {
        $storage_id = $request->input('storage_id');
        $isEdit = !empty($storage_id);

        $request->validate([
            'storage.name' => 'required|string|max:255',
            'storage.code' => 'required|string|max:255|unique:storages,code,' . ($isEdit ? $storage_id : 'NULL'),
        ]);

        $storageData = [
            'id' => $request->input('storage.id'),
            'name' => $request->input('storage.name'),
            'code' => $request->input('storage.code'),
        ];

        if ($isEdit) {
            $storage = Storage::findOrFail($storage_id);
            $storage->update($storageData);
        } else {
            Storage::create($storageData);
        }
    }

    /**
     * Delete a storage entry.
     */
    public function delete(Storage $storage)
    {
        $storage->delete();
    }
}
