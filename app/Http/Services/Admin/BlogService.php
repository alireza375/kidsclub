<?php

namespace App\Http\Services\Admin;

use App\Models\Blog;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\Admin\BlogResource;
use App\Http\Resources\Common\SingleBlogResource;
use App\Http\Resources\Trainer\TrainerBlogResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\BlogComment;

class BlogService
{

    // Blog List
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $lang = $request->langCode ?? 'en';
        $query = Blog::query();

        // Apply search filter for title and category based on language
        $query->when(! empty($request->search), function ($q) use ($request, $lang) {
            $q->where(function ($q) use ($request, $lang) {
                $q->where("title->$lang", 'like', '%'.$request->search.'%');
            });
        });


        // Check if the authenticated user exists
        $user = Auth::guard('checkUser')->user();

        // return $user;
        // Get user role
        $role = $user->role;

        if ($role == ADMIN) {
            //all blogs for admin
            $data = $query->orderBy($sort_by, $dir)->paginate($per_page);
            return successResponse(__('Blogs fetched successfully.'), new BasePaginationResource(BlogResource::collection($data)));
        } else if ($role == COACH) {
            // individual blog for trainer
            $id = $user->id;

            $data = $query->where('user_id', $id)
                        ->orderBy($sort_by, $dir)
                        ->paginate($per_page);

                return successResponse( __('Blogs fetched successfully.'), new BasePaginationResource(BlogResource::collection($data))
            );
        } else {
            return errorResponse(__('Unauthorized'), 401);
        }


    }


    //public Blog List
    public function blogIndex($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $lang = $request->langCode ?? 'en';

        // Start the query for blogs
        $query = Blog::query();
        $query->where('publish', 1);

        // Apply search filter if 'search' parameter is provided
        $query->when(!empty($request->search), function ($q) use ($request, $lang) {
            $q->where(function ($q) use ($request, $lang) {
                $q->where("title->$lang", 'like', '%' . $request->search . '%');
            });
        });

        // Apply category filter if 'category' parameter is provided
        $query->when(!empty($request->category), function ($q) use ($request) {
            $q->where('category_id', $request->category);
        });

        // Execute the query and paginate the results
        $data = $query->orderBy($sort_by, $dir)->paginate($per_page);

        // Return the response
        return successResponse(__('Blogs fetched successfully.'), new BasePaginationResource(BlogResource::collection($data)));
    }


    // blog show by id

    public function show($request)
    {
        $data = Blog::find($request->id);
        if (! $data) {
            return errorResponse(__('Blog not found.'));
        } try {
            return successResponse(__('Blog fetched successfully.'), SingleBlogResource::make($data));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // publish Blog
    public function publish($request)
    {
        $blog = Blog::find($request->id);
        if (!$blog) {
            return errorResponse(__('Blog not found.'));
        } try {
            $blog->update(['publish' => $blog->publish == 1 ? 0 : 1]);

            return successResponse(__($blog->publish == 1 ? 'Blog publish successfully.' : 'Blog Unpublish successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // popular Blog
    public function popular($request)
    {
        $blog = Blog::find($request->id);
        if (! $blog) {
            return errorResponse(__('Blog not found.'));
        } try {
            $blog->update(['add_to_popular' => $blog->add_to_popular == 1 ? 0 : 1]);
            return successResponse(__($blog->add_to_popular == 1 ? 'Blog popular successfully.' : 'Blog unpopular successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // Blog Store
    public function store($request)
    {
        // store user id and his role

        $user = Auth::guard('checkUser')->user()->id;
        $role = Auth::guard('checkUser')->user()->role;

        // check title exists
        $title = Blog::where('title', json_encode($request->title))->first();
        if ($title) {
            return errorResponse(__('Title already exists.'));
        }

        $data = [
            'user_id' => $user,
            'role' => $role,
            'title' => json_encode($request->title),
            'image' => $request->image,
            'details' => json_encode($request->details),
            'short_description' => json_encode($request->short_description),
            'category_id' => $request->category,
            'add_to_popular' => $request->add_to_popular == 'true' ? 1 : 0,
            'publish' => $request->published == 'true' ? 1 : 0,
        ];
        try {
            $blog = Blog::create($data);
            return successResponse(__('Blog added successfully.'), $blog);
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // Blog Update
    public function update($request)
    {
        $blog = Blog::find($request->id);
        if (!$blog) {
            return errorResponse(__('Blog not found.'));
        }
        $data = [
            'title' => isset($request->title) ? json_encode($request->title) : $blog->title,
            'image' => isset($request->image) ? $request->image : $blog->image,
            'details' => isset($request->details) ? json_encode($request->details) : $blog->details,
            'category_id' => isset($request->category) ? $request->category : $blog->category_id,
            'short_description' => isset($request->short_description) ? json_encode($request->short_description) : $blog->short_description,
            'add_to_popular' => isset($request->add_to_popular) ? ($request->add_to_popular == 'true' ? 1 : 0): $blog->add_to_popular,
            'publish' => isset($request->published) ? ($request->published == 'true' ? 1 : 0) : $blog->publish,
        ];
        try {
            $blog->update($data);
            return successResponse(__('Blog updated successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }

    }


    //popular blog List
    public function popularList($request)
    {
    // Query to fetch popular blogs
    $data = Blog::where('add_to_popular', 1)
                ->where('publish', 1)
                ->get();
        // Return response with resource
        return successResponse( __('Blog fetched successfully.'), BlogResource::collection($data));
    }



    // Blog delete
    public function delete($request)
    {
        $blog = Blog::find($request->id);
        if (!$blog) {
            return errorResponse(__('Blog not found.'));
        }
        // delete comments by blog id
        BlogComment::where('blog_id', $blog->id)->delete();
        try {
            $blog->delete();
            removeFile($blog->image);
            return successResponse(__('Blog deleted successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

}
