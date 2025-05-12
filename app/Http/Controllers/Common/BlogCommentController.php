<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\Common\BlogCommentRequest;
use App\Http\Resources\Common\BlogCommentResource;
use App\Models\Blog;
use App\Models\BlogComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlogCommentController extends Controller
{
    //
    public function index(Request $request)
    {
       $sort_by = $request->sort_by ?? 'id';
       $dir = $request->dir ?? 'desc';
       $per_page = $request->limit ?? PERPAGE_PAGINATION;
       $comments = BlogComment::where('blog_id', $request->blog_id)
       ->whereNull('parent_id') // Only root-level comments
       ->with('replies') // Load replies recursively
       ->get();
       return successResponse(__('Comments fetched successfully.'), BlogCommentResource::collection($comments) );
    }

    // public function store(BlogCommentRequest $request)
    // {
    //     // Check if the blog exists and is published
    //     $blog = Blog::where('id', $request->blog_id)->where('publish', 1)->first();
    //     if (!$blog) {
    //         return errorResponse(__('Blog not found.'));
    //     }

    //     // Validate if replying to a comment
    //     if ($request->parent_id) {
    //         $parent_id = BlogComment::find($request->parent_id);
    //         if (!$parent_id) {
    //             return errorResponse(__('Parent comment not found.'));
    //         }
    //     }

    //     try {
    //         // Create the comment or reply
    //         BlogComment::create([
    //             "user_id" => Auth::guard('checkUser')->id(),
    //             "blog_id" => $request->blog_id,
    //             "content" => $request->content,
    //             "parent_id" => $request->parent_id ?? null // Link to the parent comment if provided
    //         ]);

    //         return successResponse(__('Comment added successfully.'));
    //     } catch (\Exception $e) {
    //         return errorResponse($e->getMessage());
    //     }
    // }


    public function store(BlogCommentRequest $request)
    {
        $blog = Blog::find($request->blog_id )->where('publish', 1)->first();
        if(!$blog){
            return errorResponse(__('Blog not found.'));
        }
        try{
            BlogComment::create([
                "user_id" => Auth::guard('checkUser')->id(),
                "blog_id" => $request->blog_id,
                "content" => $request->content,
                "parent_id" => $request->parent_id  ?? null
            ]);
            return successResponse(__('Comment added successfully.'));
        }catch(\Exception $e){
            return errorResponse($e->getMessage());
        }
    }

    // Delete Comment
    public function delete(Request $request){
        $comment = BlogComment::where('user_id', Auth::guard('checkUser')->id())->find($request->id);
        if(!$comment){
            return errorResponse(__('Comment not found.'));
        }
        // delete all replies by comment id
        BlogComment::where('parent_id', $comment->id)->delete();
        $comment->delete();
        return successResponse(__('Comment deleted successfully.'));
    }

    // Admin delete comment
    public function adminDelete(Request $request){
        $comment = BlogComment::find($request->id);
        if(!$comment){
            return errorResponse(__('Comment not found.'));
        }
        $comment->delete();
        return successResponse(__('Comment deleted successfully.'));
    }

    public function show(Request $request)
    {
        $blog = Blog::find($request->id);
        if (!$blog) {
            return errorResponse(__('Blog not found.'));
        }
        return successResponse(__('Blog fetched successfully.'), BlogCommentResource::make($blog));
    }



}
