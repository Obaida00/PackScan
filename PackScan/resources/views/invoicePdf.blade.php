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
            margin-top: 20px;
            height: 90px;
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
            border-color: black;
            border-style: solid;
            border-width: 1px;
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
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="content-wrapper">
            <table>
                <thead>
                    <tr>
                        <th
                            colspan="9"
                            class="white-border-left white-border-top white-border-right no-bold">
                            <img src="{{ public_path('images/head.png') }}" class="head-img" />
                            <div class="time">11:44</div>
                            <div class="width-full text-center">مبيعات</div>
                            <div class="title">
                                <div class="width-half text-right">السيد: {{ $invoice->pharmacist }}</div>
                                <div class="width-half text-center">التاريخ: {{$invoice->date}}</div>
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
                        <th>الصف</th>
                        <th>المجموعة</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($invoice->invoiceItems as $item)
                    <tr>
                        <td></td>
                        <td>0.0</td>
                        <td>6,000.0</td>
                        <td>{{ number_format($item->total_price) }}</td>
                        <td>{{ number_format($item->unit_price) }}</td>
                        <td>0</td>
                        <td>{{ number_format($item->total_count) }}</td>
                        <td>{{ $item->product->name }}</td>
                        <td>ابن الهيثم</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
            <table class="bottom-table tg">
                <tbody>
                    <tr>
                        <td class="tg-lqy6" colspan="2">{{ number_format($invoice->net_price) }}</td>
                        <td class="tg-lqy6" colspan="2">المجموع</td>
                        <td class="tg-lqy6"></td>
                        <td class="tg-lqy6" colspan="2"></td>
                        <td class="tg-lqy6" colspan="2"></td>
                    </tr>
                    <tr>
                        <td class="tg-lqy6">{{ number_format($invoice->net_price) }}</td>
                        <td class="tg-lqy6" colspan="3">الصافي</td>
                        <td class="tg-lqy6" colspan="5">
                            فقط لاغيرفقط لاغيرفقط لاغيرفقط لاغيرفقط لاغير
                        </td>
                    </tr>
                    <tr>
                        <td class="tg-lqy6" colspan="3">1</td>
                        <td class="tg-lqy6" colspan="3"></td>
                        <td class="tg-lqy6" colspan="2">{{ number_format($invoice->net_price) }}</td>
                        <td class="tg-lqy6">الرصيد</td>
                    </tr>
                    <tr>
                        <td class="tg-lqy6" colspan="3">10</td>
                        <td class="tg-lqy6" colspan="3">الأقلام</td>
                        <td class="tg-lqy6" colspan="2">0.0</td>
                        <td class="tg-lqy6">الحسم</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="signitures">
            <div>تحضير</div>
            <div>تدقيق</div>
            <div>توضيب</div>
        </div>
    </div>
</body>

</html>