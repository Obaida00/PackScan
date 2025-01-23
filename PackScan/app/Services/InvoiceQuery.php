<?php

namespace App\Services;

use Illuminate\Http\Request;

class InvoiceQuery
{
    protected $safeParams = [
        'id' => ['li'],
        'st' => ['eq']
    ];

    protected $columnMap = [
        'st' => 'storage_id'
    ];

    protected $operatorMap = [
        'eq' => '=',
        'li' => 'like'
    ];

    protected $valueMap = [
        'mo' => '0',
        'ad' => '1'
    ];

    public function transform(Request $request) : array
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