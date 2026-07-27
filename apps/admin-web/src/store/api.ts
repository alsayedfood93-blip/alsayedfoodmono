import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type {
  AdminDto,
  AuthTokensDto,
  CategoryDto,
  CeoMessageDto,
  DashboardSummaryDto,
  HeroContentDto,
  LoginResponseDto,
  ProductDto,
  SiteSettingsDto,
} from "@alsayed/shared-types";
import { API_BASE_URL } from "@/lib/config";
import {
  getStoredRefreshToken,
  setCredentials,
  setUnauthenticated,
} from "./authSlice";
import type { RootState } from "./store";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/api`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

let refreshPromise: Promise<string | null> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, apiCtx, extraOptions) => {
  let result = await rawBaseQuery(args, apiCtx, extraOptions);

  if (result.error && result.error.status === 401) {
    // Attempt a single shared refresh, then retry the original request.
    if (!refreshPromise) {
      refreshPromise = (async () => {
        const refreshToken = getStoredRefreshToken();
        if (!refreshToken) return null;
        const refreshResult = await rawBaseQuery(
          {
            url: "/auth/admin/refresh",
            method: "POST",
            body: { refreshToken },
          },
          apiCtx,
          extraOptions,
        );
        if (refreshResult.data) {
          const tokens = refreshResult.data as AuthTokensDto;
          apiCtx.dispatch(
            setCredentials({
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
            }),
          );
          return tokens.accessToken;
        }
        return null;
      })().finally(() => {
        // Clear after microtask so concurrent callers reuse this result.
        setTimeout(() => {
          refreshPromise = null;
        }, 0);
      });
    }

    const newToken = await refreshPromise;
    if (newToken) {
      result = await rawBaseQuery(args, apiCtx, extraOptions);
    } else {
      apiCtx.dispatch(setUnauthenticated());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Categories", "Products", "Hero", "Ceo", "Settings", "Dashboard"],
  endpoints: (builder) => ({
    login: builder.mutation<
      LoginResponseDto,
      { username: string; password: string }
    >({
      query: (body) => ({ url: "/auth/admin/login", method: "POST", body }),
    }),
    getMe: builder.query<AdminDto, void>({
      query: () => "/auth/admin/me",
    }),
    logout: builder.mutation<{ success: boolean }, { refreshToken: string }>({
      query: (body) => ({ url: "/auth/admin/logout", method: "POST", body }),
    }),

    getDashboard: builder.query<DashboardSummaryDto, void>({
      query: () => "/admin/dashboard/summary",
      providesTags: ["Dashboard"],
    }),

    getCategories: builder.query<CategoryDto[], void>({
      query: () => "/admin/categories",
      providesTags: ["Categories"],
    }),
    createCategory: builder.mutation<CategoryDto, FormData>({
      query: (body) => ({ url: "/admin/categories", method: "POST", body }),
      invalidatesTags: ["Categories", "Dashboard"],
    }),
    updateCategory: builder.mutation<
      CategoryDto,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/admin/categories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Categories", "Dashboard"],
    }),
    deleteCategory: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/admin/categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["Categories", "Dashboard"],
    }),

    getProducts: builder.query<ProductDto[], void>({
      query: () => "/admin/products",
      providesTags: ["Products"],
    }),
    createProduct: builder.mutation<ProductDto, FormData>({
      query: (body) => ({ url: "/admin/products", method: "POST", body }),
      invalidatesTags: ["Products", "Dashboard"],
    }),
    updateProduct: builder.mutation<ProductDto, { id: number; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/admin/products/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Products", "Dashboard"],
    }),
    deleteProduct: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/admin/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Products", "Dashboard"],
    }),

    getHero: builder.query<HeroContentDto | null, void>({
      query: () => "/content/hero",
      providesTags: ["Hero"],
    }),
    updateHero: builder.mutation<
      HeroContentDto,
      FormData | Record<string, unknown>
    >({
      query: (body) => ({ url: "/admin/content/hero", method: "PATCH", body }),
      invalidatesTags: ["Hero"],
    }),
    uploadHeroImages: builder.mutation<HeroContentDto, FormData>({
      query: (body) => ({
        url: "/admin/content/hero/images",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Hero"],
    }),
    deleteHeroImage: builder.mutation<HeroContentDto, number>({
      query: (id) => ({
        url: `/admin/content/hero/images/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Hero"],
    }),
    reorderHeroImages: builder.mutation<HeroContentDto, { orderedIds: number[] }>(
      {
        query: (body) => ({
          url: "/admin/content/hero/images/reorder",
          method: "PATCH",
          body,
        }),
        invalidatesTags: ["Hero"],
      },
    ),

    getCeo: builder.query<CeoMessageDto | null, void>({
      query: () => "/content/ceo",
      providesTags: ["Ceo"],
    }),
    updateCeo: builder.mutation<CeoMessageDto, FormData>({
      query: (body) => ({ url: "/admin/content/ceo", method: "PATCH", body }),
      invalidatesTags: ["Ceo"],
    }),

    getSiteSettings: builder.query<SiteSettingsDto, void>({
      query: () => "/site-settings",
      providesTags: ["Settings"],
    }),
    updateSiteSettings: builder.mutation<SiteSettingsDto, FormData>({
      query: (body) => ({
        url: "/admin/site-settings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useLogoutMutation,
  useGetDashboardQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetHeroQuery,
  useUpdateHeroMutation,
  useUploadHeroImagesMutation,
  useDeleteHeroImageMutation,
  useReorderHeroImagesMutation,
  useGetCeoQuery,
  useUpdateCeoMutation,
  useGetSiteSettingsQuery,
  useUpdateSiteSettingsMutation,
} = api;
