<?php

namespace App\Services;

use Illuminate\Http\Request;

class InvoiceQuery
{
    protected $safeParams = [
        'id' => ['li'],
        'st' => ['eq'],
        'imp' => ['eq'],
        'missing' => ['eq'],
        'status' => ['eq'],
        'creation_date' => ['eq']
    ];

    protected $columnMap = [
        'id' => 'invoice_id',
        'st' => 'storage_id',
        'imp' => 'is_important',
        'missing' => 'is_missing'
    ];

    protected $operatorMap = [
        'eq' => '=',
        'li' => 'like'
    ];

    protected $valueMap = [
        'mo' => '0',
        'ad' => '1'
    ];

    public function transform(Request $request): array
    {
        $queryResult = [];

        foreach ($this->safeParams as $param => $operators) {
            $query = $request->query($param);

            if (!isset($query)) {
                continue;
            }

            $column = $this->columnMap[$param] ?? $param;

            foreach ($operators as $operator) {
                if (!isset($query[$operator])) {
                    continue;
                }

                $value = $this->valueMap[$query[$operator]] ?? $query[$operator];

                $queryResult[] = [
                    $column,
                    $this->operatorMap[$operator],
                    $value
                ];
            }
        }

        return $queryResult;
    }
}
