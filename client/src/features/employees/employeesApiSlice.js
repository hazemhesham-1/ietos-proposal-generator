import { apiSlice } from "@/services/apiSlice";

export const employeesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEmployees: builder.query({
            query: () => "/api/employees",
            providesTags: ["Employees"],
            transformResponse: (res) => {
                const employees = res.map((employee) => ({
                    id: employee._id,
                    name: [employee.firstName, employee.lastName].join(" "),
                    email: employee.email,
                    jobTitle: employee.jobTitle,
                    role: employee.role
                }));
                
                return employees;
            },
        }),
    }),
});

export const { useGetEmployeesQuery } = employeesApiSlice;