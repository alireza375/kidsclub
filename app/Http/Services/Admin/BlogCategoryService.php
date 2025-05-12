<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Admin\BlogCategoryResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\Blog;
use App\Models\BlogCategory;

class BlogCategoryService
{

    // Category List
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $lang = $request->langCode ?? 'en';
        
        $query = BlogCategory::query();

        $query->when(! empty(request('search')), function ($q) use ($request, $lang) {
            return $q->where(function ($q) use ($request, $lang) {
                return $q->where('name'.'->'.$lang, 'like', '%'.$request->search.'%');
            });
        });
        $data = $query->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(__('Categorys fetched successfully.'), new BasePaginationResource(BlogCategoryResource::collection($data)));
    }


    // Category details Show
    public function show($request)
    {
        if ($request->id) {
            $data = BlogCategory::find($request->id);
            if (!$data) {
                return errorResponse(__('Category not found.'));
            }

            return successResponse(__('Category fetched successfully.'), new BlogCategoryResource($data));
        } else {
            return errorResponse(__('Category not found.'));
        }
    }


    // Category Store
    public function store($request)
    {
        $payload = $request->input('name');

        // Validate the input to ensure it is not empty and is an array
        if (empty($payload) || !is_array($payload)) {
            return response()->json(['message' => 'Invalid input'], 400);
        }

        // Initialize a query builder for the Tag model
        $query = BlogCategory::query();

        // Iterate through each language and check if a tag with the same name exists
        foreach ($payload as $lang => $value) {
            $query->orWhere("name->$lang", $value);
        }

        // Check if any tag record with the same name exists
        $exists = $query->exists();
        if ($exists) {
            return errorResponse(__('Category already exists.'));
        }
        $data = BlogCategory::create([
            'name' => json_encode($request->name),
        ]);

        return successResponse(__('Blog Category created successfully.'), BlogCategoryResource::make($data));
    }


    // Category Update
    public function update($request)
    {
        $Category = BlogCategory::find($request->id);
        if (!$Category) {
            return errorResponse(__('Category not found.'));
        }

        // Validate the 'name' input
        $payload = $request->input('name');
        if (!is_array($payload) || empty($payload)) {
            return response()->json(['message' => __('Invalid input')], 400);
        }

        // Check for duplicates
        $exists = BlogCategory::where('id', '!=', $request->id)
            ->where(function ($query) use ($payload) {
                foreach ($payload as $lang => $value) {
                    $query->orWhere("name->$lang", $value);
                }
            })->exists();

        if ($exists) {
            return errorResponse(__('category already exists.'));
        }

        // Update the tag's name (assuming 'name' is a JSON column)
        $Category->update(['name' => $payload]);

        return successResponse(__('Category updated successfully.'));
    }


    // Category Delete
    public function delete($request)
    {
        $Category = BlogCategory::find($request->id);
        if (!$Category) {
            return errorResponse(__('Category not found.'));
        }
        // Check if Blog exist or not check
        $checkBlogs = Blog::where('category_id', $Category->id)->first();
        if ($checkBlogs) {
            return errorResponse(__('Category is in use'));
        }
        try {
            $Category->delete();
            return successResponse(__('Category deleted successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }



}
