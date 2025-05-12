<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Admin\LangResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\Language;
use Dflydev\DotAccessData\Data;
use Illuminate\Support\Facades\Lang;


class LangService
{
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $query = Language::query()->select('id', 'name', 'code', 'flag', 'rtl', 'active', 'default', 'created_at', 'updated_at')->where('active', 1);

        $query->when(!empty($request->search), function ($q) use ($request) {
            return $q->where('name', 'like', '%' . $request->search . '%');
        });
        $data = $query->orderBy($sort_by, $dir)->paginate($per_page);
        return successResponse(__('Data fetched successfully.'), new BasePaginationResource(LangResource::collection($data)));
    }

    public function adminIndex($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $query = Language::query()->select('id', 'name', 'code', 'flag', 'rtl', 'active', 'default', 'created_at', 'updated_at');

        $query->when(!empty($request->search), function ($q) use ($request) {
            return $q->where('name', 'like', '%' . $request->search . '%');
        });
        $data = $query->orderBy($sort_by, $dir)->paginate($per_page);
        return successResponse(__('Data fetched successfully.'), new BasePaginationResource(LangResource::collection($data)));
    }



    // Get single language
    public function show($request)
    {
        if ($request->id) {
            $data = Language::select('id', 'name', 'code', 'flag', 'rtl', 'active', 'default', 'translations')->find($request->id);
            if (! $data) {
                return errorResponse(__('Language not found.'));
            }
            return successResponse(__('Language fetched successfully.'), LangResource::make($data));
        }
        return errorResponse(__('Language not found.'));
    }


    // Create new language
    public function store($request)
    {
        $checkLang = Language::where('code', $request->code)->first();
        if ($checkLang) {
            return errorResponse(__('Lang already exists.'));
        }
        $data = [
            'name' => $request->name,
            'code' => $request->code,
            'flag' => $request->flag,
            'rtl' => $request->rtl == 'true' ? 1 : 0,
            'active' => 1,
            'default' => $request->default == 'true' ? 1 : 0,
            'translations' => json_encode($request->translations),
        ];
        if (isset($request->default)) {
            if ($request->default == 'true') {
                Language::where('default', 1)->update(['default' => 0]);
            }
        }
        $Lang = Language::create($data);

        return successResponse(__('Data created successfully.'), $Lang);
    }

    
    // Update language
    public function update($request)
    {
        $language = Language::find($request->id);
    
        if (! $language) {
            return errorResponse(__('Language not found.'));
        }
        $checkLang = Language::where('code', $request->code)->where('id', '!=', $request->id)->first();
        if ($checkLang) {
            return errorResponse(__('Lang already exists.'));
        }
        // Prepare update data
        $data = [
            'name' => $request->name ?? $language->name,
            'code' => $request->code ?? $language->code,
            'flag' => $request->flag ?? $language->flag,
            'translations' => $request->translations ? json_encode($request->translations) : $language->translations,
            'rtl' => isset($request->rtl) ? (bool)$request->rtl : $language->rtl,
            'active' => isset($request->active) ? (bool)$request->active : $language->active,
        ];
    
        // Handle default language
        if (isset($request->default)) {
            if ($request->default == true || $request->default === 'true') {
                Language::where('default', 1)->update(['default' => 0]);
                $data['default'] = 1;
            } else {
                return errorResponse(__('Minimum one default language is required.'));
            }
        }
    
        // Update language record
        $language->update($data);
    
        return successResponse(__('Language updated successfully.'), $data);
    }
    

    // Delete language
    public function delete($request)
    {
        $Language = Language::find($request->id);
        if (! $Language) {
            return errorResponse(__('Language not found.'));
        }
        $Language->delete();

        return successResponse(__('Language deleted successfully.'));
    }


    // Translations
    public function translations($request)
    {
        $Language = Language::find($request->id);
        if (! $Language) {
            return errorResponse(__('Language not found.'));
        }

        return successResponse(__('Translations fetched successfully.'), new LangResource($Language));
    }
}
