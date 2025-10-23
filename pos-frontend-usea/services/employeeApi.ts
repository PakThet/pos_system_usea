import { api } from "@/lib/api";
import { Employee, CreateEmployeeData } from "@/types/employee";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const employeeApi = {
  async getEmployees(): Promise<ApiResponse<{ current_page: number; data: Employee[] }>> {
    const response = await api.get("/users");
    return response.data;
  },

  async createEmployee(data: CreateEmployeeData): Promise<ApiResponse<Employee>> {
    const response = await api.post("/users", data);
    return response.data;
  },

  async updateEmployee(id: string, data: CreateEmployeeData): Promise<ApiResponse<Employee>> {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  async updateEmployeeStatus(id: string, status: Employee["status"]): Promise<ApiResponse<Employee>> {
    const response = await api.patch(`/users/${id}/status`, { status });
    return response.data;
  },

  async deleteEmployee(id: string): Promise<ApiResponse<null>> {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  async recordEmployeeLogin(id: string): Promise<ApiResponse<Employee>> {
    const response = await api.post(`/users/${id}/login`);
    return response.data;
  },
};
