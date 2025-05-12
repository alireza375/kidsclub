<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PageRequest;
use App\Http\Resources\Admin\PageResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Http\Services\Admin\PageService;
use App\Models\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    private $pageService;
    public function __construct(PageService $pageService)
    {
        $this->pageService = $pageService;
    }

    // Get all pages
    public function index(Request $request)
    {
        $per_page = $request->limit ?? 10;
        $sort_by  = !empty($request->sort_by) ? $request->sort_by : 'id';
        $dir     = !empty($request->dir) ? $request->dir : 'asc';
        $query = Page::select('id', 'title', 'slug', 'content', 'content_type', 'enable');

        $query->when(!empty(request('search')), function ($q) use ($request) {
            return $q->where('title', '%' . $request->search . '%');
        });
        $page = $query->orderBy($sort_by, $dir)->paginate($per_page);
        return successResponse("Page list", new BasePaginationResource(PageResource::collection($page)));
    }

    public function addOrUpdatePage(PageRequest $request)
    {
        if (!empty($request->slug)) {
            return $this->pageService->update($request);
        } else {
            return $this->pageService->store($request);
        }
    }

    public function getPage(Request $request)
    {
        $slug = $request->input('slug');
        if(empty($slug)){
            return errorResponse("Slug is required");
        }
        return $this->pageService->getPage($slug);
    }

    public function delete(Request $request)
    {
        $slug = $request->input('slug');
        return $this->pageService->deletePage($slug);
    }
}
