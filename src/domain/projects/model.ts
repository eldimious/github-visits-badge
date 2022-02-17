export class Project {
  readonly id: number;

  readonly projectId: string;

  readonly counter: number;

  readonly user: string;

  readonly narepositoryme: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;

  constructor(_id: number, projectId: string, counter: number, user: string, repository: string, createdAt: Date, updatedAt: Date) {
    this.id = _id;
    this.projectId = projectId;
    this.counter = counter;
    this.user = user;
    this.repository = repository;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
