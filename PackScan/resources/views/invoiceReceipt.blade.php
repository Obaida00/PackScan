<!DOCTYPE html>
<html lang="en" style="width: fit-content">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" />
    <title>Document</title>
    <style>
        @page {
            size: a5 portrait;
        }

        body {
            background-color: white;
            margin: 0;
            justify-content: center;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 0.8rem;
            width: 100%;
        }

        .wrapper {
            background-color: white;
            width: 148mm;
        }

        .content-wrapper {
            padding: 0 10px;
        }

        .head-img {
            width: 100%;
            height: 100px;
            object-fit: contain;
        }

        table,
        tr,
        th,
        td {
            width: fit-content;
            border: 1px solid #00000080;
            text-align: right;
            border-collapse: collapse;
            padding: 2px 5px;
        }

        table {
            page-break-after: auto;
        }

        table {
            margin: 5px 0 0 0;
            width: 100%;
        }

        thead {
            display: table-header-group;
        }

        tbody {
            display: table-row-group;
        }

        tr {
            page-break-inside: avoid;
        }

        th {
            text-align: center;
        }

        thead tr:first-child th {
            padding: 0;
        }

        .bottom-table {
            margin: 0;
            color: brown;
            font-weight: 600;
        }

        .title {
            display: flex;
            flex-direction: row-reverse;
        }

        .width-full {
            width: 100%;
        }

        .width-half {
            width: 50%;
        }

        .width-fourty {
            width: 40%;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .text-left {
            text-align: left;
        }

        .time {
            text-align: left;
        }

        .signitures {
            margin: 5px 50px;
            display: flex;
            justify-content: space-between;
        }

        .white-border-top {
            border-top: 1px solid white;
        }

        .white-border-left {
            border-left: 1px solid white;
        }

        .white-border-right {
            border-right: 1px solid white;
        }

        .white-border-left {
            border-left: 1px solid white;
        }

        .no-bold {
            font-weight: normal;
        }

        .tg {
            border-collapse: collapse;
            border-spacing: 0;
            margin: 0px auto;
        }

        .tg td {
            border: 1px solid #00000080;
            font-family: Arial, sans-serif;
            font-size: 14px;
            overflow: hidden;
            padding: 2px 5px;
            word-break: normal;
        }

        .tg th {
            border-color: black;
            border-style: solid;
            border-width: 1px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: normal;
            overflow: hidden;
            padding: 2px 5px;
            word-break: normal;
        }

        .tg .tg-lqy6 {
            text-align: right;
            vertical-align: top;
        }

        .net-price-in-words {
            min-width: 200px;
        }

        .balance-discount {
            width: 50px;
        }

        .last-table-cell {
            border: 1px solid white;
            width: 100%;
            padding: 1px;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="content-wrapper">
            <table>
                <thead>
                    <tr>
                        <th colspan="9" class="white-border-left white-border-top white-border-right no-bold">
                            <img src="{{ public_path('images/'.$invoice->storage->code.'.png') }}" class="head-img" />
                            <div class="time">{{now("+3")->format('H:i')}}</div>
                            <div class="width-full text-center">مبيعات</div>
                            <div class="title">
                                <div class="width-half text-right">السيد: {{ $invoice->pharmacist }}</div>
                                <div class="width-half text-center">التاريخ: {{ $invoice->date }}</div>
                            </div>
                            <div class="title">
                                <div class="width-half text-right">البيان: {{ $invoice->statement }}</div>
                                <div class="width-fourty text-left">{{ $invoice->invoice_id }}</div>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        <th>البيان</th>
                        <th>الحسم</th>
                        <th>العموم</th>
                        <th>الإجمالي</th>
                        <th>الإفرادي</th>
                        <th>الهدايا</th>
                        <th>الكمية</th>
                        <th>الصنف</th>
                        <th>المجموعة</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($invoice->invoiceItems as $item)
                    @if ($item->total_count == 0)
                    @continue
                    @endif
                    <tr>
                        <td>{{ $item->description }}</td>
                        <td>{{ number_format($item->discount) }}</td>
                        <td>{{ number_format($item->public_price) }}</td>
                        <td>{{ number_format($item->total_price) }}</td>
                        <td>{{ number_format($item->unit_price) }}</td>
                        <td>{{ number_format($item->gifted_quantity) }}</td>
                        <td>{{ number_format($item->quantity) }}</td>
                        <td style="word-wrap: break-word; text-wrap-mode: wrap;">{{ $item->product->name }}</td>
                        <td>{{ $item->product->collection->name }}</td>
                    </tr>
                    @endforeach
                    <tr>
                        <td class="last-table-cell" colspan="9">
                            <table class="bottom-table tg">
                                <tbody>
                                    <tr>
                                        <td class="tg-lqy6" colspan="2">{{ number_format($invoice->total_price) }}
                                        </td>
                                        <td class="tg-lqy6" colspan="2">المجموع</td>
                                        <td class="tg-lqy6"></td>
                                        <td class="tg-lqy6" colspan="2"></td>
                                        <td class="tg-lqy6" colspan="2"></td>
                                    </tr>
                                    <tr>
                                        <td class="tg-lqy6">{{ number_format($invoice->net_price) }}</td>
                                        <td class="tg-lqy6" colspan="3">الصافي</td>
                                        <td class="tg-lqy6 net-price-in-words" colspan="5">
                                            {{ $invoice->net_price_in_words }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="tg-lqy6" colspan="3">{{ $invoice->deputy_number }}</td>
                                        <td class="tg-lqy6" colspan="3"></td>
                                        <td class="tg-lqy6" colspan="2">{{ number_format($invoice->balance) }}</td>
                                        <td class="tg-lqy6 balance-discount">الرصيد</td>
                                    </tr>
                                    <tr>
                                        <td class="tg-lqy6" colspan="3">
                                            {{ number_format($invoice->number_of_items) }}
                                        </td>
                                        <td class="tg-lqy6" colspan="3">الأقلام</td>
                                        <td class="tg-lqy6" colspan="2">
                                            {{ number_format($invoice->total_discount) }}
                                        </td>
                                        <td class="tg-lqy6 balance-discount">الحسم</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="signitures">
                                <div>تحضير</div>
                                <div>تدقيق</div>
                                <div>توضيب</div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
</body>

</html>