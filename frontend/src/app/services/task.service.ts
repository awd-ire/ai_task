import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task, TasksResponse, CreateTaskDto, TaskFilters } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(filters?: TaskFilters): Observable<TasksResponse> {
    let params = new HttpParams();
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.status && filters.status !== 'All') params = params.set('status', filters.status);
    if (filters?.priority && filters.priority !== 'All') params = params.set('priority', filters.priority);
    return this.http.get<TasksResponse>(this.apiUrl, { params });
  }

  getTask(id: string): Observable<{ success: boolean; task: Task }> {
    return this.http.get<{ success: boolean; task: Task }>(`${this.apiUrl}/${id}`);
  }

  createTask(dto: CreateTaskDto): Observable<{ success: boolean; task: Task }> {
    return this.http.post<{ success: boolean; task: Task }>(this.apiUrl, dto);
  }

  updateTask(id: string, dto: Partial<CreateTaskDto>): Observable<{ success: boolean; task: Task }> {
    return this.http.put<{ success: boolean; task: Task }>(`${this.apiUrl}/${id}`, dto);
  }

  deleteTask(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  generateDescription(title: string): Observable<{ success: boolean; description: string; domain: string }> {
    return this.http.post<{ success: boolean; description: string; domain: string }>(
      `${this.apiUrl}/generate-description`,
      { title }
    );
  }
}
