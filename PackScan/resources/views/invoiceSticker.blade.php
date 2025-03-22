<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Shipping Label</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .paper {
            width: 500px;
            height: 400px;
            background-color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 16px 16px;
        }

        .container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 0.5fr 2fr 3fr;
            gap: 0px 0px;
            grid-auto-flow: row;
            grid-template-areas:
                "header header"
                "details-left details-right"
                "barcode-body barcode-body";
            height: 100%;
            width: 100%;
        }

        .header {
            grid-area: header;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
        }

        .details-right {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr 1fr 1fr;
            gap: 0px 0px;
            grid-auto-flow: row;
            grid-template-areas:
                "details-right-1"
                "details-right-2"
                "details-right-3"
                "details-right-4";
            grid-area: details-right;
        }

        .details-right-1 {
            grid-area: details-right-1;
        }

        .details-right-2 {
            grid-area: details-right-2;
        }

        .details-right-3 {
            grid-area: details-right-3;
        }

        .details-right-4 {
            grid-area: details-right-4;
        }

        .details-left {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr 1fr;
            grid-auto-columns: 1fr;
            gap: 0px 0px;
            grid-auto-flow: row;
            grid-template-areas:
                "details-left-1"
                "details-left-2"
                "details-left-3";
            grid-area: details-left;
        }

        .details-left-1 {
            grid-area: details-left-1;
        }

        .details-left-2 {
            grid-area: details-left-2;
        }

        .details-left-3 {
            grid-area: details-left-3;
        }

        .barcode {
            grid-area: barcode-body;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 50px 50px 40px 50px;
        }

        .text-middle {
            align-content: center;
            padding: 0px 10px;
        }

        .label {
            font-family: monospace;
            font-size: medium;
            color: #a8a8a8;
        }

        .important-data {
            font-size: x-large;
            font-weight: bold;
        }

        .border {
            border: 3px solid black;
            border-radius: 4px;
        }

        .medium-border-bottom {
            border-bottom: 2px solid black;
        }

        .light-border-bottom {
            border-bottom: 1px solid black;
        }

        .light-border-right {
            border-right: 1px solid black;
        }

        .light-border-left {
            border-left: 1px solid black;
        }
    </style>
</head>

<body>
    <div class="paper">
        <div class="container border">
            <div class="header medium-border-bottom">
                <div>
                    <span class="label">ID: </span>
                    {{$invoice->invoice_id}}
                </div>
                <div>
                    <span class="label">STORAGE NAME: </span>
                    {{ $invoice->storage->name }}
                </div>
            </div>
            <div class="details-left medium-border-bottom light-border-right">
                <div class="details-left-1 light-border-bottom text-middle">
                    <span class="label">PHARMACIST NAME: </span>
                    <div class="important-data">{{ $invoice->pharmacist }}</div>
                </div>
                <div class="details-left-2 light-border-bottom text-middle">
                    <span class="label">STATEMENT: </span>
                    <div>{{ $invoice->statement }}</div>
                </div>
                <div class="details-left-3 text-middle">
                    <span class="label">DATE: </span>
                    <div>{{ $invoice->date }}</div>
                </div>
            </div>
            <div class="details-right medium-border-bottom light-border-left">
                <div class="details-right-1 light-border-bottom text-middle">
                    <span class="label">SENT AT: </span>
                    <div>{{ $invoice->sent_at }}</div>
                </div>
                <div class="details-right-2 light-border-bottom text-middle">
                    <span class="label">PACKER NAME: </span>
                    <div>{{ $invoice->packer->name }}</div>
                </div>
                <div class="details-right-3 light-border-bottom text-middle">
                    <span class="label">NUMBER OF PACKAGES: </span>
                    <div>{{ $invoice->number_of_packages }}</div>
                </div>
                <div class="details-right-4 text-middle">
                    <span class="label">NET PRICE: </span>
                    <div>{{ $invoice->net_price }}</div>
                </div>
            </div>
            <div class="barcode">
                {!! $barcode !!}
            </div>
        </div>
    </div>
</body>

</html>