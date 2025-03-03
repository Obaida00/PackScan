<?php

namespace App\Repositories;

use App\Models\Packer;
use Illuminate\Database\Eloquent\Collection;

class PackerRepository
{
    /**
     * Get all packers ordered by latest.
     *
     * @return Collection
     */
    public function getAllPackers(): Collection
    {
        return Packer::latest()->get();
    }

    /**
     * Find a packer by ID.
     *
     * @param int $id
     * @return Packer
     */
    public function findById(int $id): Packer
    {
        return Packer::findOrFail($id);
    }

    /**
     * Create a new packer.
     *
     * @param array $data
     * @return Packer
     */
    public function create(array $data): Packer
    {
        return Packer::create($data);
    }

    /**
     * Update a packer.
     *
     * @param Packer $packer
     * @param array $data
     * @return bool
     */
    public function update(Packer $packer, array $data): bool
    {
        return $packer->update($data);
    }

    /**
     * Delete a packer.
     *
     * @param Packer $packer
     * @return bool|null
     */
    public function delete(Packer $packer): ?bool
    {
        return $packer->delete();
    }
}
