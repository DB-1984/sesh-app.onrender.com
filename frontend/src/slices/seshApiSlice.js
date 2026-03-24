import { apiSlice } from "./apiSlice";
import { SESH_URL } from "../constants"; // "/api/seshes"

export const seshApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // seshApiSlice.js
    getSeshes: builder.query({
      query: ({ userId, date } = {}) => {
        let url = `${SESH_URL}?user=${userId}`;
        if (date) url += `&date=${date}`;
        return url;
      },
      // Add this to sort by date (Latest first)
      transformResponse: (response) => {
        return [...response].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      },
      providesTags: ["Sesh"],
    }),
    // Provides 'live' feedback to the UI as data is saved, using a blur() event as a trigger
    renameSesh: builder.mutation({
      query: ({ id, title }) => ({
        url: `${SESH_URL}/${id}`, // ensure correct backend route
        method: "PATCH",
        body: { title },
      }),
      // Optimistic update: instantly update cached UI getSeshes data befor DB response
      async onQueryStarted(
        { id, title },
        { dispatch, queryFulfilled, getState }
      ) {
        // Grab the current userId from state (so the cache key matches)
        const userId = getState().user.userInfo._id;

        const patchResult = dispatch(
          // We're performing an **optimistic update** on the cached list of sessions.
          // Since this mutation affects session data fetched by `getSeshes`,
          // we treat that query cache as a "dependent" that needs updating immediately.
          apiSlice.util.updateQueryData(
            "getSeshes", // The name of the query whose cache we want to patch
            { userId }, // Must match the query args used when `getSeshes` was called, for security
            // and for integrity of the data being updated - data is an object with keys, so we need
            // to be sure we edit the correct key's data
            (draft) => {
              // Immer-powered callback for safely mutating the cached data - draft is the data beign edited
              const sesh = draft.find((s) => s._id === id); // Locate the session by ID in the cache
              if (sesh) sesh.title = title; // Update the title instantly for immediate UI feedback
            }
          )
        );

        try {
          await queryFulfilled; // wait for server response
        } catch {
          patchResult.undo(); // rollback if server errors
        }
      },
    }),
    addSesh: builder.mutation({
      query: (newSesh) => ({
        url: SESH_URL,
        method: "POST",
        body: newSesh,
      }),
      invalidatesTags: ["Sesh"],
    }),
    deleteSesh: builder.mutation({
      query: (id) => ({
        url: `${SESH_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sesh"],
    }),
    addExercise: builder.mutation({
      query: ({ seshId, exercise }) => ({
        url: `${SESH_URL}/${seshId}/exercises`, // updated path
        method: "POST",
        body: exercise,
      }),
      invalidatesTags: ["Sesh"],
    }),
    deleteExercise: builder.mutation({
      query: ({ seshId, exercise }) => ({
        url: `${SESH_URL}/${seshId}/exercises`, // updated path
        method: "DELETE",
        body: exercise,
      }),
      invalidatesTags: ["Sesh"],
    }),

    getSeshById: builder.query({
      query: (id) => `${SESH_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: "Sesh", id }],
    }),
    editExercise: builder.mutation({
      query: ({ seshId, exerciseId, updatedExercise }) => ({
        url: `${SESH_URL}/${seshId}/exercises/${exerciseId}`, // updated path
        method: "PUT",
        body: updatedExercise,
      }),
      invalidatesTags: ["Sesh"],
    }),
  }),
});

export const {
  useGetSeshesQuery,
  useAddSeshMutation,
  useGetSeshByIdQuery,
  useDeleteSeshMutation,
  useAddExerciseMutation,
  useDeleteExerciseMutation,
  useEditExerciseMutation,
  useRenameSeshMutation,
} = seshApiSlice;
