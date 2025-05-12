<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Admin\ProductCategoryResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\Product;
use App\Models\ProductCategory;

class ProductCategoryService
{
    // Product Category List
    public function index($request) {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $lang = $request->langCode ?? 'en';

        $query = ProductCategory::query();

        $query->when($request->search, function ($q) use ($request, $lang) {
            $searchTerm = '%' . strtolower($request->search) . '%';

            $q->where(function ($q) use ($searchTerm, $lang) {
                // Search the 'name', 'title', and 'description' fields in the given language
                $q->whereRaw(
                    "LOWER(JSON_UNQUOTE(JSON_EXTRACT(`name`, '$.{$lang}'))) LIKE ?",
                    [$searchTerm]
                );
            });
        });
        $data = $query->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(__('Product Categorys fetched successfully.'), new BasePaginationResource(ProductCategoryResource::collection($data)));
    }


    // Product Category Details
    public function show($request) {
        if ($request->id) {
            $data = ProductCategory::find($request->id);
            if (!$data) {
                return errorResponse(__('Category not found.'));
            } else {
                return successResponse(__('Category fetched successfully.'), new ProductCategoryResource($data));
            }
        }
    }



    // Store Product Category
    public function store($request) {
        $CategoryName = ProductCategory::where('name', $request->get('name'))->first();
        $payload = $request->input('name');

        // Validate the input to ensure it is not empty and is an array
        if (empty($payload) || !is_array($payload)) {
            return response()->json(['message' => 'Invalid input'], 400);
        }

        // Initialize a query builder for the Tag model
        $query = ProductCategory::query();

        // Iterate through each language and check if a tag with the same name exists
        foreach ($payload as $lang => $value) {
            $query->orWhere("name->$lang", $value);
        }

        // Check if any tag record with the same name exists
        $exists = $query->exists();
        if ($exists) {
            return errorResponse(__('Category already exists.'));
        }
        $data = ProductCategory::create([
            'name' => json_encode($request->name),
            'image' => $request->image,
            'description' => json_encode($request->get('description'))
        ]);

        return successResponse(__('Category created successfully.'), new ProductCategoryResource($data));

    }



    // update Product Category
    public function update($request)
    {
        $Category = ProductCategory::find($request->id);
        if (!$Category) {
            return errorResponse(__('Category not found.'));
        }

        // check for duplicates
        $exists = ProductCategory::where('id', '!=', $request->id)
            ->where(function ($query) use ($request) {
                foreach ($request->name as $lang => $value) {
                    $query->orWhere("name->$lang", $value);
                }
            })->exists();

        if ($exists) {
            return errorResponse(__('Category already exists.'));
        }

        $Category->update([
            'name' => json_encode($request->name) ?? $Category->name,
            'image' => $request->image ?? $Category->image,
            'description' => json_encode($request->get('description')) ?? $Category->description
        ]);

        return successResponse(__('Category updated successfully.'), $Category);
    }



    // Delete Product Category
    public function delete($request) {
        $Category = ProductCategory::find($request->id);
        if (!$Category) {
            return errorResponse(__('Category not found.'));
        }
        try {
            $Category->delete();
            removeFile($Category->image);
            return successResponse(__('Product Category deleted successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


}
