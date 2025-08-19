import { apiSlice } from "@/services/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCurrentUser: builder.query({
            query: () => "/api/user/",
            providesTags: ["User"],
            transformResponse: (res) => {
                const userData = {
                    id: res._id,
                    name: [res.firstName, res.lastName].join(" "),
                    email: res.email,
                    jobTitle: res.jobTitle,
                    role: res.role
                };
                
                return userData;
            },
        }),
    }),
});

export const { useGetCurrentUserQuery } = userApiSlice;