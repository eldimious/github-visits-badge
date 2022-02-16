export class Project {
  readonly id: number;

  readonly projectId: string;

  readonly counter: number;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  constructor(_id: number, projectId: string, counter: number, createdAt: Date, updatedAt: Date) {
    this.id = _id;
    this.projectId = projectId;
    this.counter = counter;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
