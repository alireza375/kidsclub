<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Admin\PageResource;
use App\Models\Page;
use Exception;
use Illuminate\Support\Str;

class PageService
{
    private function makeData($request)
    {
        return [
            'title'        => $request->input('title'),
            'slug'         => $request->input('slug'),
            'content'      => $request->input('content'),
            'heading'      => json_encode($request->input('heading')),
            'content_type' => $request->input('content_type'),
        ];
    }

    // Store page
    public function store($request)
    {
        $existPage = Page::where('title', $request->input('title'))->exists();
        if ($existPage) {
            return errorResponse("A page with the title '{$request->input('title')}' already exists.");
        }
        $slug = Str::slug($request->input('title'), '_');
        $existingPage = Page::where('slug', $slug)->exists();
        if ($existingPage) {
            $i = 1;
            do {
                $newSlug = $slug . '-' . $i++;
            } while (Page::where('slug', $newSlug)->exists());
            $slug = $newSlug;
        }
        $content = json_encode($request->input('content'));
        $data = array_merge($this->makeData($request), ['slug' => $slug, 'content' => $content]);
        try {
            $page = Page::create($data);
            return successResponse("Page with slug '{$request->input('title')}' successfully created");
        } catch (Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // Update page
    public function update($request)
    {
        $page = Page::where(['slug' => $request->slug])->first();
        if (!empty($page)) {
            $data = $this->makeData($request);
            $content = json_encode($request->input('content'));
            $data['content'] = $content;
            try {
                $page->update($data);
                return successResponse($request->title . ' page successfully updated');
            } catch (Exception $e) {
                return errorResponse($e->getMessage());
            }
        }else{
            return errorResponse('Page not found');
        }
    }


    // Get single page
    public function getPage($slug)
    {
        $page = Page::where('slug', $slug)->first();
        if($slug == 'terms_&_condition')
        {
            $page = Page::where('slug', 'terms_condition')->first();
        }
        if ($page) {
            return successResponse("This is your {$slug}", new PageResource($page));
        } else {
            return successResponse("'{$slug}' doesn't exist");
        }
    }

    
    // Delete page
    public function deletePage($slug)
    {
        try {
            $page = Page::where('slug', $slug)->first();
            if (!$page) {
                return errorResponse(__('Page not found.'));
            }
            $page->delete();
            return successResponse(__('Page deleted successfully.'));
        } catch (Exception $e) {
            return errorResponse($e->getMessage());
        }
    }
}
