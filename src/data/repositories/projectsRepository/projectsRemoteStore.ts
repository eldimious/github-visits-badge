/* eslint-disable @typescript-eslint/no-unused-vars */
// import axios from 'axios';
import { IRepositoryFactory } from '../../../common/interfaces/IRepositoryFactory';

// interface IGithubProject {
//   id: number;
//   name: string;
//   full_name: string;
//   owner: {
//     login: string
//   }
// }

interface IRemoteProject {
  id: number;
  projectName: string;
  fullName: string;
  ownerName: string
}

interface IProjectsRemoteStore {
  fetchProject(user: string, repo: string): Promise<IRemoteProject>
}

const projectsRemoteStore = {
  async fetchProject(user: string, repo: string): Promise<IRemoteProject> {
    // const response = await axios.get<IGithubProject>(`https://api.github.com/repos/${user}/${repo}`);
    return {
      id: 1,
      projectName: "response.data.name",
      fullName: "response.data.full_name",
      ownerName: "response.data.owner.login",
    };
  },
};

export const projectsRemoteStoreFactory: IRepositoryFactory<IProjectsRemoteStore> = {
  init(): IProjectsRemoteStore {
    return Object.create(projectsRemoteStore);
  },
};
