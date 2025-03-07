<?php

namespace App\Orchid\Screens;

use App\Models\Product;
use Illuminate\Http\Request;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\DropDown;
use Orchid\Screen\Actions\ModalToggle;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Screen;
use Orchid\Screen\TD;
use Orchid\Support\Facades\Layout;

class ProductScreen extends Screen
{
    /**
     * @var Product|null
     */
    public $product = null;
    /**
     * Fetch data to be displayed on the screen.
     *
     * @return array
     */
    public function query(): iterable
    {
        return [
            'products' => Product::filters()->defaultSort('name')->paginate(),
        ];
    }

    /**
     * The name of the screen displayed in the header.
     *
     * @return string|null
     */
    public function name(): ?string
    {
        return 'Products';
    }

    /**
     * The screen's action buttons.
     *
     * @return \Orchid\Screen\Action[]
     */
    public function commandBar(): iterable
    {
        return [
            ModalToggle::make('Add Product')
                ->modal('productModal')
                ->modalTitle('Create Product')
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
            Layout::table('products', [
                TD::make('id')->render(function (Product $product) {
                    return $product->id;
                }),
                TD::make('name')
                    ->sort()
                    ->filter(Input::make()),
                TD::make('barcode')
                    ->sort()
                    ->filter(Input::make()),
                TD::make('created_at')
                    ->sort()
                    ->filter(Input::make())
                    ->render(function (Product $product) {
                        return $product->created_at->format('Y-m-d H:i');
                    }),
                TD::make('Actions')
                    ->alignRight()
                    ->render(function (Product $product) {
                        return DropDown::make()
                            ->icon('fa.chevron-down')
                            ->list([
                                ModalToggle::make('Edit Product')
                                    ->icon('fa.pen')
                                    ->modal('productModal')
                                    ->modalTitle('Edit Product: ' . $product->name)
                                    ->method('save')
                                    ->asyncParameters([
                                        'product' => $product->id,
                                    ]),
                                Button::make('Delete Product')
                                    ->icon('fa.trash')
                                    ->confirm("Are you sure you want to delete this product? - name: {$product->name}")
                                    ->method('delete', ['product' => $product->id])
                            ])
                            ->style('background-color: black; color: white; border-radius: 10px; padding: 5px 10px');
                    }),
            ]),

            Layout::modal('productModal', Layout::rows([
                Input::make('product.name')
                    ->title('Name')
                    ->placeholder('Enter product name')
                    ->required(),
                Input::make('product.barcode')
                    ->title('Barcode')
                    ->placeholder('Enter product barcode')
                    ->required(),
                Input::make('product_id')
                    ->type('hidden')
            ]))
                ->async('asyncGetProduct')
                ->applyButton('Save Product'),
        ];
    }

    /**
     * @param string|null $product
     *
     * @return array
     */
    public function asyncGetProduct(?string $product = null): array
    {
        if (!$product) {
            return [
                'product' => [
                    'name' => '',
                    'barcode' => '',
                ],
                'product_id' => null,
            ];
        }

        $productModel = Product::findOrFail($product);

        return [
            'product' => [
                'name' => $productModel->name,
                'barcode' => $productModel->barcode,
            ],
            'product_id' => $productModel->id,
        ];
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return void
     */
    public function save(Request $request)
    {
        $product_id = $request->input('product_id');
        $isEdit = !empty($product_id);

        $request->validate([
            'product.name' => 'required|string|max:255',
            'product.barcode' => 'required|string|max:255',
        ]);

        $productData = [
            'name' => $request->input('product.name'),
            'barcode' => $request->input('product.barcode'),
        ];

        if ($isEdit) {
            $product = Product::findOrFail($product_id);
            $product->update($productData);
        } else {
            Product::create($productData);
        }
    }

    /**
     * @param Product $product
     *
     * @return void
     */
    public function delete(Product $product)
    {
        $product->delete();
    }
}
